import { Device } from "./device";

export interface TextureOptions {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
}

export enum TextureWrap {
    CLAMP_TO_EDGE = 0x812F,
    REPEAT = 0x2901,
    MIRRORED_REPEAT = 0x8370,
}

export enum TextureFilter {
    NEAREST = 0x2600,
    LINEAR = 0x2601,
    NEAREST_MIPMAP_NEAREST = 0x2700,
    LINEAR_MIPMAP_NEAREST = 0x2701,
    NEAREST_MIPMAP_LINEAR = 0x2702,
    LINEAR_MIPMAP_LINEAR = 0x2703,
}

export type TextureMinFilter = TextureFilter;
export type TextureMagFilter = TextureFilter.NEAREST | TextureFilter.LINEAR;

export enum TextureInternalFormat {

    // RED
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

    // DEPTH
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,

    // DEPTH STENCIL
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,

    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
}

export type TextureColorInternalFormat =

    // RED
    | TextureInternalFormat.R8
    | TextureInternalFormat.R8_SNORM
    | TextureInternalFormat.R8UI
    | TextureInternalFormat.R8I
    | TextureInternalFormat.R16UI
    | TextureInternalFormat.R16I
    | TextureInternalFormat.R32UI
    | TextureInternalFormat.R32I
    | TextureInternalFormat.R16F
    | TextureInternalFormat.R32F

    // RG
    | TextureInternalFormat.RG8
    | TextureInternalFormat.RG8_SNORM
    | TextureInternalFormat.RG8UI
    | TextureInternalFormat.RG8I
    | TextureInternalFormat.RG16UI
    | TextureInternalFormat.RG16I
    | TextureInternalFormat.RG32UI
    | TextureInternalFormat.RG32I
    | TextureInternalFormat.RG16F
    | TextureInternalFormat.RG32F

    // RGB
    | TextureInternalFormat.RGB8
    | TextureInternalFormat.RGB8_SNORM
    | TextureInternalFormat.RGB8UI
    | TextureInternalFormat.RGB8I
    | TextureInternalFormat.RGB16UI
    | TextureInternalFormat.RGB16I
    | TextureInternalFormat.RGB32UI
    | TextureInternalFormat.RGB32I
    | TextureInternalFormat.RGB16F
    | TextureInternalFormat.RGB32F

    // RGBA
    | TextureInternalFormat.RGBA8
    | TextureInternalFormat.RGBA8_SNORM
    | TextureInternalFormat.RGBA8UI
    | TextureInternalFormat.RGBA8I
    | TextureInternalFormat.RGBA16UI
    | TextureInternalFormat.RGBA16I
    | TextureInternalFormat.RGBA32UI
    | TextureInternalFormat.RGBA32I
    | TextureInternalFormat.RGBA16F
    | TextureInternalFormat.RGBA32F
    ;

export type TextureDepthInternalFormat =
    | TextureInternalFormat.DEPTH_COMPONENT16
    | TextureInternalFormat.DEPTH_COMPONENT24
    | TextureInternalFormat.DEPTH_COMPONENT32F
    ;

export type TextureDepthStencilInternalFormat =
    | TextureInternalFormat.DEPTH24_STENCIL8
    | TextureInternalFormat.DEPTH32F_STENCIL8
    ;

export enum TextureDataFormat {
    RED = 0x1903,
    RG = 0x8227,
    RGB = 0x1907,
    RGBA = 0x1908,
    RED_INTEGER = 0x8D94,
    RG_INTEGER = 0x8228,
    RGB_INTEGER = 0x8D98,
    RGBA_INTEGER = 0x8D99,

    // TODO: support exotic formats

    DEPTH_COMPONENT = 0x1902,
    DEPTH_STENCIL = 0x84F9,
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
}

export enum TextureDataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
    HALF_FLOAT = 0x140B,

    // TODO: support exotic formats
    // UNSIGNED_SHORT_4_4_4_4
    // UNSIGNED_SHORT_5_5_5_1
    // UNSIGNED_SHORT_5_6_5

    UNSIGNED_INT_24_8 = 0x84FA,
    // UNSIGNED_INT_5_9_9_9_REV
    // UNSIGNED_INT_2_10_10_10_REV
    // UNSIGNED_INT_10F_11F_11F_REV

    FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD,
}

export class Texture<F extends TextureInternalFormat> {

    static fromImage(
        dev: Device,
        image: ImageData,
        mipmap: boolean = false,
        options?: TextureOptions,
    ): Texture<TextureInternalFormat.RGBA8> {
        return Texture.create(
            dev,
            image.width,
            image.height,
            TextureInternalFormat.RGBA8,
            image.data,
            TextureDataFormat.RGBA,
            TextureDataType.UNSIGNED_BYTE,
            mipmap,
            options,
        );
    }

    static empty<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        {
            min = TextureFilter.NEAREST,
            mag = TextureFilter.NEAREST,
            wrapS = TextureWrap.CLAMP_TO_EDGE,
            wrapT = TextureWrap.CLAMP_TO_EDGE,
        }: TextureOptions = {},
    ): Texture<F> {
        return new Texture(
            dev.gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        );
    }

    static create<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        data: InternalFormatToTypedArray[F],
        dataFormat: InternalFormatToDataFormat[F],
        dataType: InternalFormatToDataType[F],
        mipmap: boolean,
        {
            min = TextureFilter.NEAREST,
            mag = TextureFilter.NEAREST,
            wrapS = TextureWrap.CLAMP_TO_EDGE,
            wrapT = TextureWrap.CLAMP_TO_EDGE,
        }: TextureOptions = {},
    ): Texture<F> {
        const tex = new Texture(
            dev.gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        );
        if (data) { tex.store(data, dataFormat, dataType, mipmap); }
        return tex;
    }

    readonly width: number;
    readonly height: number;
    readonly format: F;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;

    readonly glTexture: WebGLTexture | null;

    private gl: WebGL2RenderingContext;

    private constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        format: F,
        wrapS: TextureWrap,
        wrapT: TextureWrap,
        minFilter: TextureMinFilter,
        magFilter: TextureMagFilter,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.format = format;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.glTexture = null;

        this.init();
    }

    init(): void {
        const {
            gl,
            width,
            height,
            format,
            wrapS,
            wrapT,
            minFilter,
            magFilter,
        } = this;
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texStorage2D(gl.TEXTURE_2D, 1, format, width, height);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);

        gl.bindTexture(gl.TEXTURE_2D, null);

        (this as any).glTexture = texture;
    }

    restore(): void {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) { this.init(); }
    }

    store(
        data: InternalFormatToTypedArray[F],
        format: InternalFormatToDataFormat[F],
        type: InternalFormatToDataType[F],
        mipmap: boolean = false,
    ): void {
        const { gl, glTexture, width, height } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0, 0,
            width, height,
            format,
            type,
            data,
        );
        if (mipmap) { gl.generateMipmap(gl.TEXTURE_2D); }
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    mipmap(): void {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export interface InternalFormatToDataFormat {

    // RED
    [TextureInternalFormat.R8]: TextureDataFormat.RED;
    [TextureInternalFormat.R8_SNORM]: TextureDataFormat.RED;
    [TextureInternalFormat.R8UI]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R8I]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R16UI]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R16I]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R32UI]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R32I]: TextureDataFormat.RED_INTEGER;
    [TextureInternalFormat.R16F]: TextureDataFormat.RED;
    [TextureInternalFormat.R32F]: TextureDataFormat.RED;

    // RG
    [TextureInternalFormat.RG8]: TextureDataFormat.RG;
    [TextureInternalFormat.RG8_SNORM]: TextureDataFormat.RG;
    [TextureInternalFormat.RG8UI]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG8I]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG16UI]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG16I]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG32UI]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG32I]: TextureDataFormat.RG_INTEGER;
    [TextureInternalFormat.RG16F]: TextureDataFormat.RG;
    [TextureInternalFormat.RG32F]: TextureDataFormat.RG;

    // RGB
    [TextureInternalFormat.RGB8]: TextureDataFormat.RGB;
    [TextureInternalFormat.RGB8_SNORM]: TextureDataFormat.RGB;
    [TextureInternalFormat.RGB8UI]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB8I]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16UI]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16I]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB32UI]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB32I]: TextureDataFormat.RGB_INTEGER;
    [TextureInternalFormat.RGB16F]: TextureDataFormat.RGB;
    [TextureInternalFormat.RGB32F]: TextureDataFormat.RGB;

    // RGBA
    [TextureInternalFormat.RGBA8]: TextureDataFormat.RGBA;
    [TextureInternalFormat.RGBA8_SNORM]: TextureDataFormat.RGBA;
    [TextureInternalFormat.RGBA8UI]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA8I]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16UI]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16I]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA32UI]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA32I]: TextureDataFormat.RGBA_INTEGER;
    [TextureInternalFormat.RGBA16F]: TextureDataFormat.RGBA;
    [TextureInternalFormat.RGBA32F]: TextureDataFormat.RGBA;

    // DEPTH
    [TextureInternalFormat.DEPTH_COMPONENT16]: TextureDataFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT24]: TextureDataFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: TextureDataFormat.DEPTH_COMPONENT;

    // DEPTH STENCIL
    [TextureInternalFormat.DEPTH24_STENCIL8]: TextureDataFormat.DEPTH_STENCIL;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: TextureDataFormat.DEPTH_STENCIL;

    [p: number]: TextureDataFormat;
}

export interface InternalFormatToDataType {

    // RED
    [TextureInternalFormat.R8]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.R8_SNORM]: TextureDataType.BYTE;
    [TextureInternalFormat.R8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.R8I]: TextureDataType.BYTE;
    [TextureInternalFormat.R16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureInternalFormat.R16I]: TextureDataType.SHORT;
    [TextureInternalFormat.R32UI]: TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.R32I]: TextureDataType.INT;
    [TextureInternalFormat.R16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureInternalFormat.R32F]: TextureDataType.FLOAT;

    // RG
    [TextureInternalFormat.RG8]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RG8_SNORM]: TextureDataType.BYTE;
    [TextureInternalFormat.RG8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RG8I]: TextureDataType.BYTE;
    [TextureInternalFormat.RG16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RG16I]: TextureDataType.SHORT;
    [TextureInternalFormat.RG32UI]: TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.RG32I]: TextureDataType.INT;
    [TextureInternalFormat.RG16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureInternalFormat.RG32F]: TextureDataType.FLOAT;

    // RGB
    [TextureInternalFormat.RGB8]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGB8_SNORM]: TextureDataType.BYTE;
    [TextureInternalFormat.RGB8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGB8I]: TextureDataType.BYTE;
    [TextureInternalFormat.RGB16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RGB16I]: TextureDataType.SHORT;
    [TextureInternalFormat.RGB32UI]: TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.RGB32I]: TextureDataType.INT;
    [TextureInternalFormat.RGB16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureInternalFormat.RGB32F]: TextureDataType.FLOAT;

    // RGBA
    [TextureInternalFormat.RGBA8]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGBA8_SNORM]: TextureDataType.BYTE;
    [TextureInternalFormat.RGBA8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureInternalFormat.RGBA8I]: TextureDataType.BYTE;
    [TextureInternalFormat.RGBA16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureInternalFormat.RGBA16I]: TextureDataType.SHORT;
    [TextureInternalFormat.RGBA32UI]: TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.RGBA32I]: TextureDataType.INT;
    [TextureInternalFormat.RGBA16F]: TextureDataType.HALF_FLOAT | TextureDataType.FLOAT;
    [TextureInternalFormat.RGBA32F]: TextureDataType.FLOAT;

    // DEPTH
    [TextureInternalFormat.DEPTH_COMPONENT16]: TextureDataType.UNSIGNED_SHORT | TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.DEPTH_COMPONENT24]: TextureDataType.UNSIGNED_INT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: TextureDataType.FLOAT;

    // DEPTH STENCIL
    [TextureInternalFormat.DEPTH24_STENCIL8]: TextureDataType.UNSIGNED_INT_24_8;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV;

    [p: number]: TextureDataType;
}

export interface InternalFormatToTypedArray {

    // RED
    [TextureInternalFormat.R8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.R8_SNORM]: Int8Array;
    [TextureInternalFormat.R8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.R8I]: Int8Array;
    [TextureInternalFormat.R16UI]: Uint16Array;
    [TextureInternalFormat.R16I]: Int16Array;
    [TextureInternalFormat.R32UI]: Uint32Array;
    [TextureInternalFormat.R32I]: Int32Array;
    [TextureInternalFormat.R16F]: Float32Array; // Float16Array
    [TextureInternalFormat.R32F]: Float32Array;

    // RG
    [TextureInternalFormat.RG8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RG8_SNORM]: Int8Array;
    [TextureInternalFormat.RG8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RG8I]: Int8Array;
    [TextureInternalFormat.RG16UI]: Uint16Array;
    [TextureInternalFormat.RG16I]: Int16Array;
    [TextureInternalFormat.RG32UI]: Uint32Array;
    [TextureInternalFormat.RG32I]: Int32Array;
    [TextureInternalFormat.RG16F]: Float32Array; // Float16Array
    [TextureInternalFormat.RG32F]: Float32Array;

    // RGB
    [TextureInternalFormat.RGB8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGB8_SNORM]: Int8Array;
    [TextureInternalFormat.RGB8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGB8I]: Int8Array;
    [TextureInternalFormat.RGB16UI]: Uint16Array;
    [TextureInternalFormat.RGB16I]: Int16Array;
    [TextureInternalFormat.RGB32UI]: Uint32Array;
    [TextureInternalFormat.RGB32I]: Int32Array;
    [TextureInternalFormat.RGB16F]: Float32Array; // Float16Array
    [TextureInternalFormat.RGB32F]: Float32Array;

    // RGBA
    [TextureInternalFormat.RGBA8]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGBA8_SNORM]: Int8Array;
    [TextureInternalFormat.RGBA8UI]: Uint8Array | Uint8ClampedArray;
    [TextureInternalFormat.RGBA8I]: Int8Array;
    [TextureInternalFormat.RGBA16UI]: Uint16Array;
    [TextureInternalFormat.RGBA16I]: Int16Array;
    [TextureInternalFormat.RGBA32UI]: Uint32Array;
    [TextureInternalFormat.RGBA32I]: Int32Array;
    [TextureInternalFormat.RGBA16F]: Float32Array; // Float16Array
    [TextureInternalFormat.RGBA32F]: Float32Array;

    // DEPTH
    [TextureInternalFormat.DEPTH_COMPONENT16]: Uint16Array | Uint32Array;
    [TextureInternalFormat.DEPTH_COMPONENT24]: Uint32Array;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: Float32Array;

    // DEPTH STENCIL
    [TextureInternalFormat.DEPTH24_STENCIL8]: Uint32Array;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: never; // yay!

    [p: number]: ArrayBufferView;
}
