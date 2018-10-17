/// <reference types="webgl2" />
import { Target } from "./target";
import { Command, CommandCreateOptions } from "./command";
import { VertexBuffer, VertexBufferCreateOptions, VertexBufferDataType, VertexBufferDataTypeToTypedArray } from "./vertex-buffer";
import { ElementBuffer, ElementBufferCreateOptions, ElementArray, ElementBufferDataType, ElementBufferDataTypeToTypedArray, ElementPrimitive } from "./element-buffer";
import { Attributes, AttributesConfig, AttributesCreateOptions } from "./attributes";
import { Texture, TextureCreateOptions, TextureStoreOptions, TextureStorageFormat, TextureColorStorageFormat, TextureDepthStorageFormat, TextureDepthStencilStorageFormat, StorageFormatToTypedArray, StorageFormatToFormat, StorageFormatToDataType } from "./texture";
import { Framebuffer } from "./framebuffer";
/**
 * Available extensions.
 */
export declare enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear"
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
export declare class Device {
    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options?: DeviceCreateOptions): Device;
    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static createWithCanvas(canvas: HTMLCanvasElement, options?: DeviceCreateWithCanvasOptions): Device;
    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of it voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static createWithContext(gl: WebGL2RenderingContext, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, }?: DeviceCreateWithContextOptions): Device;
    readonly _gl: WebGL2RenderingContext;
    readonly _canvas: HTMLCanvasElement;
    private explicitPixelRatio?;
    private explicitViewportWidth?;
    private explicitViewportHeight?;
    private state;
    private backbufferTarget;
    private constructor();
    /**
     * Return width of the gl drawing buffer.
     */
    readonly bufferWidth: number;
    /**
     * Return height of the gl drawing buffer.
     */
    readonly bufferHeight: number;
    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    readonly canvasWidth: number;
    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    readonly canvasHeight: number;
    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    readonly canvasCSSWidth: number;
    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    readonly canvasCSSHeight: number;
    /**
     * Return the device pixel ratio for this device
     */
    readonly pixelRatio: number;
    /**
     * Notify the device to check whether updates are needed. This resizes the
     * canvas, if the device pixel ratio or css canvas width/height changed.
     */
    update(): void;
    /**
     * Request a render target from the device to draw into. This gives you the
     * gl.BACK target.
     *
     * Drawing should be done within the callback by
     * calling `target.clear()` or `target.draw()` family of methods.
     *
     * Also see `framebuffer.target()`.
     */
    target(cb: (rt: Target) => void): void;
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
    createCommand<P = void>(vert: string, frag: string, options?: CommandCreateOptions<P>): Command<P>;
    /**
     * Create a new vertex buffer with given type and of given size.
     */
    createVertexBuffer<T extends VertexBufferDataType>(type: T, size: number, options?: VertexBufferCreateOptions): VertexBuffer<T>;
    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createVertexBufferWithTypedArray<T extends VertexBufferDataType>(type: T, data: VertexBufferDataTypeToTypedArray[T], options?: VertexBufferCreateOptions): VertexBuffer<T>;
    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    createElementBuffer<T extends ElementBufferDataType>(type: T, primitive: ElementPrimitive, size: number, options?: ElementBufferCreateOptions): ElementBuffer<T>;
    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    createElementBufferWithArray(data: ElementArray, options?: ElementBufferCreateOptions): ElementBuffer<ElementBufferDataType.UNSIGNED_INT>;
    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createElementBufferWithTypedArray<T extends ElementBufferDataType>(type: T, primitive: ElementPrimitive, data: ElementBufferDataTypeToTypedArray[T], options?: ElementBufferCreateOptions): ElementBuffer<T>;
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
    createAttributes(elements: ElementPrimitive | ElementArray | ElementBuffer<ElementBufferDataType>, attributes: AttributesConfig, options?: AttributesCreateOptions): Attributes;
    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    createEmptyAttributes(primitive: ElementPrimitive, count: number): Attributes;
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    createTexture<S extends TextureStorageFormat>(width: number, height: number, storageFormat: S, options?: TextureCreateOptions): Texture<S>;
    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    createTextureWithImage(image: ImageData, options?: TextureCreateOptions & TextureStoreOptions): Texture<TextureColorStorageFormat.RGBA8>;
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    createTextureWithTypedArray<S extends TextureStorageFormat>(width: number, height: number, internalFormat: S, data: StorageFormatToTypedArray[S], dataFormat: StorageFormatToFormat[S], dataType: StorageFormatToDataType[S], options?: TextureCreateOptions & TextureStoreOptions): Texture<S>;
    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * WebGL will synchronize their usage so they can either be written to via
     * the framebuffer, or written to or read via their own methods.
     */
    createFramebuffer(width: number, height: number, color: Texture<TextureColorStorageFormat> | Texture<TextureColorStorageFormat>[], depthStencil?: Texture<TextureDepthStorageFormat> | Texture<TextureDepthStencilStorageFormat>): Framebuffer;
}
//# sourceMappingURL=device.d.ts.map