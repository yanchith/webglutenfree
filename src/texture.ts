import * as assert from "./assert";
import * as glutil from "./glutil";

export interface TextureOptions {
    minFilter?: MinFilter;
    magFilter?: MagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    mipmap?: boolean;
}

export const enum TextureWrap {
    ClampToEdge,
    Repeat,
    MirroredRepeat,
}

export const enum TextureFilter {
    Nearest,
    Linear,
    NearestMipmapNearest,
    LinearMipmapNearest,
    NearestMipmapLinear,
    LinearMipmapLinear,
}

export type MinFilter = TextureFilter;
export type MagFilter = TextureFilter.Nearest | TextureFilter.Linear;

export const enum TextureInternalFormat {
    // R
    R8,
    R8_SNORM,
    R8UI,
    R8I,
    R16UI,
    R16I,
    R32UI,
    R32I,
    R16F,
    R32F,

    // RG
    RG8,
    RG8_SNORM,
    RG8UI,
    RG8I,
    RG16UI,
    RG16I,
    RG32UI,
    RG32I,
    RG16F,
    RG32F,

    // RGB
    RGB8,
    RGB8_SNORM,
    RGB8UI,
    RGB8I,
    RGB16UI,
    RGB16I,
    RGB32UI,
    RGB32I,
    RGB16F,
    RGB32F,

    // RGBA
    RGBA8,
    RGBA8_SNORM,
    RGBA8UI,
    RGBA8I,
    RGBA16UI,
    RGBA16I,
    RGBA32UI,
    RGBA32I,
    RGBA16F,
    RGBA32F,

    // TODO: support exotic formats

    // DEPTH
    // DEPTH_COMPONENT16,
    // DEPTH_COMPONENT24,
    // DEPTH_COMPONENT32F,

    // DEPTH STENCIL
    // DEPTH24_STENCIL8,
    // DEPTH32F_STENCIL8,

    // LUMINANCE ALPHA
    // LUMINANCE_ALPHA,
    // LUMINANCE,
    // ALPHA,
}

export const enum TextureFormat {
    RED,
    RG,
    RGB,
    RGBA,
    RED_INTEGER,
    RG_INTEGER,
    RGB_INTEGER,
    RGBA_INTEGER,

    // TODO: support exotic formats

    // DEPTH_COMPONENT,
    // DEPTH_STENCIL,
    // LUMINANCE_ALPHA,
    // LUMINANCE,
    // ALPHA,
}

export const enum TextureType {
    UNSIGNED_BYTE,
    UNSIGNED_SHORT,
    UNSIGNED_INT,

    BYTE,
    SHORT,
    INT,

    FLOAT,

    // TODO: support exotic formats
    // HALF_FLOAT,

    // UNSIGNED_SHORT_4_4_4_4,
    // UNSIGNED_SHORT_5_5_5_1,
    // UNSIGNED_SHORT_5_6_5,

    // UNSIGNED_INT_24_8,
    // UNSIGNED_INT_5_9_9_9_REV,
    // UNSIGNED_INT_2_10_10_10_REV,
    // UNSIGNED_INT_10F_11F_11F_REV,

    // FLOAT_32_UNSIGNED_INT_24_8_REV,
}

export default class Texture {

    static fromImage(
        gl: WebGL2RenderingContext,
        image: ImageData,
        options?: TextureOptions,
    ): Texture {
        return Texture.RGBA8FromRGBAUint8Array(
            gl,
            image.data,
            image.width,
            image.height,
            options,
        );
    }

    static RGBA8FromRGBAUint8Array(
        gl: WebGL2RenderingContext,
        data: number[] | Uint8Array | Uint8ClampedArray | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Uint8Array
                ? data
                // Note: we also have to convert Uint8ClampedArray to Uint8Array
                // because of webgl bug
                // https://github.com/KhronosGroup/WebGL/issues/1533
                : new Uint8Array(data),
            width,
            height,
            TextureInternalFormat.RGBA8,
            TextureFormat.RGBA,
            TextureType.UNSIGNED_BYTE,
            options,
        );
    }

    static RG16FFromRGFloat32Array(
        gl: WebGL2RenderingContext,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Float32Array
                ? data
                : new Float32Array(data),
            width,
            height,
            TextureInternalFormat.RG16F,
            TextureFormat.RG,
            TextureType.FLOAT,
            options,
        );
    }

    static RGB16FFromRGBFloat32Array(
        gl: WebGL2RenderingContext,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Float32Array
                ? data
                : new Float32Array(data),
            width,
            height,
            TextureInternalFormat.RGB16F,
            TextureFormat.RGB,
            TextureType.FLOAT,
            options,
        );
    }

    static RGBA16FFromRGBAFloat32Array(
        gl: WebGL2RenderingContext,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Float32Array
                ? data
                : new Float32Array(data),
            width,
            height,
            TextureInternalFormat.RGBA16F,
            TextureFormat.RGBA,
            TextureType.FLOAT,
            options,
        );
    }

    static RGB32FFromRGBFloat32Array(
        gl: WebGL2RenderingContext,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Float32Array
                ? data
                : new Float32Array(data),
            width,
            height,
            TextureInternalFormat.RGB32F,
            TextureFormat.RGB,
            TextureType.FLOAT,
            options,
        );
    }

    static RGBA32FFromRGBAFloat32Array(
        gl: WebGL2RenderingContext,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            !data || data instanceof Float32Array
                ? data
                : new Float32Array(data),
            width,
            height,
            TextureInternalFormat.RGBA32F,
            TextureFormat.RGBA,
            TextureType.FLOAT,
            options,
        );
    }

    static fromArrayBufferView(
        gl: WebGL2RenderingContext,
        data: ArrayBufferView | null,
        width: number,
        height: number,
        internalFormat: TextureInternalFormat,
        format: TextureFormat,
        type: TextureType,
        options?: TextureOptions,
    ): Texture {
        return new Texture(
            gl,
            data,
            width,
            height,
            internalFormat,
            format,
            type,
            options,
        );
    }

    readonly glTexture: WebGLTexture;
    readonly width: number;
    readonly height: number;
    readonly internalFormat: TextureInternalFormat;

    private constructor(
        gl: WebGL2RenderingContext,
        data: ArrayBufferView | null,
        width: number,
        height: number,
        internalFormat: TextureInternalFormat,
        format: TextureFormat,
        type: TextureType,
        {
            minFilter = TextureFilter.Nearest,
            magFilter = TextureFilter.Nearest,
            wrapS = TextureWrap.ClampToEdge,
            wrapT = TextureWrap.ClampToEdge,
            mipmap = false,
        }: TextureOptions = {},
    ) {
        this.glTexture = glutil.createTexture(
            gl,
            data,
            width, height,
            mapGlInternalFormat(gl, internalFormat),
            mapGlFormat(gl, format),
            mapGlType(gl, type),
            mapGlWrap(gl, wrapS), mapGlWrap(gl, wrapT),
            mapGlFilter(gl, minFilter), mapGlFilter(gl, magFilter),
            mipmap,
        );
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat;
    }
}

function mapGlWrap(gl: WebGL2RenderingContext, wrap: TextureWrap): number {
    switch (wrap) {
        case TextureWrap.ClampToEdge: return gl.CLAMP_TO_EDGE;
        case TextureWrap.Repeat: return gl.REPEAT;
        case TextureWrap.MirroredRepeat: return gl.MIRRORED_REPEAT;
        default: return assert.never(wrap);
    }
}

function mapGlFilter(gl: WebGL2RenderingContext, filter: TextureFilter): number {
    switch (filter) {
        case TextureFilter.Nearest: return gl.NEAREST;
        case TextureFilter.Linear: return gl.LINEAR;
        case TextureFilter.NearestMipmapNearest: return gl.NEAREST_MIPMAP_NEAREST;
        case TextureFilter.LinearMipmapNearest: return gl.LINEAR_MIPMAP_NEAREST;
        case TextureFilter.NearestMipmapLinear: return gl.NEAREST_MIPMAP_LINEAR;
        case TextureFilter.LinearMipmapLinear: return gl.LINEAR_MIPMAP_LINEAR;
        default: return assert.never(filter);
    }
}

function mapGlInternalFormat(
    gl: WebGL2RenderingContext,
    internalFormat: TextureInternalFormat,
): number {
    switch (internalFormat) {
        // R
        case TextureInternalFormat.R8: return gl.R8;
        case TextureInternalFormat.R8_SNORM: return gl.R8_SNORM;
        case TextureInternalFormat.R8UI: return gl.R8UI;
        case TextureInternalFormat.R8I: return gl.R8I;
        case TextureInternalFormat.R16UI: return gl.R16UI;
        case TextureInternalFormat.R16I: return gl.R16I;
        case TextureInternalFormat.R32UI: return gl.R32UI;
        case TextureInternalFormat.R32I: return gl.R32I;
        case TextureInternalFormat.R16F: return gl.R16I;
        case TextureInternalFormat.R32F: return gl.R32F;

        // RG
        case TextureInternalFormat.RG8: return gl.RG8;
        case TextureInternalFormat.RG8_SNORM: return gl.RG8_SNORM;
        case TextureInternalFormat.RG8UI: return gl.RG8UI;
        case TextureInternalFormat.RG8I: return gl.RG8I;
        case TextureInternalFormat.RG16UI: return gl.RG16UI;
        case TextureInternalFormat.RG16I: return gl.RG16I;
        case TextureInternalFormat.RG32UI: return gl.RG32UI;
        case TextureInternalFormat.RG32I: return gl.RG32I;
        case TextureInternalFormat.RG16F: return gl.RG16F;
        case TextureInternalFormat.RG32F: return gl.RG32F;

        // RGB
        case TextureInternalFormat.RGB8: return gl.RGB8;
        case TextureInternalFormat.RGB8_SNORM: return gl.RGB8_SNORM;
        case TextureInternalFormat.RGB8UI: return gl.RGB8UI;
        case TextureInternalFormat.RGB8I: return gl.RGB8I;
        case TextureInternalFormat.RGB16UI: return gl.RGB16UI;
        case TextureInternalFormat.RGB16I: return gl.RGB16I;
        case TextureInternalFormat.RGB32UI: return gl.RGB32UI;
        case TextureInternalFormat.RGB32I: return gl.RGB32I;
        case TextureInternalFormat.RGB16F: return gl.RGB16F;
        case TextureInternalFormat.RGB32F: return gl.RGB32F;

        // RGBA
        case TextureInternalFormat.RGBA8: return gl.RGBA8;
        case TextureInternalFormat.RGBA8_SNORM: return gl.RGBA8_SNORM;
        case TextureInternalFormat.RGBA8UI: return gl.RGBA8UI;
        case TextureInternalFormat.RGBA8I: return gl.RGBA8I;
        case TextureInternalFormat.RGBA16UI: return gl.RGBA16UI;
        case TextureInternalFormat.RGBA16I: return gl.RGBA16I;
        case TextureInternalFormat.RGBA32UI: return gl.RGBA32UI;
        case TextureInternalFormat.RGBA32I: return gl.RGBA32I;
        case TextureInternalFormat.RGBA16F: return gl.RGBA16F;
        case TextureInternalFormat.RGBA32F: return gl.RGBA32F;
        default: return assert.never(internalFormat);
    }
}

function mapGlFormat(gl: WebGL2RenderingContext, format: TextureFormat): number {
    switch (format) {
        case TextureFormat.RED: return gl.RED;
        case TextureFormat.RG: return gl.RG;
        case TextureFormat.RGB: return gl.RGB;
        case TextureFormat.RGBA: return gl.RGBA;
        case TextureFormat.RED_INTEGER: return gl.RED_INTEGER;
        case TextureFormat.RG_INTEGER: return gl.RG_INTEGER;
        case TextureFormat.RGB_INTEGER: return gl.RGB_INTEGER;
        case TextureFormat.RGBA_INTEGER: return gl.RGBA_INTEGER;
        default: return assert.never(format);
    }
}

function mapGlType(gl: WebGL2RenderingContext, type: TextureType): number {
    switch (type) {
        case TextureType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
        case TextureType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
        case TextureType.UNSIGNED_INT: return gl.UNSIGNED_INT;
        case TextureType.BYTE: return gl.BYTE;
        case TextureType.SHORT: return gl.SHORT;
        case TextureType.INT: return gl.INT;
        case TextureType.FLOAT: return gl.FLOAT;
    }
}
