import { DataType, Filter, Wrap, InternalFormat, Format } from "./types";

export type Device = import ("./device").Device;

export type TextureDataType = DataType;
export type TextureInternalFormat = InternalFormat;
export type TextureFormat = Format;
export type TextureWrap = Wrap;
export type TextureMinFilter = Filter;
export type TextureMagFilter = Filter.NEAREST | Filter.LINEAR;

export interface InternalFormatToDataFormat {

    // RED
    [InternalFormat.R8]: Format.RED;
    [InternalFormat.R8_SNORM]: Format.RED;
    [InternalFormat.R8UI]: Format.RED_INTEGER;
    [InternalFormat.R8I]: Format.RED_INTEGER;
    [InternalFormat.R16UI]: Format.RED_INTEGER;
    [InternalFormat.R16I]: Format.RED_INTEGER;
    [InternalFormat.R32UI]: Format.RED_INTEGER;
    [InternalFormat.R32I]: Format.RED_INTEGER;
    [InternalFormat.R16F]: Format.RED;
    [InternalFormat.R32F]: Format.RED;

    // RG
    [InternalFormat.RG8]: Format.RG;
    [InternalFormat.RG8_SNORM]: Format.RG;
    [InternalFormat.RG8UI]: Format.RG_INTEGER;
    [InternalFormat.RG8I]: Format.RG_INTEGER;
    [InternalFormat.RG16UI]: Format.RG_INTEGER;
    [InternalFormat.RG16I]: Format.RG_INTEGER;
    [InternalFormat.RG32UI]: Format.RG_INTEGER;
    [InternalFormat.RG32I]: Format.RG_INTEGER;
    [InternalFormat.RG16F]: Format.RG;
    [InternalFormat.RG32F]: Format.RG;

    // RGB
    [InternalFormat.RGB8]: Format.RGB;
    [InternalFormat.RGB8_SNORM]: Format.RGB;
    [InternalFormat.RGB8UI]: Format.RGB_INTEGER;
    [InternalFormat.RGB8I]: Format.RGB_INTEGER;
    [InternalFormat.RGB16UI]: Format.RGB_INTEGER;
    [InternalFormat.RGB16I]: Format.RGB_INTEGER;
    [InternalFormat.RGB32UI]: Format.RGB_INTEGER;
    [InternalFormat.RGB32I]: Format.RGB_INTEGER;
    [InternalFormat.RGB16F]: Format.RGB;
    [InternalFormat.RGB32F]: Format.RGB;

    // RGBA
    [InternalFormat.RGBA8]: Format.RGBA;
    [InternalFormat.RGBA8_SNORM]: Format.RGBA;
    [InternalFormat.RGBA8UI]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA8I]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA16UI]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA16I]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA32UI]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA32I]: Format.RGBA_INTEGER;
    [InternalFormat.RGBA16F]: Format.RGBA;
    [InternalFormat.RGBA32F]: Format.RGBA;

    // DEPTH
    [InternalFormat.DEPTH_COMPONENT16]: Format.DEPTH_COMPONENT;
    [InternalFormat.DEPTH_COMPONENT24]: Format.DEPTH_COMPONENT;
    [InternalFormat.DEPTH_COMPONENT32F]: Format.DEPTH_COMPONENT;

    // DEPTH STENCIL
    [InternalFormat.DEPTH24_STENCIL8]: Format.DEPTH_STENCIL;
    [InternalFormat.DEPTH32F_STENCIL8]: Format.DEPTH_STENCIL;

    [p: number]: TextureFormat;
}

export interface InternalFormatToDataType {

    // RED
    [InternalFormat.R8]: DataType.UNSIGNED_BYTE;
    [InternalFormat.R8_SNORM]: DataType.BYTE;
    [InternalFormat.R8UI]: DataType.UNSIGNED_BYTE;
    [InternalFormat.R8I]: DataType.BYTE;
    [InternalFormat.R16UI]: DataType.UNSIGNED_SHORT;
    [InternalFormat.R16I]: DataType.SHORT;
    [InternalFormat.R32UI]: DataType.UNSIGNED_INT;
    [InternalFormat.R32I]: DataType.INT;
    [InternalFormat.R16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [InternalFormat.R32F]: DataType.FLOAT;

    // RG
    [InternalFormat.RG8]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RG8_SNORM]: DataType.BYTE;
    [InternalFormat.RG8UI]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RG8I]: DataType.BYTE;
    [InternalFormat.RG16UI]: DataType.UNSIGNED_SHORT;
    [InternalFormat.RG16I]: DataType.SHORT;
    [InternalFormat.RG32UI]: DataType.UNSIGNED_INT;
    [InternalFormat.RG32I]: DataType.INT;
    [InternalFormat.RG16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [InternalFormat.RG32F]: DataType.FLOAT;

    // RGB
    [InternalFormat.RGB8]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RGB8_SNORM]: DataType.BYTE;
    [InternalFormat.RGB8UI]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RGB8I]: DataType.BYTE;
    [InternalFormat.RGB16UI]: DataType.UNSIGNED_SHORT;
    [InternalFormat.RGB16I]: DataType.SHORT;
    [InternalFormat.RGB32UI]: DataType.UNSIGNED_INT;
    [InternalFormat.RGB32I]: DataType.INT;
    [InternalFormat.RGB16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [InternalFormat.RGB32F]: DataType.FLOAT;

    // RGBA
    [InternalFormat.RGBA8]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RGBA8_SNORM]: DataType.BYTE;
    [InternalFormat.RGBA8UI]: DataType.UNSIGNED_BYTE;
    [InternalFormat.RGBA8I]: DataType.BYTE;
    [InternalFormat.RGBA16UI]: DataType.UNSIGNED_SHORT;
    [InternalFormat.RGBA16I]: DataType.SHORT;
    [InternalFormat.RGBA32UI]: DataType.UNSIGNED_INT;
    [InternalFormat.RGBA32I]: DataType.INT;
    [InternalFormat.RGBA16F]: DataType.HALF_FLOAT | DataType.FLOAT;
    [InternalFormat.RGBA32F]: DataType.FLOAT;

    // DEPTH
    [InternalFormat.DEPTH_COMPONENT16]:
    | DataType.UNSIGNED_SHORT
    | DataType.UNSIGNED_INT
    ;
    [InternalFormat.DEPTH_COMPONENT24]: DataType.UNSIGNED_INT;
    [InternalFormat.DEPTH_COMPONENT32F]: DataType.FLOAT;

    // DEPTH STENCIL
    [InternalFormat.DEPTH24_STENCIL8]: DataType.UNSIGNED_INT_24_8;
    [InternalFormat.DEPTH32F_STENCIL8]: DataType.FLOAT_32_UNSIGNED_INT_24_8_REV;

    [p: number]: TextureDataType;
}

export interface InternalFormatToTypedArray {

    // RED
    [InternalFormat.R8]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.R8_SNORM]: Int8Array;
    [InternalFormat.R8UI]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.R8I]: Int8Array;
    [InternalFormat.R16UI]: Uint16Array;
    [InternalFormat.R16I]: Int16Array;
    [InternalFormat.R32UI]: Uint32Array;
    [InternalFormat.R32I]: Int32Array;
    [InternalFormat.R16F]: Float32Array; // Float16Array
    [InternalFormat.R32F]: Float32Array;

    // RG
    [InternalFormat.RG8]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RG8_SNORM]: Int8Array;
    [InternalFormat.RG8UI]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RG8I]: Int8Array;
    [InternalFormat.RG16UI]: Uint16Array;
    [InternalFormat.RG16I]: Int16Array;
    [InternalFormat.RG32UI]: Uint32Array;
    [InternalFormat.RG32I]: Int32Array;
    [InternalFormat.RG16F]: Float32Array; // Float16Array
    [InternalFormat.RG32F]: Float32Array;

    // RGB
    [InternalFormat.RGB8]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RGB8_SNORM]: Int8Array;
    [InternalFormat.RGB8UI]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RGB8I]: Int8Array;
    [InternalFormat.RGB16UI]: Uint16Array;
    [InternalFormat.RGB16I]: Int16Array;
    [InternalFormat.RGB32UI]: Uint32Array;
    [InternalFormat.RGB32I]: Int32Array;
    [InternalFormat.RGB16F]: Float32Array; // Float16Array
    [InternalFormat.RGB32F]: Float32Array;

    // RGBA
    [InternalFormat.RGBA8]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RGBA8_SNORM]: Int8Array;
    [InternalFormat.RGBA8UI]: Uint8Array | Uint8ClampedArray;
    [InternalFormat.RGBA8I]: Int8Array;
    [InternalFormat.RGBA16UI]: Uint16Array;
    [InternalFormat.RGBA16I]: Int16Array;
    [InternalFormat.RGBA32UI]: Uint32Array;
    [InternalFormat.RGBA32I]: Int32Array;
    [InternalFormat.RGBA16F]: Float32Array; // Float16Array
    [InternalFormat.RGBA32F]: Float32Array;

    // DEPTH
    [InternalFormat.DEPTH_COMPONENT16]: Uint16Array | Uint32Array;
    [InternalFormat.DEPTH_COMPONENT24]: Uint32Array;
    [InternalFormat.DEPTH_COMPONENT32F]: Float32Array;

    // DEPTH STENCIL
    [InternalFormat.DEPTH24_STENCIL8]: Uint32Array;
    [InternalFormat.DEPTH32F_STENCIL8]: never; // yay!

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
    width?: number;
    height?: number;
}

/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type.
 */
export class Texture<F extends TextureInternalFormat> {

    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    static create<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        {
            min = Filter.NEAREST,
            mag = Filter.NEAREST,
            wrapS = Wrap.CLAMP_TO_EDGE,
            wrapT = Wrap.CLAMP_TO_EDGE,
        }: TextureOptions = {},
    ): Texture<F> {
        return new Texture(
            dev._gl,
            width, height,
            internalFormat,
            wrapS, wrapT,
            min, mag,
        );
    }

    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    static withImage(
        dev: Device,
        image: ImageData,
        options?: TextureOptions & TextureStoreOptions,
    ): Texture<InternalFormat.RGBA8> {
        return Texture.withTypedArray(
            dev,
            image.width,
            image.height,
            InternalFormat.RGBA8,
            image.data,
            Format.RGBA,
            DataType.UNSIGNED_BYTE,
            options,
        );
    }

    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    static withTypedArray<F extends TextureInternalFormat>(
        dev: Device,
        width: number,
        height: number,
        internalFormat: F,
        data: InternalFormatToTypedArray[F],
        dataFormat: InternalFormatToDataFormat[F],
        dataType: InternalFormatToDataType[F],
        options: TextureOptions & TextureStoreOptions = {},
    ): Texture<F> {
        const {
            min = Filter.NEAREST,
            mag = Filter.NEAREST,
            wrapS = Wrap.CLAMP_TO_EDGE,
            wrapT = Wrap.CLAMP_TO_EDGE,
        } = options;
        return new Texture(
            dev._gl,
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

    /**
     * Reinitialize invalid texture, eg. after context is lost.
     */
    restore(): void {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) { this.init(); }
    }

    /**
     * Upload new data to texture. Does not take ownership of data.
     */
    store(
        data: InternalFormatToTypedArray[F],
        format: InternalFormatToDataFormat[F],
        type: InternalFormatToDataType[F],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: TextureStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

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

    /**
     * Generate mipmap levels for the current data.
     */
    mipmap(): void {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private init(): void {
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
}
