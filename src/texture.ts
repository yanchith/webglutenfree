import { Device as _Device } from "./core";
import { DataType } from "./types";

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

export enum TextureFormat {
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

export type TextureDataType =
    | DataType.BYTE
    | DataType.UNSIGNED_BYTE
    | DataType.SHORT
    | DataType.UNSIGNED_SHORT
    | DataType.INT
    | DataType.UNSIGNED_INT
    | DataType.FLOAT
    | DataType.HALF_FLOAT

    // | DataType.UNSIGNED_SHORT_4_4_4_4
    // | DataType.UNSIGNED_SHORT_5_5_5_1
    // | DataType.UNSIGNED_SHORT_5_6_5

    | DataType.UNSIGNED_INT_24_8
    // | DataType.UNSIGNED_INT_5_9_9_9_REV
    // | DataType.UNSIGNED_INT_2_10_10_10_REV
    // | DataType.UNSIGNED_INT_10F_11F_11F_REV

    | DataType.FLOAT_32_UNSIGNED_INT_24_8_REV
    ;

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

export interface InternalFormatToDataFormat {

    // RED
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

    // RG
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

    // RGB
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

    // RGBA
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

    // DEPTH
    [TextureInternalFormat.DEPTH_COMPONENT16]: TextureFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT24]: TextureFormat.DEPTH_COMPONENT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: TextureFormat.DEPTH_COMPONENT;

    // DEPTH STENCIL
    [TextureInternalFormat.DEPTH24_STENCIL8]: TextureFormat.DEPTH_STENCIL;
    [TextureInternalFormat.DEPTH32F_STENCIL8]: TextureFormat.DEPTH_STENCIL;

    [p: number]: TextureFormat;
}

export interface InternalFormatToDataType {

    // RED
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

    // RG
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

    // RGB
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

    // RGBA
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

    // DEPTH
    [TextureInternalFormat.DEPTH_COMPONENT16]:
    | DataType.UNSIGNED_SHORT
    | DataType.UNSIGNED_INT
    ;
    [TextureInternalFormat.DEPTH_COMPONENT24]: DataType.UNSIGNED_INT;
    [TextureInternalFormat.DEPTH_COMPONENT32F]: DataType.FLOAT;

    // DEPTH STENCIL
    [TextureInternalFormat.DEPTH24_STENCIL8]: DataType.UNSIGNED_INT_24_8;
    [TextureInternalFormat.DEPTH32F_STENCIL8]:
    | DataType.FLOAT_32_UNSIGNED_INT_24_8_REV
    ;

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

export class Texture<F extends TextureInternalFormat> {

    static create<F extends TextureInternalFormat>(
        dev: _Device,
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

    static withImage(
        dev: _Device,
        image: ImageData,
        options?: TextureOptions & TextureStoreOptions,
    ): Texture<TextureInternalFormat.RGBA8> {
        return Texture.withTypedArray(
            dev,
            image.width,
            image.height,
            TextureInternalFormat.RGBA8,
            image.data,
            TextureFormat.RGBA,
            DataType.UNSIGNED_BYTE,
            options,
        );
    }

    static withTypedArray<F extends TextureInternalFormat>(
        dev: _Device,
        width: number,
        height: number,
        internalFormat: F,
        data: InternalFormatToTypedArray[F],
        dataFormat: InternalFormatToDataFormat[F],
        dataType: InternalFormatToDataType[F],
        options: TextureOptions & TextureStoreOptions = {},
    ): Texture<F> {
        const {
            min = TextureFilter.NEAREST,
            mag = TextureFilter.NEAREST,
            wrapS = TextureWrap.CLAMP_TO_EDGE,
            wrapT = TextureWrap.CLAMP_TO_EDGE,
        } = options;
        return new Texture(
            dev.gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        ).store(data, dataFormat, dataType, options);
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
        { xOffset = 0, yOffset = 0, mipmap = false }: TextureStoreOptions = {},
    ): this {
        const { gl, glTexture, width, height } = this;

        gl.bindTexture(gl.TEXTURE_2D, glTexture);

        // This pixel row alignment is theoretically smaller than needed
        // TODO: find greatest correct unpack alignment for pixel rows
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, data.BYTES_PER_ELEMENT);
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0, // level
            xOffset,
            yOffset,
            width,
            height,
            format,
            type,
            // Chrome does not handle Uint8ClampedArray well
            data instanceof Uint8ClampedArray ? new Uint8Array(data) : data,
        );
        if (mipmap) { gl.generateMipmap(gl.TEXTURE_2D); }
        gl.bindTexture(gl.TEXTURE_2D, null);

        return this;
    }

    mipmap(): void {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
