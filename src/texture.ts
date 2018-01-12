import { Device } from "./device";

export interface TextureOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
    mipmap?: boolean;
}

export const enum TextureWrap {
    CLAMP_TO_EDGE = 0x812F,
    REPEAT = 0x2901,
    MIRRORED_REPEAT = 0x8370,
}

export const enum TextureFilter {
    NEAREST = 0x2600,
    LINEAR = 0x2601,
    NEAREST_MIPMAP_NEAREST = 0x2700,
    LINEAR_MIPMAP_NEAREST = 0x2701,
    NEAREST_MIPMAP_LINEAR = 0x2702,
    LINEAR_MIPMAP_LINEAR = 0x2703,
}

export type TextureMinFilter = TextureFilter;
export type TextureMagFilter = TextureFilter.NEAREST | TextureFilter.LINEAR;

export const enum TextureInternalFormat {
    // R
    R8 = 0x8229,
    R8_SNORM = 0x8F94,
    R8UI = 0x8232,
    R8I = 0x8231,
    R16UI = 0x8234,
    R16I = 0x8233,
    R32UI = 0x8236,
    R32I = 0x8235,
    R16F = 0x822D,
    R32F = 0x822E,

    // RG
    RG8 = 0x822B,
    RG8_SNORM = 0x8F95,
    RG8UI = 0x8238,
    RG8I = 0x8237,
    RG16UI = 0x823A,
    RG16I = 0x8239,
    RG32UI = 0x823C,
    RG32I = 0x823B,
    RG16F = 0x822F,
    RG32F = 0x8230,

    // RGB
    RGB8 = 0x8051,
    RGB8_SNORM = 0x8F96,
    RGB8UI = 0x8D7D,
    RGB8I = 0x8D8F,
    RGB16UI = 0x8D77,
    RGB16I = 0x8D89,
    RGB32UI = 0x8D71,
    RGB32I = 0x8D83,
    RGB16F = 0x881B,
    RGB32F = 0x8815,

    // RGBA
    RGBA8 = 0x8058,
    RGBA8_SNORM = 0x8F97,
    RGBA8UI = 0x8D7C,
    RGBA8I = 0x8D8E,
    RGBA16UI = 0x8D76,
    RGBA16I = 0x8D88,
    RGBA32UI = 0x8D70,
    RGBA32I = 0x8D82,
    RGBA16F = 0x881A,
    RGBA32F = 0x8814,

    // TODO: support exotic formats

    // ~DEPTH
    // DEPTH_COMPONENT16
    // DEPTH_COMPONENT24
    // DEPTH_COMPONENT32F

    // ~DEPTH STENCIL
    // DEPTH24_STENCIL8
    // DEPTH32F_STENCIL8

    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
}

export const enum TextureFormat {
    RED = 0x1903,
    RG = 0x8227,
    RGB = 0x1907,
    RGBA = 0x1908,
    RED_INTEGER = 0x8D94,
    RG_INTEGER = 0x8228,
    RGB_INTEGER = 0x8D98,
    RGBA_INTEGER = 0x8D99,

    // TODO: support exotic formats

    // DEPTH_COMPONENT
    // DEPTH_STENCIL
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
}

export const enum TextureType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,

    // TODO: support exotic formats
    // HALF_FLOAT

    // UNSIGNED_SHORT_4_4_4_4
    // UNSIGNED_SHORT_5_5_5_1
    // UNSIGNED_SHORT_5_6_5

    // UNSIGNED_INT_24_8
    // UNSIGNED_INT_5_9_9_9_REV
    // UNSIGNED_INT_2_10_10_10_REV
    // UNSIGNED_INT_10F_11F_11F_REV

    // FLOAT_32_UNSIGNED_INT_24_8_REV
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

    private gl: WebGL2RenderingContext;
    private data: ArrayBufferView | null;

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
        this.glTexture = null;

        this.init();
    }

    init(): void {
        const {
            gl,
            data,
            width,
            height,
            internalFormat,
            format,
            type,
            wrapS,
            wrapT,
            minFilter,
            magFilter,
            mipmap,
        } = this;
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
        if (data) {
            gl.texSubImage2D(
                gl.TEXTURE_2D,
                0,
                0, 0,
                width, height,
                format,
                type,
                data,
            );
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);

        if (mipmap) { gl.generateMipmap(gl.TEXTURE_2D); }

        gl.bindTexture(gl.TEXTURE_2D, null);

        (this as any).glTexture = texture;
    }

    restore(): void {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) { this.init(); }
    }
}
