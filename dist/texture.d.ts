/// <reference types="webgl2" />
export interface TextureOptions {
    minFilter?: MinFilter;
    magFilter?: MagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    mipmap?: boolean;
}
export declare const enum TextureWrap {
    ClampToEdge = "clamp-to-edge",
    Repeat = "repeat",
    MirroredRepeat = "mirrored-repeat",
}
export declare const enum TextureFilter {
    Nearest = "nearest",
    Linear = "linear",
    NearestMipmapNearest = "nearest-mipmap-nearest",
    LinearMipmapNearest = "linear-mipmap-nearest",
    NearestMipmapLinear = "nearest-mipmap-linear",
    LinearMipmapLinear = "linear-mipmap-linear",
}
export declare type MinFilter = TextureFilter;
export declare type MagFilter = TextureFilter.Nearest | TextureFilter.Linear;
export declare const enum TextureInternalFormat {
    R8 = "R8",
    R8_SNORM = "R8_SNORM",
    R8UI = "R8UI",
    R8I = "R8I",
    R16UI = "R16UI",
    R16I = "R16I",
    R32UI = "R32UI",
    R32I = "R32I",
    R16F = "R16F",
    R32F = "R32F",
    RG8 = "RG8",
    RG8_SNORM = "RG8_SNORM",
    RG8UI = "RG8UI",
    RG8I = "RG8I",
    RG16UI = "RG16UI",
    RG16I = "RG16I",
    RG32UI = "RG32UI",
    RG32I = "RG32I",
    RG16F = "RG16F",
    RG32F = "RG32F",
    RGB8 = "RGB8",
    RGB8_SNORM = "RGB8_SNORM",
    RGB8UI = "RGB8UI",
    RGB8I = "RGB8I",
    RGB16UI = "RGB16UI",
    RGB16I = "RGB16I",
    RGB32UI = "RGB32UI",
    RGB32I = "RGB32I",
    RGB16F = "RGB16F",
    RGB32F = "RGB32F",
    RGBA8 = "RGBA8",
    RGBA8_SNORM = "RGBA8_SNORM",
    RGBA8UI = "RGBA8UI",
    RGBA8I = "RGBA8I",
    RGBA16UI = "RGBA16UI",
    RGBA16I = "RGBA16I",
    RGBA32UI = "RGBA32UI",
    RGBA32I = "RGBA32I",
    RGBA16F = "RGBA16F",
    RGBA32F = "RGBA32F",
}
export declare const enum TextureFormat {
    RED = "RED",
    RG = "RG",
    RGB = "RGB",
    RGBA = "RGBA",
    RED_INTEGER = "RED_INTEGER",
    RG_INTEGER = "RG_INTEGER",
    RGB_INTEGER = "RGB_INTEGER",
    RGBA_INTEGER = "RGBA_INTEGER",
}
export declare const enum TextureType {
    UNSIGNED_BYTE = "UNSIGNED_BYTE",
    UNSIGNED_SHORT = "UNSIGNED_SHORT",
    UNSIGNED_INT = "UNSIGNED_INT",
    BYTE = "BYTE",
    SHORT = "SHORT",
    INT = "INT",
    FLOAT = "FLOAT",
}
export declare class Texture {
    static fromImage(gl: WebGL2RenderingContext, image: ImageData, options?: TextureOptions): Texture;
    static RGBA8FromRGBAUint8Array(gl: WebGL2RenderingContext, data: number[] | Uint8Array | Uint8ClampedArray | null, width: number, height: number, options?: TextureOptions): Texture;
    static RG16FFromRGFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
    static RGB16FFromRGBFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
    static RGBA16FFromRGBAFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
    static RGB32FFromRGBFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
    static RGBA32FFromRGBAFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
    static fromArrayBufferView(gl: WebGL2RenderingContext, data: ArrayBufferView | null, width: number, height: number, internalFormat: TextureInternalFormat, format: TextureFormat, type: TextureType, options?: TextureOptions): Texture;
    readonly glTexture: WebGLTexture;
    readonly width: number;
    readonly height: number;
    readonly internalFormat: TextureInternalFormat;
    private constructor();
}
