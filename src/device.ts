import * as assert from "./util/assert";
import { State } from "./state";
import { Target } from "./target";
import {
    Command,
    CommandCreateOptions,
    _createCommand,
} from "./command";
import {
    VertexBuffer,
    VertexBufferCreateOptions,
    VertexBufferDataType,
    VertexBufferDataTypeToTypedArray,
    _createVertexBuffer,
    _createVertexBufferWithTypedArray,
} from "./vertex-buffer";
import {
    ElementBuffer,
    ElementBufferCreateOptions,
    ElementArray,
    ElementBufferDataType,
    ElementBufferDataTypeToTypedArray,
    ElementPrimitive,
    _createElementBuffer,
    _createElementBufferWithArray,
    _createElementBufferWithTypedArray,
} from "./element-buffer";
import {
    Attributes,
    AttributesConfig,
    AttributesCreateOptions,
    _createAttributes,
} from "./attributes";
import {
    Texture2D,
    Texture2DCreateOptions,
    Texture2DStoreOptions,
    TextureCubeMapCreateOptions,
    TextureCubeMapStoreOptions,
    TextureStorageFormat,
    TextureColorStorageFormat,
    TextureDepthStorageFormat,
    TextureDepthStencilStorageFormat,
    TextureFormat,
    TextureDataType,
    StorageFormatToTypedArray,
    StorageFormatToFormat,
    StorageFormatToDataType,
    _createTexture2D,
    _createTexture2DWithTypedArray,
    _createTextureCubeMap,
    _createTextureCubeMapWithTypedArray,
    TextureCubeMap,
} from "./texture";
import {
    Renderbuffer,
    RenderbufferCreateOptions,
    RenderbufferStorageFormat,
    RenderbufferColorStorageFormat,
    RenderbufferDepthStorageFormat,
    RenderbufferDepthStencilStorageFormat,
    _createRenderbuffer,
} from "./renderbuffer";
import { Framebuffer, _createFramebuffer } from "./framebuffer";


/**
 * Available extensions.
 */
export enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear",
}

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

export interface DeviceCreateWithCanvasOptions {
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

export interface DeviceCreateWithContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

export class Device {

    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options: DeviceCreateOptions = {}): Device {
        const { element = document.body } = options;
        if (element instanceof HTMLCanvasElement) {
            return Device.createWithCanvas(element, options);
        }

        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.createWithCanvas(canvas, options);
    }

    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static createWithCanvas(
        canvas: HTMLCanvasElement,
        options: DeviceCreateWithCanvasOptions = {},
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
        return Device.createWithContext(gl, options);
    }

    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of it voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static createWithContext(
        gl: WebGL2RenderingContext,
        {
            pixelRatio,
            viewportWidth,
            viewportHeight,
            extensions,
            debug,
        }: DeviceCreateWithContextOptions = {},
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
            gl = Object.entries(gl).reduce((accum, [k, v]) => ({
                ...accum,
                [k]: v === "function" ? createDebugFunc(gl, k) : v,
            }), gl);
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
     * Create a new command with given vertex and fragment shader.
     *
     * Commands contain WebGL programs, but also WebGL configuration needed
     * for drawing: blend, depth test and stencil test configurations, and
     * uniform callbacks. Uniform callbacks transform recieved props into
     * uniform values when the command is executed, but if constant, they
     * will eagerly upload the uniform values to the shaders and not do
     * at in execution time.
     */
    createCommand<P = void>(
        vert: string,
        frag: string,
        options?: CommandCreateOptions<P>,
    ): Command<P> {
        return _createCommand(this.state, vert, frag, options);
    }

    /**
     * Create a new vertex buffer with given type and of given size.
     */
    createVertexBuffer<T extends VertexBufferDataType>(
        type: T,
        size: number,
        options?: VertexBufferCreateOptions,
    ): VertexBuffer<T> {
        return _createVertexBuffer(this._gl, type, size, options);
    }

    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createVertexBufferWithTypedArray<T extends VertexBufferDataType>(
        type: T,
        data: VertexBufferDataTypeToTypedArray[T],
        options?: VertexBufferCreateOptions,
    ): VertexBuffer<T> {
        return _createVertexBufferWithTypedArray(
            this._gl,
            type,
            data,
            options,
        );
    }

    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    createElementBuffer<T extends ElementBufferDataType>(
        type: T,
        primitive: ElementPrimitive,
        size: number,
        options?: ElementBufferCreateOptions,
    ): ElementBuffer<T> {
        return _createElementBuffer(this._gl, type, primitive, size, options);
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
        options?: ElementBufferCreateOptions,
    ): ElementBuffer<ElementBufferDataType.UNSIGNED_INT> {
        return _createElementBufferWithArray(this._gl, data, options);
    }

    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createElementBufferWithTypedArray<T extends ElementBufferDataType>(
        type: T,
        primitive: ElementPrimitive,
        data: ElementBufferDataTypeToTypedArray[T],
        options?: ElementBufferCreateOptions,
    ): ElementBuffer<T> {
        return _createElementBufferWithTypedArray(
            this._gl,
            type,
            primitive,
            data,
            options,
        );
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
        elements:
            | ElementPrimitive
            | ElementArray
            | ElementBuffer<ElementBufferDataType>,
        attributes: AttributesConfig,
        options?: AttributesCreateOptions,
    ): Attributes {
        return _createAttributes(this.state, elements, attributes, options);
    }

    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    createEmptyAttributes(
        primitive: ElementPrimitive,
        count: number,
    ): Attributes {
        return new Attributes(this.state, primitive, [], count, 0);
    }

    /**
     * Create a new 2D texture with given width, height, and storage format.
     * The storage format determines what kind of data is possible to store.
     */
    createTexture2D<S extends TextureStorageFormat>(
        width: number,
        height: number,
        storageFormat: S,
        options?: Texture2DCreateOptions,
    ): Texture2D<S> {
        return _createTexture2D(
            this._gl,
            width,
            height,
            storageFormat,
            options,
        );
    }

    /**
     * Create a new 2D texture with width and height equal to that of the given
     * image and store the image in the texture.
     * The storage format determines what kind of data is possible to store and
     * is preset as RGBA8.
     */
    createTexture2DWithImage(
        image: ImageData,
        options?: Texture2DCreateOptions & Texture2DStoreOptions,
    ): Texture2D<TextureColorStorageFormat.RGBA8> {
        return _createTexture2DWithTypedArray(
            this._gl,
            image.width,
            image.height,
            TextureColorStorageFormat.RGBA8,
            image.data,
            TextureFormat.RGBA,
            TextureDataType.UNSIGNED_BYTE,
            options,
        );
    }

    /**
     * Create a new 2D texture with given width, height, and storage format and
     * store data of given format and type contained in the provided typed array
     * to the texture.
     * The storage format determines what kind of data is possible to store.
     */
    createTexture2DWithTypedArray<S extends TextureStorageFormat>(
        width: number,
        height: number,
        storageFormat: S,
        data: StorageFormatToTypedArray[S],
        dataFormat: StorageFormatToFormat[S],
        dataType: StorageFormatToDataType[S],
        options?: Texture2DCreateOptions & Texture2DStoreOptions,
    ): Texture2D<S> {
        return _createTexture2DWithTypedArray(
            this._gl,
            width,
            height,
            storageFormat,
            data,
            dataFormat,
            dataType,
            options,
        );
    }

    /**
     * Create a new cubemap texture where each face has a given width, height,
     * and storage format.
     * The storage format determines what kind of data is possible to store.
     */
    createTextureCubeMap<S extends TextureStorageFormat>(
        width: number,
        height: number,
        storageFormat: S,
        options?: TextureCubeMapCreateOptions,
    ): TextureCubeMap<S> {
        return _createTextureCubeMap(
            this._gl,
            width,
            height,
            storageFormat,
            options,
        );
    }

    /**
     * Create a new cubemap texture where each face has a width and height equal
     * to that of the given images and store the provided images in the
     * cubemap's faces.
     * The storage format determines what kind of data is possible to store and
     * is preset as RGBA8.
     * Each image must have the same dimensions.
     */
    createTextureCubeMapWithImage(
        imagePositiveX: ImageData,
        imageNegativeX: ImageData,
        imagePositiveY: ImageData,
        imageNegativeY: ImageData,
        imagePositiveZ: ImageData,
        imageNegativeZ: ImageData,
        options?: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions,
    ): TextureCubeMap<TextureColorStorageFormat.RGBA8> {

        const width = imagePositiveX.width;
        const height = imagePositiveX.height;

        // Assert all images have same sizes
        assert.is(imageNegativeX.width, width, fmtImageDimsMismatch);
        assert.is(imagePositiveY.width, width, fmtImageDimsMismatch);
        assert.is(imageNegativeY.width, width, fmtImageDimsMismatch);
        assert.is(imagePositiveZ.width, width, fmtImageDimsMismatch);
        assert.is(imageNegativeZ.width, width, fmtImageDimsMismatch);

        assert.is(imageNegativeX.height, height, fmtImageDimsMismatch);
        assert.is(imagePositiveY.height, height, fmtImageDimsMismatch);
        assert.is(imageNegativeY.height, height, fmtImageDimsMismatch);
        assert.is(imagePositiveZ.height, height, fmtImageDimsMismatch);
        assert.is(imageNegativeZ.height, height, fmtImageDimsMismatch);

        return _createTextureCubeMapWithTypedArray(
            this._gl,
            imagePositiveX.width,
            imagePositiveY.height,
            TextureColorStorageFormat.RGBA8,
            imagePositiveX.data,
            imageNegativeX.data,
            imagePositiveY.data,
            imageNegativeY.data,
            imagePositiveZ.data,
            imageNegativeZ.data,
            TextureFormat.RGBA,
            TextureDataType.UNSIGNED_BYTE,
            options,
        );
    }

    /**
     * Create a new cubemap texture where each face has a given width, height,
     * and storage format and store data contained in the provided typed arrays
     * in the cubemap's faces.
     * The storage format determines what kind of data is possible to store.
     * Each typed array must have the same length.
     */
    createTextureCubeMapWithTypedArray<S extends TextureStorageFormat>(
        width: number,
        height: number,
        storageFormat: S,
        dataPositiveX: StorageFormatToTypedArray[S],
        dataNegativeX: StorageFormatToTypedArray[S],
        dataPositiveY: StorageFormatToTypedArray[S],
        dataNegativeY: StorageFormatToTypedArray[S],
        dataPositiveZ: StorageFormatToTypedArray[S],
        dataNegativeZ: StorageFormatToTypedArray[S],
        dataFormat: StorageFormatToFormat[S],
        dataType: StorageFormatToDataType[S],
        options?: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions,
    ): TextureCubeMap<S> {
        return _createTextureCubeMapWithTypedArray(
            this._gl,
            width,
            height,
            storageFormat,
            dataPositiveX,
            dataNegativeX,
            dataPositiveY,
            dataNegativeY,
            dataPositiveZ,
            dataNegativeZ,
            dataFormat,
            dataType,
            options,
        );
    }

    /**
     * Create a new renderbuffer with given width, height, and storage format.
     * Pass in `options.samples` to configure multisampling.
     */
    createRenderbuffer<S extends RenderbufferStorageFormat>(
        width: number,
        height: number,
        storageFormat: S,
        options?: RenderbufferCreateOptions,
    ): Renderbuffer<S> {
        return _createRenderbuffer(
            this._gl,
            width,
            height,
            storageFormat,
            options,
        );
    }

    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * WebGL will synchronize their usage so they can either be written to via
     * the framebuffer, or written to or read via their own methods.
     */
    createFramebuffer(
        width: number,
        height: number,
        color:
            | Texture2D<TextureColorStorageFormat>
            | Texture2D<TextureColorStorageFormat>[]
            | Renderbuffer<RenderbufferColorStorageFormat>
            | Renderbuffer<RenderbufferColorStorageFormat>[],
        depthStencil?:
            | Texture2D<TextureDepthStorageFormat>
            | Texture2D<TextureDepthStencilStorageFormat>
            | Renderbuffer<RenderbufferDepthStorageFormat>
            | Renderbuffer<RenderbufferDepthStencilStorageFormat>,
    ): Framebuffer {
        return _createFramebuffer(
            this.state,
            width,
            height,
            color,
            depthStencil,
        );
    }
}

function createDebugFunc(
    gl: { [key: string]: any },
    key: string,
): (...args: unknown[]) => unknown {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}

function fmtImageDimsMismatch() {
    return "All provided images must have the same dimensions";
}
