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

export interface DeviceCreateWithCanvasElementOptions {
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

export interface DeviceCreateWithWebGLContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

export class Device {
    /**
     * Create a new device from existing `HTMLCanvasElement`. Does not take
     * ownership of canvas.
     */
    static createWithCanvasElement(
        canvas: HTMLCanvasElement,
        options: DeviceCreateWithCanvasElementOptions = {},
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

        if (!gl) {
            throw new Error("Could not get WebGL2 context");
        }

        return Device.createWithWebGLContext(gl, options);
    }

    /**
     * Create a new device from existing WebGL context. Does not take ownership
     * of context, but concurrent usage may be the source of bugs. Be sure to
     * know what you are doing.
     *
     * Note that only contexts created from `HTMLCanvasElement` are supported
     * and contexts create from `OffscreenCanvas` will fail.
     *
     * Also see `device.reset()`.
     */
    static createWithWebGLContext(
        gl: WebGL2RenderingContext,
        {
            pixelRatio,
            viewportWidth,
            viewportHeight,
            extensions,
            debug,
        }: DeviceCreateWithWebGLContextOptions = {},
    ): Device {
        // We need to check whether the provided canvas isn't offscreen, but
        // only if our current platform supports it. Note that `OffscreenCanvas`
        // is accessed from `globalThis` (falling back to `self` for older
        // platforms) to prevent name reference errors.

        let canvas: HTMLCanvasElement;

        const g = typeof globalThis === "undefined" ? self : globalThis;
        if (g.OffscreenCanvas && gl.canvas instanceof g.OffscreenCanvas) {
            throw new Error("Offscreen canvas is not supported yet");
        } else {
            canvas = gl.canvas as HTMLCanvasElement;
        }

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

        return new Device(gl, canvas, pixelRatio, viewportWidth, viewportHeight);
    }

    private gl: WebGL2RenderingContext;
    private canvas: HTMLCanvasElement;

    private explicitPixelRatio?: number;
    private explicitViewportWidth?: number;
    private explicitViewportHeight?: number;

    private state: State;
    private backbufferTarget: Target;

    private constructor(
        gl: WebGL2RenderingContext,
        canvas: HTMLCanvasElement,
        explicitPixelRatio?: number,
        explicitViewportWidth?: number,
        explicitViewportHeight?: number,
    ) {
        this.gl = gl;
        this.canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewportWidth = explicitViewportWidth;
        this.explicitViewportHeight = explicitViewportHeight;

        this.resizeToFit();

        this.state = new State(gl);
        this.backbufferTarget = new Target(
            this.state,
            [gl.BACK],
            null,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
        );

        // Enable scissor test globally. Practically everywhere you would want
        // it disabled you can pass explicit scissor box instead. The impact on
        // perf is negligent.
        gl.enable(gl.SCISSOR_TEST);
    }

    /**
     * Return width of the WebGL drawing buffer in physical (device)
     * pixels. This will usually be the same as
     * `device.requestedPhysicalWidth`, but can be smaller if WebGL
     * decides to allocate a smaller drawing buffer than requested,
     * e.g. when the size is not supported by hardware.
     */
    get physicalWidth(): number {
        return this.gl.drawingBufferWidth;
    }

    /**
     * Return height of the WebGL drawing buffer in physical
     * (device) pixels. This will usually be the same as
     * `device.requestedPhysicalHeight`, but can be smaller if WebGL
     * decides to allocate a smaller drawing buffer than requested,
     * e.g. when the size is not supported by hardware.
     */
    get physicalHeight(): number {
        return this.gl.drawingBufferHeight;
    }

    /**
     * Return width of the canvas in physical (device) pixels. This
     * will usually be the same as `device.physicalWidth`.
     */
    get requestedPhysicalWidth(): number {
        return this.canvas.width;
    }

    /**
     * Return height of the canvas in physical (device) pixels. This
     * will usually be the same as `device.physicalHeight`.
     */
    get requestedPhysicalHeight(): number {
        return this.canvas.height;
    }

    /**
     * Return width of canvas in logical (CSS) pixels (before applying
     * device pixel ratio). This is useful for e.g. computing the
     * position of mouse events.
     */
    get logicalWidth(): number {
        return this.canvas.clientWidth;
    }

    /**
     * Return height of canvas in logical (CSS) pixels (before
     * applying device pixel ratio). This is useful for e.g. computing
     * the position of mouse events.
     */
    get logicalHeight(): number {
        return this.canvas.clientHeight;
    }

    /**
     * Return the device pixel ratio for this device.
     */
    get pixelRatio(): number {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }

    /**
     * Resize the canvas if the device pixel ratio or canvas
     * dimensions changed.
     */
    resizeToFit(): void {
        const dpr = this.pixelRatio;
        const canvas = this.canvas;
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
        return _createVertexBuffer(this.gl, type, size, options);
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
            this.gl,
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
        return _createElementBuffer(this.gl, type, primitive, size, options);
    }

    // TODO(yan): Remove. This may be convenient, but it is also ineffiecient.
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
        return _createElementBufferWithArray(this.gl, data, options);
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
            this.gl,
            type,
            primitive,
            data,
            options,
        );
    }

    // TODO(yan): Remove the option to pass ElementArray below. While
    // convenient, it is ineffiecient.
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
            this.gl,
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
            this.gl,
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
            this.gl,
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
            this.gl,
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
            this.gl,
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
            this.gl,
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
            this.gl,
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

    /**
     * Reset all tracked WebGL state.
     *
     * Instead of always issuing calls to WebGL, we sometimes remember
     * various pieces of it's state ourselves. This works great for
     * preventing state transitions when rendering while keeping the
     * rendering code straightforward, but breaks apart once we have
     * to share the WebGL context with someone else.
     *
     * `device.reset()` is an escape hatch that notifies the device
     * that it should no longer trust the values it has
     * remembered. Use it when using `webglutenfree` with another
     * WebGL wrapper, such as `three.js`, or when needing to use the
     * GL context yourself. Note that calling `device.reset()` with
     * any resources bound is an error, i.e. don't do this:
     *
     * ```typescript
     * dev.target((rt) => {
     *     // Trying to reset the device while rendering is an error!
     *     dev.reset();
     * });
     * ```
     *
     * Also see `Device.createWithWebGLContext()`.
     */
    reset(): void {
        this.state.reset();
    }
}

function createDebugFunc(
    gl: { [key: string]: any },
    key: string,
): (...args: unknown[]) => unknown {
    return () => {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}

function fmtImageDimsMismatch(): string {
    return "All provided images must have the same dimensions";
}
