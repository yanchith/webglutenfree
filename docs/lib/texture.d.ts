/// <reference types="webgl2" />
export declare enum TextureColorStorageFormat {
    R8 = 33321,
    R8_SNORM = 36756,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    R16F = 33325,
    R32UI = 33334,
    R32I = 33333,
    R32F = 33326,
    RG8 = 33323,
    RG8_SNORM = 36757,
    RG8UI = 33336,
    RG8I = 33335,
    RG16UI = 33338,
    RG16I = 33337,
    RG16F = 33327,
    RG32UI = 33340,
    RG32I = 33339,
    RG32F = 33328,
    RGB8 = 32849,
    RGB8_SNORM = 36758,
    RGB8UI = 36221,
    RGB8I = 36239,
    RGB16UI = 36215,
    RGB16I = 36233,
    RGB16F = 34843,
    RGB32UI = 36209,
    RGB32I = 36227,
    RGB32F = 34837,
    RGBA8 = 32856,
    RGBA8_SNORM = 36759,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA16F = 34842,
    RGBA32UI = 36208,
    RGBA32I = 36226,
    RGBA32F = 34836
}
export declare enum TextureDepthStorageFormat {
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012
}
export declare enum TextureDepthStencilStorageFormat {
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013
}
export declare type TextureStorageFormat = TextureColorStorageFormat | TextureDepthStorageFormat | TextureDepthStencilStorageFormat;
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
    DEPTH_STENCIL = 34041
}
export declare enum TextureDataType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    HALF_FLOAT = 5131,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
    UNSIGNED_INT_24_8 = 34042,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 36269
}
export declare enum TextureWrap {
    CLAMP_TO_EDGE = 33071,
    REPEAT = 10497,
    MIRRORED_REPEAT = 33648
}
export declare enum TextureMinFilter {
    NEAREST = 9728,
    LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987
}
export declare enum TextureMagFilter {
    NEAREST = 9728,
    LINEAR = 9729
}
export interface StorageFormatToFormat {
    [TextureColorStorageFormat.R8]: TextureFormat.RED;
    [TextureColorStorageFormat.R8_SNORM]: TextureFormat.RED;
    [TextureColorStorageFormat.R8UI]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R8I]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R16UI]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R16I]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R16F]: TextureFormat.RED;
    [TextureColorStorageFormat.R32UI]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R32I]: TextureFormat.RED_INTEGER;
    [TextureColorStorageFormat.R32F]: TextureFormat.RED;
    [TextureColorStorageFormat.RG8]: TextureFormat.RG;
    [TextureColorStorageFormat.RG8_SNORM]: TextureFormat.RG;
    [TextureColorStorageFormat.RG8UI]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG8I]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG16UI]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG16I]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG16F]: TextureFormat.RG;
    [TextureColorStorageFormat.RG32UI]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG32I]: TextureFormat.RG_INTEGER;
    [TextureColorStorageFormat.RG32F]: TextureFormat.RG;
    [TextureColorStorageFormat.RGB8]: TextureFormat.RGB;
    [TextureColorStorageFormat.RGB8_SNORM]: TextureFormat.RGB;
    [TextureColorStorageFormat.RGB8UI]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB8I]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB16UI]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB16I]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB16F]: TextureFormat.RGB;
    [TextureColorStorageFormat.RGB32UI]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB32I]: TextureFormat.RGB_INTEGER;
    [TextureColorStorageFormat.RGB32F]: TextureFormat.RGB;
    [TextureColorStorageFormat.RGBA8]: TextureFormat.RGBA;
    [TextureColorStorageFormat.RGBA8_SNORM]: TextureFormat.RGBA;
    [TextureColorStorageFormat.RGBA8UI]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA8I]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA16UI]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA16I]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA16F]: TextureFormat.RGBA;
    [TextureColorStorageFormat.RGBA32UI]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA32I]: TextureFormat.RGBA_INTEGER;
    [TextureColorStorageFormat.RGBA32F]: TextureFormat.RGBA;
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]: TextureFormat.DEPTH_COMPONENT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]: TextureFormat.DEPTH_COMPONENT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]: TextureFormat.DEPTH_COMPONENT;
    [TextureDepthStencilStorageFormat.DEPTH24_STENCIL8]: TextureFormat.DEPTH_STENCIL;
    [TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8]: TextureFormat.DEPTH_STENCIL;
}
export interface StorageFormatToDataType {
    [TextureColorStorageFormat.R8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.R8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.R8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.R8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.R16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.R16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.R16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureColorStorageFormat.R32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.R32I]: TextureDataType.INT;
    [TextureColorStorageFormat.R32F]: TextureDataType.FLOAT;
    [TextureColorStorageFormat.RG8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RG8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RG8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RG8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RG16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RG16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RG16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureColorStorageFormat.RG32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RG32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RG32F]: TextureDataType.FLOAT;
    [TextureColorStorageFormat.RGB8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGB8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGB8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGB8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGB16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RGB16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RGB16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureColorStorageFormat.RGB32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RGB32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RGB32F]: TextureDataType.FLOAT;
    [TextureColorStorageFormat.RGBA8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGBA8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGBA8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGBA8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGBA16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RGBA16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RGBA16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureColorStorageFormat.RGBA32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RGBA32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RGBA32F]: TextureDataType.FLOAT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]: TextureDataType.UNSIGNED_SHORT | TextureDataType.UNSIGNED_INT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]: TextureDataType.UNSIGNED_INT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]: TextureDataType.FLOAT;
    [TextureDepthStencilStorageFormat.DEPTH24_STENCIL8]: TextureDataType.UNSIGNED_INT_24_8;
    [TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8]: TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV;
}
export interface StorageFormatToTypedArray {
    [TextureColorStorageFormat.R8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.R8_SNORM]: Int8Array;
    [TextureColorStorageFormat.R8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.R8I]: Int8Array;
    [TextureColorStorageFormat.R16UI]: Uint16Array;
    [TextureColorStorageFormat.R16I]: Int16Array;
    [TextureColorStorageFormat.R16F]: Float32Array;
    [TextureColorStorageFormat.R32UI]: Uint32Array;
    [TextureColorStorageFormat.R32I]: Int32Array;
    [TextureColorStorageFormat.R32F]: Float32Array;
    [TextureColorStorageFormat.RG8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RG8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RG8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RG8I]: Int8Array;
    [TextureColorStorageFormat.RG16UI]: Uint16Array;
    [TextureColorStorageFormat.RG16I]: Int16Array;
    [TextureColorStorageFormat.RG16F]: Float32Array;
    [TextureColorStorageFormat.RG32UI]: Uint32Array;
    [TextureColorStorageFormat.RG32I]: Int32Array;
    [TextureColorStorageFormat.RG32F]: Float32Array;
    [TextureColorStorageFormat.RGB8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGB8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RGB8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGB8I]: Int8Array;
    [TextureColorStorageFormat.RGB16UI]: Uint16Array;
    [TextureColorStorageFormat.RGB16I]: Int16Array;
    [TextureColorStorageFormat.RGB16F]: Float32Array;
    [TextureColorStorageFormat.RGB32UI]: Uint32Array;
    [TextureColorStorageFormat.RGB32I]: Int32Array;
    [TextureColorStorageFormat.RGB32F]: Float32Array;
    [TextureColorStorageFormat.RGBA8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGBA8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RGBA8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGBA8I]: Int8Array;
    [TextureColorStorageFormat.RGBA16UI]: Uint16Array;
    [TextureColorStorageFormat.RGBA16I]: Int16Array;
    [TextureColorStorageFormat.RGBA16F]: Float32Array;
    [TextureColorStorageFormat.RGBA32UI]: Uint32Array;
    [TextureColorStorageFormat.RGBA32I]: Int32Array;
    [TextureColorStorageFormat.RGBA32F]: Float32Array;
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]: Uint16Array | Uint32Array;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]: Uint32Array;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]: Float32Array;
    [TextureDepthStencilStorageFormat.DEPTH24_STENCIL8]: Uint32Array;
    [TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8]: never;
}
export interface Texture2DCreateOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
}
export interface Texture2DStoreOptions {
    mipmap?: boolean;
    xOffset?: number;
    yOffset?: number;
    width?: number;
    height?: number;
}
export interface TextureCubeMapCreateOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    wrapR?: TextureWrap;
}
export interface TextureCubeMapStoreOptions {
    mipmap?: boolean;
    xOffset?: number;
    yOffset?: number;
    width?: number;
    height?: number;
}
export declare function _createTexture2D<S extends TextureStorageFormat>(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, { min, mag, wrapS, wrapT, }?: Texture2DCreateOptions): Texture2D<S>;
export declare function _createTexture2DWithTypedArray<S extends TextureStorageFormat>(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, data: StorageFormatToTypedArray[S], dataFormat: StorageFormatToFormat[S], dataType: StorageFormatToDataType[S], options?: Texture2DCreateOptions & Texture2DStoreOptions): Texture2D<S>;
export declare function _createTextureCubeMap<S extends TextureStorageFormat>(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, { min, mag, wrapS, wrapT, wrapR, }?: TextureCubeMapCreateOptions): TextureCubeMap<S>;
export declare function _createTextureCubeMapWithTypedArray<S extends TextureStorageFormat>(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, dataPositiveX: StorageFormatToTypedArray[S], dataNegativeX: StorageFormatToTypedArray[S], dataPositiveY: StorageFormatToTypedArray[S], dataNegativeY: StorageFormatToTypedArray[S], dataPositiveZ: StorageFormatToTypedArray[S], dataNegativeZ: StorageFormatToTypedArray[S], dataFormat: StorageFormatToFormat[S], dataType: StorageFormatToDataType[S], options?: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions): TextureCubeMap<S>;
/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type.
 */
export declare class Texture2D<S extends TextureStorageFormat> {
    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;
    readonly glTexture: WebGLTexture | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, wrapS: TextureWrap, wrapT: TextureWrap, minFilter: TextureMinFilter, magFilter: TextureMagFilter);
    /**
     * Reinitialize invalid texture, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to texture. Does not take ownership of data.
     */
    store(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Generate mipmap levels for the current data.
     */
    mipmap(): void;
    private init;
}
/**
 * Cubemaps consist of 6 different textures conceptually layed out as faces of a
 * cube around origin [0, 0, 0]. Each of the 6 textures in a cubemap has the
 * same dimensions and storage format.
 * In shaders, cubemaps can be sampled using a vec3 interpreted as a direction
 * from origin. This makes cubemaps ideal to implement skyboxes and environment
 * mapping.
 */
export declare class TextureCubeMap<S extends TextureStorageFormat> {
    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly wrapR: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;
    readonly glTexture: WebGLTexture | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, wrapS: TextureWrap, wrapT: TextureWrap, wrapR: TextureWrap, minFilter: TextureMinFilter, magFilter: TextureMagFilter);
    /**
     * Reinitialize invalid cubemap, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to cubemap. Does not take ownership of data.
     * The 6 typed arrays must be of the same length.
     */
    store(dataPositiveX: StorageFormatToTypedArray[S], dataNegativeX: StorageFormatToTypedArray[S], dataPositiveY: StorageFormatToTypedArray[S], dataNegativeY: StorageFormatToTypedArray[S], dataPositiveZ: StorageFormatToTypedArray[S], dataNegativeZ: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's positive X face.
     * Does not take ownership of data.
     */
    storePositiveX(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's negative X face.
     * Does not take ownership of data.
     */
    storeNegativeX(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's positive Y face.
     * Does not take ownership of data.
     */
    storePositiveY(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's negative Y face.
     * Does not take ownership of data.
     */
    storeNegativeY(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's positive Z face.
     * Does not take ownership of data.
     */
    storePositiveZ(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Upload new data to cubemap's negative Z face.
     * Does not take ownership of data.
     */
    storeNegativeZ(data: StorageFormatToTypedArray[S], format: StorageFormatToFormat[S], type: StorageFormatToDataType[S], { xOffset, yOffset, width, height, mipmap, }?: Texture2DStoreOptions): this;
    /**
     * Generate mipmap levels for the current data.
     */
    mipmap(): this;
    private init;
    private storeFace;
}
//# sourceMappingURL=texture.d.ts.map