import * as assert from "./util/assert";
import * as array from "./util/array";
import {
    BufferUsage,
    Primitive,
    DataType,
    Format,
    InternalFormat,
    Filter,
    Wrap,
    sizeOf,
} from "./types";
import {
    State,
    DepthTestDescriptor,
    StencilTestDescriptor,
    BlendDescriptor,
} from "./state";
import { Target } from "./target";
import {
    Command,
    CommandOptions,
    DepthFunc,
    StencilOp,
    BlendEquation,
} from "./command";
import {
    VertexBuffer,
    VertexBufferOptions,
    VertexBufferType,
    VertexBufferTypeToTypedArray,
} from "./vertex-buffer";
import {
    ElementBuffer,
    ElementBufferOptions,
    ElementArray,
    ElementBufferType,
    ElementBufferTypeToTypedArray,
} from "./element-buffer";
import {
    Attributes,
    AttributesConfig,
    AttributesCreateOptions,
    AttributeDescriptor,
    AttributeType,
} from "./attributes";
import {
    Texture,
    TextureOptions,
    TextureStoreOptions,
    TextureInternalFormat,
    InternalFormatToTypedArray,
    InternalFormatToDataFormat,
    InternalFormatToDataType,
} from "./texture";
import {
    Framebuffer,
    TextureColorInternalFormat,
    TextureDepthInternalFormat,
    TextureDepthStencilInternalFormat,
} from "./framebuffer";


const INT_PATTERN = /^0|[1-9]\d*$/;


export interface DeviceCreateOptions {
    element?: HTMLElement;
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

export interface DeviceWithCanvasOptions {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

export interface DeviceWithContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

/**
 * Available extensions.
 */
export enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear",
}

export class Device {

    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options: DeviceCreateOptions = {}): Device {
        const { element = document.body } = options;
        if (element instanceof HTMLCanvasElement) {
            return Device.withCanvas(element, options);
        }

        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.withCanvas(canvas, options);
    }

    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static withCanvas(
        canvas: HTMLCanvasElement,
        options: DeviceWithCanvasOptions = {},
    ): Device {
        const {
            alpha = true,
            antialias = true,
            depth = true,
            stencil = true,
            preserveDrawingBuffer = false,
        } = options;
        const gl = canvas.getContext("webgl2", {
            alpha,
            antialias,
            depth,
            stencil,
            preserveDrawingBuffer,
        });
        if (!gl) { throw new Error("Could not get webgl2 context"); }
        return Device.withContext(gl, options);
    }

    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of it voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static withContext(
        gl: WebGL2RenderingContext,
        {
            pixelRatio,
            viewportWidth,
            viewportHeight,
            extensions,
            debug,
        }: DeviceWithContextOptions = {},
    ): Device {
        if (extensions) {
            extensions.forEach((ext) => {
                // We currently do not have extensions with callable API
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }

        if (debug) {
            const wrapper = {} as any;
            for (const key in gl) {
                if (typeof (gl as any)[key] === "function") {
                    wrapper[key] = createDebugFunc(gl, key);
                } else {
                    wrapper[key] = (gl as any)[key];
                }
            }
            gl = wrapper;
        }

        return new Device(gl, pixelRatio, viewportWidth, viewportHeight);
    }

    readonly _gl: WebGL2RenderingContext;
    readonly _canvas: HTMLCanvasElement;

    private explicitPixelRatio?: number;
    private explicitViewportWidth?: number;
    private explicitViewportHeight?: number;

    private state: State;
    private backbufferTarget: Target;

    private constructor(
        gl: WebGL2RenderingContext,
        explicitPixelRatio?: number,
        explicitViewportWidth?: number,
        explicitViewportHeight?: number,
    ) {
        this._gl = gl;
        this._canvas = gl.canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewportWidth = explicitViewportWidth;
        this.explicitViewportHeight = explicitViewportHeight;

        this.update();

        this.state = new State(gl);
        this.backbufferTarget = new Target(
            this.state,
            [gl.BACK],
            null,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
        );

        // Enable scissor test globally. Practically everywhere you would want
        // it disbled you can pass explicit scissor box instead. The impact on
        // perf is negligent
        gl.enable(gl.SCISSOR_TEST);
    }

    /**
     * Return width of the gl drawing buffer.
     */
    get bufferWidth(): number {
        return this._gl.drawingBufferWidth;
    }

    /**
     * Return height of the gl drawing buffer.
     */
    get bufferHeight(): number {
        return this._gl.drawingBufferHeight;
    }

    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    get canvasWidth(): number {
        return this._canvas.width;
    }

    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    get canvasHeight(): number {
        return this._canvas.height;
    }

    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSWidth(): number {
        return this._canvas.clientWidth;
    }

    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSHeight(): number {
        return this._canvas.clientHeight;
    }

    /**
     * Return the device pixel ratio for this device
     */
    get pixelRatio(): number {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }

    /**
     * Notify the device to check whether updates are needed. This resizes the
     * canvas, if the device pixel ratio or css canvas width/height changed.
     */
    update(): void {
        const dpr = this.pixelRatio;
        const canvas = this._canvas;
        const width = typeof this.explicitViewportWidth !== "undefined"
            ? this.explicitViewportWidth
            : canvas.clientWidth * dpr;
        const height = typeof this.explicitViewportHeight !== "undefined"
            ? this.explicitViewportHeight
            : canvas.clientHeight * dpr;
        if (width !== canvas.width) { canvas.width = width; }
        if (height !== canvas.height) { canvas.height = height; }
    }

    /**
     * Request a render target from the device to draw into. This gives you the
     * gl.BACK target.
     *
     * Drawing should be done within the callback by
     * calling `target.clear()` or `target.draw()` family of methods.
     *
     * Also see `framebuffer.target()`.
     */
    target(cb: (rt: Target) => void): void {
        this.backbufferTarget.with(cb);
    }

    /**
     * TODO
     */
    createCommand<P = void>(
        vert: string,
        frag: string,
        {
            textures = {},
            uniforms = {},
            depth,
            stencil,
            blend,
        }: CommandOptions<P> = {},
    ): Command<P> {
        assert.nonNull(vert, fmtParamNonNull("vert"));
        assert.nonNull(frag, fmtParamNonNull("frag"));

        const depthDescr = parseDepth(depth);
        const stencilDescr = parseStencil(stencil);
        const blendDescr = parseBlend(blend);

        return new Command(
            this.state,
            vert,
            frag,
            textures,
            uniforms,
            depthDescr,
            stencilDescr,
            blendDescr,
        );
    }

    /**
     * Create a new vertex buffer with given type and of given size.
     */
    createVertexBuffer<T extends VertexBufferType>(
        type: T,
        size: number,
        { usage = BufferUsage.DYNAMIC_DRAW }: VertexBufferOptions = {},
    ): VertexBuffer<T> {
        return new VertexBuffer(
            this._gl,
            type,
            size,
            size * sizeOf(type),
            usage,
        );
    }

    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createVertexBufferWithTypedArray<T extends VertexBufferType>(
        type: T,
        data: VertexBufferTypeToTypedArray[T] | number[],
        { usage = BufferUsage.STATIC_DRAW }: VertexBufferOptions = {},
    ): VertexBuffer<T> {
        return new VertexBuffer(
            this._gl,
            type,
            data.length,
            data.length * sizeOf(type),
            usage,
        ).store(data);
    }

    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    createElementBuffer<T extends ElementBufferType>(
        dev: Device,
        type: T,
        primitive: Primitive,
        size: number,
        { usage = BufferUsage.DYNAMIC_DRAW }: ElementBufferOptions = {},
    ): ElementBuffer<T> {
        return new ElementBuffer(
            dev._gl,
            type,
            primitive,
            size,
            size * sizeOf(type),
            usage,
        );
    }

    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    createElementBufferWithArray(
        data: ElementArray,
        options?: ElementBufferOptions,
    ): ElementBuffer<DataType.UNSIGNED_INT> {
        if (array.is2(data)) {
            const shape = array.shape2(data);
            assert.rangeInclusive(shape[1], 2, 3, (p) => {
                return `Elements must be 2-tuples or 3-tuples, got ${p}-tuple`;
            });
            const ravel = array.ravel2(data, shape);
            const primitive = shape[1] === 3
                ? Primitive.TRIANGLES
                : Primitive.LINES;
            return this.createElementBufferWithTypedArray(
                DataType.UNSIGNED_INT,
                primitive,
                ravel,
            );
        }
        return this.createElementBufferWithTypedArray(
            DataType.UNSIGNED_INT,
            Primitive.POINTS,
            data,
            options,
        );
    }

    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createElementBufferWithTypedArray<T extends ElementBufferType>(
        type: T,
        primitive: Primitive,
        data: ElementBufferTypeToTypedArray[T] | number[],
        { usage = BufferUsage.STATIC_DRAW }: ElementBufferOptions = {},
    ): ElementBuffer<T> {
        return new ElementBuffer(
            this._gl,
            type,
            primitive,
            data.length,
            data.length * sizeOf(type),
            usage,
        ).store(data);
    }

    /**
     * Create new attributes with element and attribute definitions, and an
     * optional count limit.
     *
     * Element definitions can either be a primitive definition, reference an
     * existing element buffer, or have enough information to create an element
     * buffer.
     *
     * Attribute definitions can either reference an existing vertex buffer,
     * or have enough information to create a vertex buffer.
     *
     * Empty attribute definitions are valid. If no attributes nor elements
     * given, there will be no underlying vertex array object created, only the
     * count will be given to gl.drawArrays()
     */
    createAttributes(
        elements: Primitive | ElementArray | ElementBuffer<ElementBufferType>,
        attributes: AttributesConfig,
        { countLimit }: AttributesCreateOptions = {},
    ): Attributes {
        if (typeof countLimit === "number") {
            assert.gt(countLimit, 0, (p) => {
                return `Count limit must be greater than 0, got: ${p}`;
            });
        }

        const attrs = Object.entries(attributes)
            .map(([locationStr, definition]) => {
                if (!INT_PATTERN.test(locationStr)) {
                    throw new Error("Location not a number. Use Command#locate");
                }
                const location = parseInt(locationStr, 10);
                if (Array.isArray(definition)) {
                    if (array.is2(definition)) {
                        const s = array.shape2(definition);
                        const r = array.ravel2(definition, s);
                        return new AttributeDescriptor(
                            location,
                            AttributeType.POINTER,
                            this.createVertexBufferWithTypedArray(
                                DataType.FLOAT,
                                r,
                            ),
                            s[0],
                            s[1],
                            false,
                            0,
                        );
                    }
                    return new AttributeDescriptor(
                        location,
                        AttributeType.POINTER,
                        this.createVertexBufferWithTypedArray(
                            DataType.FLOAT,
                            definition,
                        ),
                        definition.length,
                        1,
                        false,
                        0,
                    );
                }

                return new AttributeDescriptor(
                    location,
                    definition.type,
                    Array.isArray(definition.buffer)
                        ? this.createVertexBufferWithTypedArray(
                            DataType.FLOAT,
                            definition.buffer,
                        )
                        : definition.buffer,
                    definition.count,
                    definition.size,
                    definition.type === AttributeType.POINTER
                        ? (definition.normalized || false)
                        : false,
                    definition.divisor || 0,
                );
            });

        let primitive: Primitive;
        let elementBuffer: ElementBuffer<ElementBufferType> | undefined;
        if (typeof elements === "number") {
            primitive = elements;
        } else {
            elementBuffer = elements instanceof ElementBuffer
                ? elements
                : this.createElementBufferWithArray(elements);
            primitive = elementBuffer.primitive;
        }

        const inferredCount = elementBuffer
            ? elementBuffer.length
            : attrs.length
                ? attrs
                    .map((attr) => attr.count)
                    .reduce((min, curr) => Math.min(min, curr))
                : 0;
        const count = typeof countLimit === "number"
            ? Math.min(countLimit, inferredCount)
            : inferredCount;

        const instAttrs = attrs.filter((attr) => !!attr.divisor);
        const instanceCount = instAttrs.length
            ? instAttrs
                .map((attr) => attr.count * attr.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        return new Attributes(
            this.state,
            primitive,
            attrs,
            count,
            instanceCount,
            elementBuffer,
        );
    }

    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    createEmptyAttributes(
        primitive: Primitive,
        count: number,
    ): Attributes {
        return new Attributes(this.state, primitive, [], count, 0);
    }

    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    createTexture<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        {
            min = Filter.NEAREST,
            mag = Filter.NEAREST,
            wrapS = Wrap.CLAMP_TO_EDGE,
            wrapT = Wrap.CLAMP_TO_EDGE,
        }: TextureOptions = {},
    ): Texture<F> {
        return new Texture(
            dev._gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        );
    }

    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    createTextureWithImage(
        dev: Device,
        image: ImageData,
        options?: TextureOptions & TextureStoreOptions,
    ): Texture<InternalFormat.RGBA8> {
        return this.createTextureWithTypedArray(
            dev,
            image.width,
            image.height,
            InternalFormat.RGBA8,
            image.data,
            Format.RGBA,
            DataType.UNSIGNED_BYTE,
            options,
        );
    }

    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    createTextureWithTypedArray<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        data: InternalFormatToTypedArray[F],
        dataFormat: InternalFormatToDataFormat[F],
        dataType: InternalFormatToDataType[F],
        options: TextureOptions & TextureStoreOptions = {},
    ): Texture<F> {
        const {
            min = Filter.NEAREST,
            mag = Filter.NEAREST,
            wrapS = Wrap.CLAMP_TO_EDGE,
            wrapT = Wrap.CLAMP_TO_EDGE,
        } = options;
        return new Texture(
            dev._gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        ).store(data, dataFormat, dataType, options);
    }

    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * It is still an error to use the attachments while they are written to
     * via the framebuffer, however.
     */
    createFramebuffer(
        width: number,
        height: number,
        color:
            | Texture<TextureColorInternalFormat>
            | Texture<TextureColorInternalFormat>[],
        depthStencil?:
            | Texture<TextureDepthInternalFormat>
            | Texture<TextureDepthStencilInternalFormat>,
    ): Framebuffer {
        const colors = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colors, () => {
            return "Framebuffer color attachments must not be empty";
        });
        colors.forEach((buffer) => {
            assert.equal(width, buffer.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.equal(height, buffer.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        });

        if (depthStencil) {
            assert.equal(width, depthStencil.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.equal(height, depthStencil.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }

        return new Framebuffer(this.state, width, height, colors, depthStencil);
    }
}

function parseDepth(
    depth: CommandOptions<void>["depth"],
): DepthTestDescriptor | undefined {
    if (!depth) { return undefined; }
    assert.nonNull(depth.func, fmtParamNonNull("depth.func"));
    return new DepthTestDescriptor(
        depth.func || DepthFunc.LESS,
        typeof depth.mask === "boolean" ? depth.mask : true,
        depth.range ? depth.range[0] : 0,
        depth.range ? depth.range[1] : 1,
    );
}

function parseStencil(
    stencil: CommandOptions<void>["stencil"],
): StencilTestDescriptor | undefined {
    if (!stencil) { return undefined; }
    assert.nonNull(stencil.func, fmtParamNonNull("stencil.func"));
    // TODO: complete stencil validation... validation framework?
    return new StencilTestDescriptor(
        typeof stencil.func.func === "object"
            ? stencil.func.func.front
            : stencil.func.func,
        typeof stencil.func.func === "object"
            ? stencil.func.func.back
            : stencil.func.func,
        typeof stencil.func.ref !== "undefined"
            ? typeof stencil.func.ref === "object"
                ? stencil.func.ref.front
                : stencil.func.ref
            : 1,
        typeof stencil.func.ref !== "undefined"
            ? typeof stencil.func.ref === "object"
                ? stencil.func.ref.back
                : stencil.func.ref
            : 1,
        typeof stencil.func.mask !== "undefined"
            ? typeof stencil.func.mask === "object"
                ? stencil.func.mask.front
                : stencil.func.mask
            : 0xFF,
        typeof stencil.func.mask !== "undefined"
            ? typeof stencil.func.mask === "object"
                ? stencil.func.mask.back
                : stencil.func.mask
            : 0xFF,
        typeof stencil.mask !== "undefined"
            ? typeof stencil.mask === "object"
                ? stencil.mask.front
                : stencil.mask
            : 0xFF,
        typeof stencil.mask !== "undefined"
            ? typeof stencil.mask === "object"
                ? stencil.mask.back
                : stencil.mask
            : 0xFF,
        stencil.op
            ? typeof stencil.op.fail === "object"
                ? stencil.op.fail.front
                : stencil.op.fail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.fail === "object"
                ? stencil.op.fail.back
                : stencil.op.fail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zfail === "object"
                ? stencil.op.zfail.front
                : stencil.op.zfail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zfail === "object"
                ? stencil.op.zfail.back
                : stencil.op.zfail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zpass === "object"
                ? stencil.op.zpass.front
                : stencil.op.zpass
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zpass === "object"
                ? stencil.op.zpass.back
                : stencil.op.zpass
            : StencilOp.KEEP,
    );
}

function parseBlend(
    blend: CommandOptions<void>["blend"],
): BlendDescriptor | undefined {
    if (!blend) { return undefined; }
    assert.nonNull(blend.func, fmtParamNonNull("blend.func"));
    assert.nonNull(blend.func.src, fmtParamNonNull("blend.func.src"));
    assert.nonNull(blend.func.dst, fmtParamNonNull("blend.func.dst"));
    if (typeof blend.func.src === "object") {
        assert.nonNull(
            blend.func.src.rgb,
            fmtParamNonNull("blend.func.src.rgb"),
        );
        assert.nonNull(
            blend.func.src.alpha,
            fmtParamNonNull("blend.func.src.alpha"),
        );
    }
    if (typeof blend.func.dst === "object") {
        assert.nonNull(
            blend.func.dst.rgb,
            fmtParamNonNull("blend.func.dst.rgb"),
        );
        assert.nonNull(
            blend.func.dst.alpha,
            fmtParamNonNull("blend.func.dst.alpha"),
        );
    }
    return new BlendDescriptor(
        typeof blend.func.src === "object"
            ? blend.func.src.rgb
            : blend.func.src,
        typeof blend.func.src === "object"
            ? blend.func.src.alpha
            : blend.func.src,
        typeof blend.func.dst === "object"
            ? blend.func.dst.rgb
            : blend.func.dst,
        typeof blend.func.dst === "object"
            ? blend.func.dst.alpha
            : blend.func.dst,
        blend.equation
            ? typeof blend.equation === "object"
                ? blend.equation.rgb
                : blend.equation
            : BlendEquation.FUNC_ADD,
        blend.equation
            ? typeof blend.equation === "object"
                ? blend.equation.alpha
                : blend.equation
            : BlendEquation.FUNC_ADD,
        blend.color,
    );
}

function fmtParamNonNull(name: string): () => string {
    return () => `Missing parameter ${name}`;
}

function createDebugFunc(gl: any, key: string): (...args: any[]) => any {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}
