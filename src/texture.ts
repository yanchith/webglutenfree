import * as assert from "./assert";
import { Device } from "./device";

export interface TextureOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    mipmap?: boolean;
}

export const enum TextureWrap {
    CLAMP_TO_EDGE = "clamp-to-edge",
    REPEAT = "repeat",
    MIRRORED_REPEAT = "mirrored-repeat",
}

export const enum TextureFilter {
    NEAREST = "nearest",
    LINEAR = "linear",
    NEAREST_MIPMAP_NEAREST = "nearest-mipmap-nearest",
    LINEAR_MIPMAP_NEAREST = "linear-mipmap-nearest",
    NEAREST_MIPMAP_LINEAR = "nearest-mipmap-linear",
    LINEAR_MIPMAP_LINEAR = "linear-mipmap-linear",
}

export type TextureMinFilter = TextureFilter;
export type TextureMagFilter = TextureFilter.NEAREST | TextureFilter.LINEAR;

export const enum TextureInternalFormat {
    // R
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

    // RG
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

    // RGB
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

    // RGBA
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

    // TODO: support exotic formats

    // DEPTH
    // DEPTH_COMPONENT16 = "DEPTH_COMPONENT16",
    // DEPTH_COMPONENT24 = "DEPTH_COMPONENT24",
    // DEPTH_COMPONENT32F = "DEPTH_COMPONENT32F",

    // DEPTH STENCIL
    // DEPTH24_STENCIL8 = "DEPTH24_STENCIL8",
    // DEPTH32F_STENCIL8 = "DEPTH32F_STENCIL8",

    // LUMINANCE ALPHA
    // LUMINANCE_ALPHA = "LUMINANCE_ALPHA",
    // LUMINANCE = "LUMINANCE",
    // ALPHA = "ALPHA",
}

export const enum TextureFormat {
    RED = "RED",
    RG = "RG",
    RGB = "RGB",
    RGBA = "RGBA",
    RED_INTEGER = "RED_INTEGER",
    RG_INTEGER = "RG_INTEGER",
    RGB_INTEGER = "RGB_INTEGER",
    RGBA_INTEGER = "RGBA_INTEGER",

    // TODO: support exotic formats

    // DEPTH_COMPONENT = "DEPTH_COMPONENT",
    // DEPTH_STENCIL = "DEPTH_STENCIL",
    // LUMINANCE_ALPHA = "LUMINANCE_ALPHA",
    // LUMINANCE = "LUMINANCE",
    // ALPHA = "ALPHA",
}

export const enum TextureType {
    UNSIGNED_BYTE = "unsigned byte",
    UNSIGNED_SHORT = "unsigned short",
    UNSIGNED_INT = "unsigned int",

    BYTE = "byte",
    SHORT = "short",
    INT = "int",

    FLOAT = "float",

    // TODO: support exotic formats
    // HALF_FLOAT = "HALF_FLOAT",

    // UNSIGNED_SHORT_4_4_4_4 = "UNSIGNED_SHORT_4_4_4_4",
    // UNSIGNED_SHORT_5_5_5_1 = "UNSIGNED_SHORT_5_5_5_1",
    // UNSIGNED_SHORT_5_6_5 = "UNSIGNED_SHORT_5_6_5",

    // UNSIGNED_INT_24_8 = "UNSIGNED_INT_24_8",
    // UNSIGNED_INT_5_9_9_9_REV = "UNSIGNED_INT_5_9_9_9_REV",
    // UNSIGNED_INT_2_10_10_10_REV = "UNSIGNED_INT_2_10_10_10_REV",
    // UNSIGNED_INT_10F_11F_11F_REV = "UNSIGNED_INT_10F_11F_11F_REV",

    // FLOAT_32_UNSIGNED_INT_24_8_REV = "FLOAT_32_UNSIGNED_INT_24_8_REV",
}

export class Texture {

    static fromImage(
        dev: WebGL2RenderingContext | Device,
        image: ImageData,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromRGBA8(
            dev,
            image.data,
            image.width,
            image.height,
            options,
        );
    }

    static fromRGBA8(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint8Array | Uint8ClampedArray | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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

    static fromRG16F(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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

    static fromRGB16F(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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

    static fromRGBA16F(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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

    static fromRGB32F(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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

    static fromRGBA32F(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array | null,
        width: number,
        height: number,
        options?: TextureOptions,
    ): Texture {
        return Texture.fromArrayBufferView(
            dev,
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
        dev: WebGL2RenderingContext | Device,
        data: ArrayBufferView | null,
        width: number,
        height: number,
        internalFormat: TextureInternalFormat,
        format: TextureFormat,
        type: TextureType,
        {
            min = TextureFilter.NEAREST,
            mag = TextureFilter.NEAREST,
            wrapS = TextureWrap.CLAMP_TO_EDGE,
            wrapT = TextureWrap.CLAMP_TO_EDGE,
            mipmap = false,
        }: TextureOptions = {},
    ): Texture {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new Texture(
            gl,
            data,
            width, height,
            internalFormat,
            format,
            type,
            wrapS, wrapT,
            min, mag,
            mipmap,
        );
    }

    readonly data: ArrayBufferView | null;
    readonly width: number;
    readonly height: number;

    readonly internalFormat: TextureInternalFormat;
    readonly format: TextureFormat;
    readonly type: TextureType;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;
    readonly mipmap: boolean;

    readonly glTexture: WebGLTexture | null;
    readonly glInternalFormat: number;
    readonly glFormat: number;
    readonly glType: number;
    readonly glWrapS: number;
    readonly glWrapT: number;
    readonly glMinFilter: number;
    readonly glMagFilter: number;

    private gl: WebGL2RenderingContext;

    private constructor(
        gl: WebGL2RenderingContext,
        data: ArrayBufferView | null,
        width: number,
        height: number,
        internalFormat: TextureInternalFormat,
        format: TextureFormat,
        type: TextureType,
        wrapS: TextureWrap,
        wrapT: TextureWrap,
        minFilter: TextureMinFilter,
        magFilter: TextureMagFilter,
        mipmap: boolean,
    ) {
        this.gl = gl;
        this.data = data;
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat;
        this.format = format;
        this.type = type;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.mipmap = mipmap;
        this.glInternalFormat = mapGlTextureInternalFormat(gl, internalFormat);
        this.glFormat = mapGlTextureFormat(gl, format);
        this.glType = mapGlTextureType(gl, type);
        this.glWrapS = mapGlTextureWrap(gl, wrapS);
        this.glWrapT = mapGlTextureWrap(gl, wrapT);
        this.glMinFilter = mapGlTextureFilter(gl, minFilter);
        this.glMagFilter = mapGlTextureFilter(gl, magFilter);
        this.glTexture = null;

        this.init();
    }

    init(): void {
        const {
            gl,
            data,
            width,
            height,
            glInternalFormat,
            glFormat,
            glType,
            glWrapS,
            glWrapT,
            glMinFilter,
            glMagFilter,
            mipmap,
        } = this;
        if (!gl.isContextLost()) {
            const texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texStorage2D(gl.TEXTURE_2D, 1, glInternalFormat, width, height);
            if (data) {
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0,
                    0, 0,
                    width, height,
                    glFormat,
                    glType,
                    data,
                );
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMinFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMagFilter);

            if (mipmap) { gl.generateMipmap(gl.TEXTURE_2D); }

            gl.bindTexture(gl.TEXTURE_2D, null);

            (this as any).glTexture = texture;
        }
    }

    restore(): void {
        if (!this.glTexture) { this.init(); }
    }
}

function mapGlTextureWrap(
    gl: WebGL2RenderingContext,
    wrap: TextureWrap,
): number {
    switch (wrap) {
        case TextureWrap.CLAMP_TO_EDGE: return gl.CLAMP_TO_EDGE;
        case TextureWrap.REPEAT: return gl.REPEAT;
        case TextureWrap.MIRRORED_REPEAT: return gl.MIRRORED_REPEAT;
        default: return assert.never(wrap, `Unknown texture wrap: ${wrap}`);
    }
}

function mapGlTextureFilter(
    gl: WebGL2RenderingContext,
    filter: TextureFilter,
): number {
    switch (filter) {
        case TextureFilter.NEAREST: return gl.NEAREST;
        case TextureFilter.LINEAR: return gl.LINEAR;
        case TextureFilter.NEAREST_MIPMAP_NEAREST:
            return gl.NEAREST_MIPMAP_NEAREST;
        case TextureFilter.LINEAR_MIPMAP_NEAREST:
            return gl.LINEAR_MIPMAP_NEAREST;
        case TextureFilter.NEAREST_MIPMAP_LINEAR:
            return gl.NEAREST_MIPMAP_LINEAR;
        case TextureFilter.LINEAR_MIPMAP_LINEAR:
            return gl.LINEAR_MIPMAP_LINEAR;
        default: return assert.never(
            filter,
            `Unknown texture filter: ${filter}`,
        );
    }
}

function mapGlTextureInternalFormat(
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
        default: return assert.never(
            internalFormat,
            `Unknown texture internal format: ${internalFormat}`,
        );
    }
}

function mapGlTextureFormat(
    gl: WebGL2RenderingContext,
    format: TextureFormat,
): number {
    switch (format) {
        case TextureFormat.RED: return gl.RED;
        case TextureFormat.RG: return gl.RG;
        case TextureFormat.RGB: return gl.RGB;
        case TextureFormat.RGBA: return gl.RGBA;
        case TextureFormat.RED_INTEGER: return gl.RED_INTEGER;
        case TextureFormat.RG_INTEGER: return gl.RG_INTEGER;
        case TextureFormat.RGB_INTEGER: return gl.RGB_INTEGER;
        case TextureFormat.RGBA_INTEGER: return gl.RGBA_INTEGER;
        default: return assert.never(
            format,
            `Unknown texture format: ${format}`,
        );
    }
}

export function mapGlTextureType(
    gl: WebGL2RenderingContext,
    type: TextureType,
): number {
    switch (type) {
        case TextureType.BYTE: return gl.BYTE;
        case TextureType.SHORT: return gl.SHORT;
        case TextureType.INT: return gl.INT;
        case TextureType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
        case TextureType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
        case TextureType.UNSIGNED_INT: return gl.UNSIGNED_INT;
        case TextureType.FLOAT: return gl.FLOAT;
        default: return assert.never(type, `Unknown texture type: ${type}`);
    }
}
