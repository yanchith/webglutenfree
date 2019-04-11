/// <reference types="webgl2" />
import { State } from "./state";
import { Target } from "./target";
import { Command, CreateCommandOptions } from "./command";
import { VertexBuffer, VertexBufferCreateOptions, VertexBufferDataType, VertexBufferDataTypeToTypedArray } from "./vertex-buffer";
import { ElementBuffer, ElementBufferCreateOptions, ElementArray, ElementBufferDataType, ElementBufferDataTypeToTypedArray, ElementPrimitive } from "./element-buffer";
import { Attributes, AttributesConfig, AttributesCreateOptions } from "./attributes";
import { Texture2D, Texture2DCreateOptions, Texture2DStoreOptions, TextureCubeMapCreateOptions, TextureCubeMapStoreOptions, TextureStorageFormat, TextureColorStorageFormat, TextureDepthStorageFormat, TextureDepthStencilStorageFormat, StorageFormatToTypedArray, StorageFormatToFormat, StorageFormatToDataType, TextureCubeMap } from "./texture";
import { Renderbuffer, RenderbufferCreateOptions, RenderbufferStorageFormat, RenderbufferColorStorageFormat, RenderbufferDepthStorageFormat, RenderbufferDepthStencilStorageFormat } from "./renderbuffer";
import { Framebuffer } from "./framebuffer";
/**
 * Available extensions.
 */
export declare enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear"
}
export interface CreateDeviceOptions {
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
export interface CreateDeviceWithCanvasOptions {
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
export interface CreateDeviceWithContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}
/**
 * Create a new canvas and device (containing a gl context). Mount it on
 * `element` parameter (default is `document.body`).
 */
export declare function createDevice(options?: CreateDeviceOptions): Device;
/**
 * Create a new device from existing canvas. Does not take ownership of
 * canvas.
 */
export declare function createDeviceWithCanvas(canvas: HTMLCanvasElement, options?: CreateDeviceWithCanvasOptions): Device;
/**
 * Create a new device from existing gl context. Does not take ownership of
 * context, but concurrent usage of it voids the warranty. Only use
 * concurrently when absolutely necessary.
 */
export declare function createDeviceWithContext(gl: WebGL2RenderingContext, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, }?: CreateDeviceWithContextOptions): Device;
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
export declare function createCommand<P = void>(dev: Device, vert: string, frag: string, options?: CreateCommandOptions<P>): Command<P>;
/**
 * Create a new vertex buffer with given type and of given size.
 */
export declare function createVertexBuffer<T extends VertexBufferDataType>(dev: Device, type: T, size: number, options?: VertexBufferCreateOptions): VertexBuffer<T>;
/**
 * Create a new vertex buffer of given type with provided data. Does not
 * take ownership of data.
 */
export declare function createVertexBufferWithTypedArray<T extends VertexBufferDataType>(dev: Device, type: T, data: VertexBufferDataTypeToTypedArray[T], options?: VertexBufferCreateOptions): VertexBuffer<T>;
/**
 * Create a new element buffer with given type, primitive, and size.
 */
export declare function createElementBuffer<T extends ElementBufferDataType>(dev: Device, type: T, primitive: ElementPrimitive, size: number, options?: ElementBufferCreateOptions): ElementBuffer<T>;
/**
 * Create a new element buffer from potentially nested array. Infers
 * Primitive from the array's shape:
 *   number[] -> POINTS
 *   [number, number][] -> LINES
 *   [number, number, number][] -> TRIANGLES
 * Does not take ownership of data.
 */
export declare function createElementBufferWithArray(dev: Device, data: ElementArray, options?: ElementBufferCreateOptions): ElementBuffer<ElementBufferDataType.UNSIGNED_INT>;
/**
 * Create a new element buffer of given type with provided data. Does not
 * take ownership of data.
 */
export declare function createElementBufferWithTypedArray<T extends ElementBufferDataType>(dev: Device, type: T, primitive: ElementPrimitive, data: ElementBufferDataTypeToTypedArray[T], options?: ElementBufferCreateOptions): ElementBuffer<T>;
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
export declare function createAttributes(dev: Device, elements: ElementPrimitive | ElementArray | ElementBuffer<ElementBufferDataType>, attributes: AttributesConfig, options?: AttributesCreateOptions): Attributes;
/**
 * Create empty attributes of a given primitive. This actually performs no
 * gl calls, only remembers the count for `gl.drawArrays()`
 */
export declare function createEmptyAttributes(dev: Device, primitive: ElementPrimitive, count: number): Attributes;
/**
 * Create a new 2D texture with given width, height, and storage format.
 * The storage format determines what kind of data is possible to store.
 */
export declare function createTexture2D<S extends TextureStorageFormat>(dev: Device, width: number, height: number, storageFormat: S, options?: Texture2DCreateOptions): Texture2D<S>;
/**
 * Create a new 2D texture with width and height equal to that of the given
 * image and store the image in the texture.
 * The storage format determines what kind of data is possible to store and
 * is preset as RGBA8.
 */
export declare function createTexture2DWithImage(dev: Device, image: ImageData, options?: Texture2DCreateOptions & Texture2DStoreOptions): Texture2D<TextureColorStorageFormat.RGBA8>;
/**
 * Create a new 2D texture with given width, height, and storage format and
 * store data of given format and type contained in the provided typed array
 * to the texture.
 * The storage format determines what kind of data is possible to store.
 */
export declare function createTexture2DWithTypedArray<S extends TextureStorageFormat>(dev: Device, width: number, height: number, storageFormat: S, data: StorageFormatToTypedArray[S], dataFormat: StorageFormatToFormat[S], dataType: StorageFormatToDataType[S], options?: Texture2DCreateOptions & Texture2DStoreOptions): Texture2D<S>;
/**
 * Create a new cubemap texture where each face has a given width, height,
 * and storage format.
 * The storage format determines what kind of data is possible to store.
 */
export declare function createTextureCubeMap<S extends TextureStorageFormat>(dev: Device, width: number, height: number, storageFormat: S, options?: TextureCubeMapCreateOptions): TextureCubeMap<S>;
/**
 * Create a new cubemap texture where each face has a width and height equal
 * to that of the given images and store the provided images in the
 * cubemap's faces.
 * The storage format determines what kind of data is possible to store and
 * is preset as RGBA8.
 * Each image must have the same dimensions.
 */
export declare function createTextureCubeMapWithImage(dev: Device, imagePositiveX: ImageData, imageNegativeX: ImageData, imagePositiveY: ImageData, imageNegativeY: ImageData, imagePositiveZ: ImageData, imageNegativeZ: ImageData, options?: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions): TextureCubeMap<TextureColorStorageFormat.RGBA8>;
/**
 * Create a new cubemap texture where each face has a given width, height,
 * and storage format and store data contained in the provided typed arrays
 * in the cubemap's faces.
 * The storage format determines what kind of data is possible to store.
 * Each typed array must have the same length.
 */
export declare function createTextureCubeMapWithTypedArray<S extends TextureStorageFormat>(dev: Device, width: number, height: number, storageFormat: S, dataPositiveX: StorageFormatToTypedArray[S], dataNegativeX: StorageFormatToTypedArray[S], dataPositiveY: StorageFormatToTypedArray[S], dataNegativeY: StorageFormatToTypedArray[S], dataPositiveZ: StorageFormatToTypedArray[S], dataNegativeZ: StorageFormatToTypedArray[S], dataFormat: StorageFormatToFormat[S], dataType: StorageFormatToDataType[S], options?: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions): TextureCubeMap<S>;
/**
 * Create a new renderbuffer with given width, height, and storage format.
 * Pass in `options.samples` to configure multisampling.
 */
export declare function createRenderbuffer<S extends RenderbufferStorageFormat>(dev: Device, width: number, height: number, storageFormat: S, options?: RenderbufferCreateOptions): Renderbuffer<S>;
/**
 * Create a framebuffer containg one or more color buffers and a
 * depth or depth-stencil buffer with given width and height.
 *
 * Does not take ownership of provided attachments, only references them.
 * WebGL will synchronize their usage so they can either be written to via
 * the framebuffer, or written to or read via their own methods.
 */
export declare function createFramebuffer(dev: Device, width: number, height: number, color: Texture2D<TextureColorStorageFormat> | Texture2D<TextureColorStorageFormat>[] | Renderbuffer<RenderbufferColorStorageFormat> | Renderbuffer<RenderbufferColorStorageFormat>[], depthStencil?: Texture2D<TextureDepthStorageFormat> | Texture2D<TextureDepthStencilStorageFormat> | Renderbuffer<RenderbufferDepthStorageFormat> | Renderbuffer<RenderbufferDepthStencilStorageFormat>): Framebuffer;
export declare class Device {
    readonly _gl: WebGL2RenderingContext;
    readonly _canvas: HTMLCanvasElement;
    readonly _state: State;
    private explicitPixelRatio?;
    private explicitViewportWidth?;
    private explicitViewportHeight?;
    private backbufferTarget;
    protected constructor(gl: WebGL2RenderingContext, explicitPixelRatio?: number, explicitViewportWidth?: number, explicitViewportHeight?: number);
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
}
//# sourceMappingURL=device.d.ts.map