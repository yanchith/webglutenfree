import { DataType } from "./types";
import { Device as _Device } from "./device";
export declare enum TextureWrap {
    CLAMP_TO_EDGE = 33071,
    REPEAT = 10497,
    MIRRORED_REPEAT = 33648,
}
export declare enum TextureFilter {
    NEAREST = 9728,
    LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987,
}
export declare type TextureMinFilter = TextureFilter;
export declare type TextureMagFilter = TextureFilter.NEAREST | TextureFilter.LINEAR;
export declare enum TextureInternalFormat {
    R8 = 33321,
    R8_SNORM = 36756,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    R32UI = 33334,
    R32I = 33333,
    R16F = 33325,
    R32F = 33326,
    RG8 = 33323,
    RG8_SNORM = 36757,
    RG8UI = 33336,
    RG8I = 33335,
    RG16UI = 33338,
    RG16I = 33337,
    RG32UI = 33340,
    RG32I = 33339,
    RG16F = 33327,
    RG32F = 33328,
    RGB8 = 32849,
    RGB8_SNORM = 36758,
    RGB8UI = 36221,
    RGB8I = 36239,
    RGB16UI = 36215,
    RGB16I = 36233,
    RGB32UI = 36209,
    RGB32I = 36227,
    RGB16F = 34843,
    RGB32F = 34837,
    RGBA8 = 32856,
    RGBA8_SNORM = 36759,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA32UI = 36208,
    RGBA32I = 36226,
    RGBA16F = 34842,
    RGBA32F = 34836,
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012,
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013,
}
export declare enum TextureFormat {
    RED = 6403,
    RG = 33319,
    RGB = 6407,
    RGBA = 6408,
    RED_INTEGER = 36244,
    RG_INTEGER = 33320,
    RGB_INTEGER = 36248,
    RGBA_INTEGER = 36249,
    DEPTH_COMPONENT = 6402,
    DEPTH_STENCIL = 34041,
}
export declare type TextureDataType = DataType.BYTE | DataType.UNSIGNED_BYTE | DataType.SHORT | DataType.UNSIGNED_SHORT | DataType.INT | DataType.UNSIGNED_INT | DataType.FLOAT | DataType.HALF_FLOAT | DataType.UNSIGNED_INT_24_8 | DataType.FLOAT_32_UNSIGNED_INT_24_8_REV;
export declare type TextureColorInternalFormat = TextureInternalFormat.R8 | TextureInternalFormat.R8_SNORM | TextureInternalFormat.R8UI | TextureInternalFormat.R8I | TextureInternalFormat.R16UI | TextureInternalFormat.R16I | TextureInternalFormat.R32UI | TextureInternalFormat.R32I | TextureInternalFormat.R16F | TextureInternalFormat.R32F | TextureInternalFormat.RG8 | TextureInternalFormat.RG8_SNORM | TextureInternalFormat.RG8UI | TextureInternalFormat.RG8I | TextureInternalFormat.RG16UI | TextureInternalFormat.RG16I | TextureInternalFormat.RG32UI | TextureInternalFormat.RG32I | TextureInternalFormat.RG16F | TextureInternalFormat.RG32F | TextureInternalFormat.RGB8 | TextureInternalFormat.RGB8_SNORM | TextureInternalFormat.RGB8UI | TextureInternalFormat.RGB8I | TextureInternalFormat.RGB16UI | TextureInternalFormat.RGB16I | TextureInternalFormat.RGB32UI | TextureInternalFormat.RGB32I | TextureInternalFormat.RGB16F | TextureInternalFormat.RGB32F | TextureInternalFormat.RGBA8 | TextureInternalFormat.RGBA8_SNORM | TextureInternalFormat.RGBA8UI | TextureInternalFormat.RGBA8I | TextureInternalFormat.RGBA16UI | TextureInternalFormat.RGBA16I | TextureInternalFormat.RGBA32UI | TextureInternalFormat.RGBA32I | TextureInternalFormat.RGBA16F | TextureInternalFormat.RGBA32F;
export declare type TextureDepthInternalFormat = TextureInternalFormat.DEPTH_COMPONENT16 | TextureInternalFormat.DEPTH_COMPONENT24 | TextureInternalFormat.DEPTH_COMPONENT32F;
export declare type TextureDepthStencilInternalFormat = TextureInternalFormat.DEPTH24_STENCIL8 | TextureInternalFormat.DEPTH32F_STENCIL8;
export interface InternalFormatToDataFormat {
    [TextureInternalFormat.R8]: TextureFormat.RED;
    [TextureInternalFormat.R8_SNORM]: TextureFormat.RED;
    [TextureInternalFormat.R8UI]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R8I]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R16UI]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R16I]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R32UI]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R32I]: TextureFormat.RED_INTEGER;
    [TextureInternalFormat.R16F]: TextureFormat.RED;
    [TextureInternalFormat.R32F]: TextureFormat.RED;
    [TextureInternalFormat.RG8]: TextureFormat.RG;
    [TextureInternalFormat.RG8_SNORM]: TextureFormat.RG;
    [TextureInternalFormat.RG8UI]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG8I]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG16UI]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG16I]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG32UI]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG32I]: TextureFormat.RG_INTEGER;
    [TextureInternalFormat.RG16F]: TextureFormat.RG;
    [TextureInternalFormat.RG32F]: TextureFormat.RG;
    [TextureInternalFormat.RGB8]: TextureFormat.RGB;
    [TextureInternalFormat.RGB8_SNORM]: TextureFormat.RGB;
    [TextureInternalFormat.RGB8UI]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB8I]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16UI]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16I]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB32UI]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB32I]: TextureFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16F]: TextureFormat.RGB;
    [TextureInternalFormat.RGB32F]: TextureFormat.RGB;
    [TextureInternalFormat.RGBA8]: TextureFormat.RGBA;
    [TextureInternalFormat.RGBA8_SNORM]: TextureFormat.RGBA;
    [TextureInternalFormat.RGBA8UI]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA8I]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16UI]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16I]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA32UI]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA32I]: TextureFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16F]: TextureFormat.RGBA;
    [TextureInternalFormat.RGBA32F]: TextureFormat.RGBA;
    [TextureInternalFormat.DEPTH_COMPONENT16]: TextureFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT24]: TextureFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: TextureFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH24_STENCIL8]: TextureFormat.DEPTH_STENCIL;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: TextureFormat.DEPTH_STENCIL;
    [p: number]: TextureFormat;
}
export interface InternalFormatToDataType {
    [TextureInternalFormat.R8]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.R8_SNORM]: DataType.BYTE;
    [TextureInternalFormat.R8UI]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.R8I]: DataType.BYTE;
    [TextureInternalFormat.R16UI]: DataType.UNSIGNED_SHORT;
    [TextureInternalFormat.R16I]: DataType.SHORT;
    [TextureInternalFormat.R32UI]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.R32I]: DataType.INT;
    [TextureInternalFormat.R16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [TextureInternalFormat.R32F]: DataType.FLOAT;
    [TextureInternalFormat.RG8]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RG8_SNORM]: DataType.BYTE;
    [TextureInternalFormat.RG8UI]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RG8I]: DataType.BYTE;
    [TextureInternalFormat.RG16UI]: DataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RG16I]: DataType.SHORT;
    [TextureInternalFormat.RG32UI]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.RG32I]: DataType.INT;
    [TextureInternalFormat.RG16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [TextureInternalFormat.RG32F]: DataType.FLOAT;
    [TextureInternalFormat.RGB8]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGB8_SNORM]: DataType.BYTE;
    [TextureInternalFormat.RGB8UI]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGB8I]: DataType.BYTE;
    [TextureInternalFormat.RGB16UI]: DataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RGB16I]: DataType.SHORT;
    [TextureInternalFormat.RGB32UI]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.RGB32I]: DataType.INT;
    [TextureInternalFormat.RGB16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [TextureInternalFormat.RGB32F]: DataType.FLOAT;
    [TextureInternalFormat.RGBA8]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGBA8_SNORM]: DataType.BYTE;
    [TextureInternalFormat.RGBA8UI]: DataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGBA8I]: DataType.BYTE;
    [TextureInternalFormat.RGBA16UI]: DataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RGBA16I]: DataType.SHORT;
    [TextureInternalFormat.RGBA32UI]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.RGBA32I]: DataType.INT;
    [TextureInternalFormat.RGBA16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [TextureInternalFormat.RGBA32F]: DataType.FLOAT;
    [TextureInternalFormat.DEPTH_COMPONENT16]: DataType.UNSIGNED_SHORT | DataType.UNSIGNED_INT;
    [TextureInternalFormat.DEPTH_COMPONENT24]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: DataType.FLOAT;
    [TextureInternalFormat.DEPTH24_STENCIL8]: DataType.UNSIGNED_INT_24_8;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: DataType.FLOAT_32_UNSIGNED_INT_24_8_REV;
    [p: number]: TextureDataType;
}
export interface InternalFormatToTypedArray {
    [TextureInternalFormat.R8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.R8_SNORM]: Int8Array;
    [TextureInternalFormat.R8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.R8I]: Int8Array;
    [TextureInternalFormat.R16UI]: Uint16Array;
    [TextureInternalFormat.R16I]: Int16Array;
    [TextureInternalFormat.R32UI]: Uint32Array;
    [TextureInternalFormat.R32I]: Int32Array;
    [TextureInternalFormat.R16F]: Float32Array;
    [TextureInternalFormat.R32F]: Float32Array;
    [TextureInternalFormat.RG8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RG8_SNORM]: Int8Array;
    [TextureInternalFormat.RG8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RG8I]: Int8Array;
    [TextureInternalFormat.RG16UI]: Uint16Array;
    [TextureInternalFormat.RG16I]: Int16Array;
    [TextureInternalFormat.RG32UI]: Uint32Array;
    [TextureInternalFormat.RG32I]: Int32Array;
    [TextureInternalFormat.RG16F]: Float32Array;
    [TextureInternalFormat.RG32F]: Float32Array;
    [TextureInternalFormat.RGB8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGB8_SNORM]: Int8Array;
    [TextureInternalFormat.RGB8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGB8I]: Int8Array;
    [TextureInternalFormat.RGB16UI]: Uint16Array;
    [TextureInternalFormat.RGB16I]: Int16Array;
    [TextureInternalFormat.RGB32UI]: Uint32Array;
    [TextureInternalFormat.RGB32I]: Int32Array;
    [TextureInternalFormat.RGB16F]: Float32Array;
    [TextureInternalFormat.RGB32F]: Float32Array;
    [TextureInternalFormat.RGBA8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGBA8_SNORM]: Int8Array;
    [TextureInternalFormat.RGBA8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGBA8I]: Int8Array;
    [TextureInternalFormat.RGBA16UI]: Uint16Array;
    [TextureInternalFormat.RGBA16I]: Int16Array;
    [TextureInternalFormat.RGBA32UI]: Uint32Array;
    [TextureInternalFormat.RGBA32I]: Int32Array;
    [TextureInternalFormat.RGBA16F]: Float32Array;
    [TextureInternalFormat.RGBA32F]: Float32Array;
    [TextureInternalFormat.DEPTH_COMPONENT16]: Uint16Array | Uint32Array;
    [TextureInternalFormat.DEPTH_COMPONENT24]: Uint32Array;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: Float32Array;
    [TextureInternalFormat.DEPTH24_STENCIL8]: Uint32Array;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: never;
    [p: number]: ArrayBufferView;
}
export interface TextureOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
}
export interface TextureStoreOptions {
    mipmap?: boolean;
    xOffset?: number;
    yOffset?: number;
}
/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type.
 */
export declare class Texture<F extends TextureInternalFormat> {
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    static create<F extends TextureInternalFormat>(dev: _Device, width: number, height: number, internalFormat: F, {min, mag, wrapS, wrapT}?: TextureOptions): Texture<F>;
    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    static withImage(dev: _Device, image: ImageData, options?: TextureOptions & TextureStoreOptions): Texture<TextureInternalFormat.RGBA8>;
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    static withTypedArray<F extends TextureInternalFormat>(dev: _Device, width: number, height: number, internalFormat: F, data: InternalFormatToTypedArray[F], dataFormat: InternalFormatToDataFormat[F], dataType: InternalFormatToDataType[F], options?: TextureOptions & TextureStoreOptions): Texture<F>;
    readonly width: number;
    readonly height: number;
    readonly format: F;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;
    readonly glTexture: WebGLTexture | null;
    private gl;
    private constructor();
    /**
     * Reinitialize invalid texture, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to texture. Does not take ownership of data.
     */
    store(data: InternalFormatToTypedArray[F], format: InternalFormatToDataFormat[F], type: InternalFormatToDataType[F], {xOffset, yOffset, mipmap}?: TextureStoreOptions): this;
    /**
     * Generate mipmap levels for the current data.
     */
    mipmap(): void;
    private init();
}
