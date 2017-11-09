/// <reference types="webgl2" />
export interface TextureOptions {
    minFilter?: MinFilter;
    magFilter?: MagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    mipmap?: boolean;
}
export declare const enum TextureWrap {
    ClampToEdge = 0,
    Repeat = 1,
    MirroredRepeat = 2,
}
export declare const enum TextureFilter {
    Nearest = 0,
    Linear = 1,
    NearestMipmapNearest = 2,
    LinearMipmapNearest = 3,
    NearestMipmapLinear = 4,
    LinearMipmapLinear = 5,
}
export declare type MinFilter = TextureFilter;
export declare type MagFilter = TextureFilter.Nearest | TextureFilter.Linear;
export declare const enum TextureInternalFormat {
    R8 = 0,
    R8_SNORM = 1,
    R8UI = 2,
    R8I = 3,
    R16UI = 4,
    R16I = 5,
    R32UI = 6,
    R32I = 7,
    R16F = 8,
    R32F = 9,
    RG8 = 10,
    RG8_SNORM = 11,
    RG8UI = 12,
    RG8I = 13,
    RG16UI = 14,
    RG16I = 15,
    RG32UI = 16,
    RG32I = 17,
    RG16F = 18,
    RG32F = 19,
    RGB8 = 20,
    RGB8_SNORM = 21,
    RGB8UI = 22,
    RGB8I = 23,
    RGB16UI = 24,
    RGB16I = 25,
    RGB32UI = 26,
    RGB32I = 27,
    RGB16F = 28,
    RGB32F = 29,
    RGBA8 = 30,
    RGBA8_SNORM = 31,
    RGBA8UI = 32,
    RGBA8I = 33,
    RGBA16UI = 34,
    RGBA16I = 35,
    RGBA32UI = 36,
    RGBA32I = 37,
    RGBA16F = 38,
    RGBA32F = 39,
}
export declare const enum TextureFormat {
    RED = 0,
    RG = 1,
    RGB = 2,
    RGBA = 3,
    RED_INTEGER = 4,
    RG_INTEGER = 5,
    RGB_INTEGER = 6,
    RGBA_INTEGER = 7,
}
export declare const enum TextureType {
    UNSIGNED_BYTE = 0,
    UNSIGNED_SHORT = 1,
    UNSIGNED_INT = 2,
    BYTE = 3,
    SHORT = 4,
    INT = 5,
    FLOAT = 6,
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
