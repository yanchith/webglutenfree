import * as assert from "./util/assert";

export enum TextureColorStorageFormat {
    // R
    R8 = 0x8229,
    R8_SNORM = 0x8F94,
    R8UI = 0x8232,
    R8I = 0x8231,
    R16UI = 0x8234,
    R16I = 0x8233,
    R16F = 0x822D,
    R32UI = 0x8236,
    R32I = 0x8235,
    R32F = 0x822E,

    // RG
    RG8 = 0x822B,
    RG8_SNORM = 0x8F95,
    RG8UI = 0x8238,
    RG8I = 0x8237,
    RG16UI = 0x823A,
    RG16I = 0x8239,
    RG16F = 0x822F,
    RG32UI = 0x823C,
    RG32I = 0x823B,
    RG32F = 0x8230,

    // RGB
    RGB8 = 0x8051,
    RGB8_SNORM = 0x8F96,
    RGB8UI = 0x8D7D,
    RGB8I = 0x8D8F,
    RGB16UI = 0x8D77,
    RGB16I = 0x8D89,
    RGB16F = 0x881B,
    RGB32UI = 0x8D71,
    RGB32I = 0x8D83,
    RGB32F = 0x8815,

    // RGBA
    RGBA8 = 0x8058,
    RGBA8_SNORM = 0x8F97,
    RGBA8UI = 0x8D7C,
    RGBA8I = 0x8D8E,
    RGBA16UI = 0x8D76,
    RGBA16I = 0x8D88,
    RGBA16F = 0x881A,
    RGBA32UI = 0x8D70,
    RGBA32I = 0x8D82,
    RGBA32F = 0x8814,

    // TODO: support exotic formats

    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
}

export enum TextureDepthStorageFormat {
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
}

export enum TextureDepthStencilStorageFormat {
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
}

export type TextureStorageFormat =
    | TextureColorStorageFormat
    | TextureDepthStorageFormat
    | TextureDepthStencilStorageFormat
    ;

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

export enum TextureDataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,

    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    HALF_FLOAT = 0x140B,

    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,

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

export enum TextureWrap {
    CLAMP_TO_EDGE = 0x812F,
    REPEAT = 0x2901,
    MIRRORED_REPEAT = 0x8370,
}

export enum TextureMinFilter {
    NEAREST = 0x2600,
    LINEAR = 0x2601,
    NEAREST_MIPMAP_NEAREST = 0x2700,
    LINEAR_MIPMAP_NEAREST = 0x2701,
    NEAREST_MIPMAP_LINEAR = 0x2702,
    LINEAR_MIPMAP_LINEAR = 0x2703,
}

export enum TextureMagFilter {
    NEAREST = 0x2600,
    LINEAR = 0x2601,
}

export interface StorageFormatToFormat {

    // RED
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

    // RG
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

    // RGB
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

    // RGBA
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

    // DEPTH
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]:
        TextureFormat.DEPTH_COMPONENT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]:
        TextureFormat.DEPTH_COMPONENT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]:
        TextureFormat.DEPTH_COMPONENT;

    // DEPTH STENCIL
    [TextureDepthStencilStorageFormat.DEPTH24_STENCIL8]:
        TextureFormat.DEPTH_STENCIL;
    [TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8]:
        TextureFormat.DEPTH_STENCIL;
}

export interface StorageFormatToDataType {

    // RED
    [TextureColorStorageFormat.R8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.R8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.R8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.R8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.R16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.R16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.R16F]:
        | TextureDataType.HALF_FLOAT
        | TextureDataType.FLOAT
        ;
    [TextureColorStorageFormat.R32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.R32I]: TextureDataType.INT;
    [TextureColorStorageFormat.R32F]: TextureDataType.FLOAT;

    // RG
    [TextureColorStorageFormat.RG8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RG8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RG8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RG8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RG16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RG16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RG16F]:
        | TextureDataType.HALF_FLOAT
        | TextureDataType.FLOAT
        ;
    [TextureColorStorageFormat.RG32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RG32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RG32F]: TextureDataType.FLOAT;

    // RGB
    [TextureColorStorageFormat.RGB8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGB8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGB8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGB8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGB16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RGB16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RGB16F]:
        | TextureDataType.HALF_FLOAT
        | TextureDataType.FLOAT
        ;
    [TextureColorStorageFormat.RGB32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RGB32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RGB32F]: TextureDataType.FLOAT;

    // RGBA
    [TextureColorStorageFormat.RGBA8]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGBA8_SNORM]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGBA8UI]: TextureDataType.UNSIGNED_BYTE;
    [TextureColorStorageFormat.RGBA8I]: TextureDataType.BYTE;
    [TextureColorStorageFormat.RGBA16UI]: TextureDataType.UNSIGNED_SHORT;
    [TextureColorStorageFormat.RGBA16I]: TextureDataType.SHORT;
    [TextureColorStorageFormat.RGBA16F]:
        | TextureDataType.HALF_FLOAT
        | TextureDataType.FLOAT
        ;
    [TextureColorStorageFormat.RGBA32UI]: TextureDataType.UNSIGNED_INT;
    [TextureColorStorageFormat.RGBA32I]: TextureDataType.INT;
    [TextureColorStorageFormat.RGBA32F]: TextureDataType.FLOAT;

    // DEPTH
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]:
        | TextureDataType.UNSIGNED_SHORT
        | TextureDataType.UNSIGNED_INT
        ;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]: TextureDataType.UNSIGNED_INT;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]: TextureDataType.FLOAT;

    // DEPTH STENCIL
    [TextureDepthStencilStorageFormat.DEPTH24_STENCIL8]:
        TextureDataType.UNSIGNED_INT_24_8;
    [TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8]:
        TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV;
}

export interface StorageFormatToTypedArray {

    // RED
    [TextureColorStorageFormat.R8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.R8_SNORM]: Int8Array;
    [TextureColorStorageFormat.R8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.R8I]: Int8Array;
    [TextureColorStorageFormat.R16UI]: Uint16Array;
    [TextureColorStorageFormat.R16I]: Int16Array;
    [TextureColorStorageFormat.R16F]: Float32Array; // | Float16Array
    [TextureColorStorageFormat.R32UI]: Uint32Array;
    [TextureColorStorageFormat.R32I]: Int32Array;
    [TextureColorStorageFormat.R32F]: Float32Array;

    // RG
    [TextureColorStorageFormat.RG8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RG8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RG8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RG8I]: Int8Array;
    [TextureColorStorageFormat.RG16UI]: Uint16Array;
    [TextureColorStorageFormat.RG16I]: Int16Array;
    [TextureColorStorageFormat.RG16F]: Float32Array; // | Float16Array
    [TextureColorStorageFormat.RG32UI]: Uint32Array;
    [TextureColorStorageFormat.RG32I]: Int32Array;
    [TextureColorStorageFormat.RG32F]: Float32Array;

    // RGB
    [TextureColorStorageFormat.RGB8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGB8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RGB8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGB8I]: Int8Array;
    [TextureColorStorageFormat.RGB16UI]: Uint16Array;
    [TextureColorStorageFormat.RGB16I]: Int16Array;
    [TextureColorStorageFormat.RGB16F]: Float32Array; // | Float16Array
    [TextureColorStorageFormat.RGB32UI]: Uint32Array;
    [TextureColorStorageFormat.RGB32I]: Int32Array;
    [TextureColorStorageFormat.RGB32F]: Float32Array;

    // RGBA
    [TextureColorStorageFormat.RGBA8]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGBA8_SNORM]: Int8Array;
    [TextureColorStorageFormat.RGBA8UI]: Uint8Array | Uint8ClampedArray;
    [TextureColorStorageFormat.RGBA8I]: Int8Array;
    [TextureColorStorageFormat.RGBA16UI]: Uint16Array;
    [TextureColorStorageFormat.RGBA16I]: Int16Array;
    [TextureColorStorageFormat.RGBA16F]: Float32Array; // | Float16Array
    [TextureColorStorageFormat.RGBA32UI]: Uint32Array;
    [TextureColorStorageFormat.RGBA32I]: Int32Array;
    [TextureColorStorageFormat.RGBA32F]: Float32Array;

    // DEPTH
    [TextureDepthStorageFormat.DEPTH_COMPONENT16]: Uint16Array | Uint32Array;
    [TextureDepthStorageFormat.DEPTH_COMPONENT24]: Uint32Array;
    [TextureDepthStorageFormat.DEPTH_COMPONENT32F]: Float32Array;

    // DEPTH STENCIL
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

export function _createTexture2D<S extends TextureStorageFormat>(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    storageFormat: S,
    {
        min = TextureMinFilter.NEAREST,
        mag = TextureMagFilter.NEAREST,
        wrapS = TextureWrap.CLAMP_TO_EDGE,
        wrapT = TextureWrap.CLAMP_TO_EDGE,
    }: Texture2DCreateOptions = {},
): Texture2D<S> {
    return new Texture2D(
        gl,
        width, height,
        storageFormat,
        wrapS, wrapT,
        min, mag,
    );
}

export function _createTexture2DWithTypedArray<S extends TextureStorageFormat>(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    storageFormat: S,
    data: StorageFormatToTypedArray[S],
    dataFormat: StorageFormatToFormat[S],
    dataType: StorageFormatToDataType[S],
    options: Texture2DCreateOptions & Texture2DStoreOptions = {},
): Texture2D<S> {
    const {
        min = TextureMinFilter.NEAREST,
        mag = TextureMagFilter.NEAREST,
        wrapS = TextureWrap.CLAMP_TO_EDGE,
        wrapT = TextureWrap.CLAMP_TO_EDGE,
    } = options;
    return new Texture2D(
        gl,
        width, height,
        storageFormat,
        wrapS, wrapT,
        min, mag,
    ).store(data, dataFormat, dataType, options);
}

export function _createTextureCubeMap<S extends TextureStorageFormat>(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    storageFormat: S,
    {
        min = TextureMinFilter.NEAREST,
        mag = TextureMagFilter.NEAREST,
        wrapS = TextureWrap.CLAMP_TO_EDGE,
        wrapT = TextureWrap.CLAMP_TO_EDGE,
        wrapR = TextureWrap.CLAMP_TO_EDGE,
    }: TextureCubeMapCreateOptions = {},
): TextureCubeMap<S> {
    return new TextureCubeMap(
        gl,
        width, height,
        storageFormat,
        wrapS, wrapT, wrapR,
        min, mag,
    );
}

export function _createTextureCubeMapWithTypedArray<S extends TextureStorageFormat>(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    storageFormat: S,
    dataPositiveX: StorageFormatToTypedArray[S],
    dataNegativeX: StorageFormatToTypedArray[S],
    dataPositiveY: StorageFormatToTypedArray[S],
    dataNegativeY: StorageFormatToTypedArray[S],
    dataPositiveZ: StorageFormatToTypedArray[S],
    dataNegativeZ: StorageFormatToTypedArray[S],
    dataFormat: StorageFormatToFormat[S],
    dataType: StorageFormatToDataType[S],
    options: TextureCubeMapCreateOptions & TextureCubeMapStoreOptions = {},
): TextureCubeMap<S> {
    const {
        min = TextureMinFilter.NEAREST,
        mag = TextureMagFilter.NEAREST,
        wrapS = TextureWrap.CLAMP_TO_EDGE,
        wrapT = TextureWrap.CLAMP_TO_EDGE,
        wrapR = TextureWrap.CLAMP_TO_EDGE,
    } = options;
    return new TextureCubeMap(
        gl,
        width, height,
        storageFormat,
        wrapS, wrapT, wrapR,
        min, mag,
    ).store(
        dataPositiveX,
        dataNegativeX,
        dataPositiveY,
        dataNegativeY,
        dataPositiveZ,
        dataNegativeZ,
        dataFormat,
        dataType,
        options,
    );
}

/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type. Data can be stored to textures either
 * from the CPU, via the `Texture2D.store()`, or they can be rendered to as
 * `Framebuffer` attachments. Data from textures can read in shaders via
 * sampling.
 */
export class Texture2D<S extends TextureStorageFormat> {

    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;

    readonly glTexture: WebGLTexture | null;

    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        storageFormat: S,
        wrapS: TextureWrap,
        wrapT: TextureWrap,
        minFilter: TextureMinFilter,
        magFilter: TextureMagFilter,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
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
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_2D, glTexture);

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, rowAlignment(this.storageFormat));
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0, // level
            xOffset,
            yOffset,
            width,
            height,
            format,
            type,
            // WebGL bug causes Uint8ClampedArray to be read incorrectly
            // https://github.com/KhronosGroup/WebGL/issues/1533
            data instanceof Uint8ClampedArray
                // Both buffers are u8 -> do not copy, just change lens
                ? new Uint8Array(data.buffer)
                // Other buffer types are fine
                : data,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

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
            storageFormat,
            wrapS,
            wrapT,
            minFilter,
            magFilter,
        } = this;
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texStorage2D(gl.TEXTURE_2D, 1, storageFormat, width, height);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);

        gl.bindTexture(gl.TEXTURE_2D, null);

        (this as any).glTexture = texture;
    }
}

/**
 * Cubemaps consist of 6 different textures conceptually layed out as faces of a
 * cube around origin [0, 0, 0]. Each of the 6 textures in a cubemap has the
 * same dimensions and storage format.
 * In shaders, cubemaps can be sampled using a vec3 interpreted as a direction
 * from origin. This makes cubemaps ideal to implement skyboxes and environment
 * mapping.
 */
export class TextureCubeMap<S extends TextureStorageFormat> {

    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly wrapS: TextureWrap;
    readonly wrapT: TextureWrap;
    readonly wrapR: TextureWrap;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;

    readonly glTexture: WebGLTexture | null;

    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        storageFormat: S,
        wrapS: TextureWrap,
        wrapT: TextureWrap,
        wrapR: TextureWrap,
        minFilter: TextureMinFilter,
        magFilter: TextureMagFilter,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.wrapR = wrapR;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.glTexture = null;

        this.init();
    }

    /**
     * Reinitialize invalid cubemap, eg. after context is lost.
     */
    restore(): void {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) { this.init(); }
    }

    /**
     * Upload new data to cubemap. Does not take ownership of data.
     * The 6 typed arrays must be of the same length.
     */
    store(
        dataPositiveX: StorageFormatToTypedArray[S],
        dataNegativeX: StorageFormatToTypedArray[S],
        dataPositiveY: StorageFormatToTypedArray[S],
        dataNegativeY: StorageFormatToTypedArray[S],
        dataPositiveZ: StorageFormatToTypedArray[S],
        dataNegativeZ: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        assert.is(dataNegativeX.length, dataPositiveX.length);
        assert.is(dataPositiveY.length, dataPositiveX.length);
        assert.is(dataNegativeY.length, dataPositiveX.length);
        assert.is(dataPositiveZ.length, dataPositiveX.length);
        assert.is(dataNegativeZ.length, dataPositiveX.length);

        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            dataPositiveX,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );
        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            dataNegativeX,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );
        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            dataPositiveY,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );
        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            dataNegativeY,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );
        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            dataPositiveZ,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );
        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            dataNegativeZ,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);

        return this;
    }

    /**
     * Upload new data to cubemap's positive X face.
     * Does not take ownership of data.
     */
    storePositiveX(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Upload new data to cubemap's negative X face.
     * Does not take ownership of data.
     */
    storeNegativeX(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Upload new data to cubemap's positive Y face.
     * Does not take ownership of data.
     */
    storePositiveY(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Upload new data to cubemap's negative Y face.
     * Does not take ownership of data.
     */
    storeNegativeY(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Upload new data to cubemap's positive Z face.
     * Does not take ownership of data.
     */
    storePositiveZ(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Upload new data to cubemap's negative Z face.
     * Does not take ownership of data.
     */
    storeNegativeZ(
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        {
            xOffset = 0,
            yOffset = 0,
            width = this.width,
            height = this.height,
            mipmap = false,
        }: Texture2DStoreOptions = {},
    ): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        this.storeFace(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            data,
            format,
            type,
            xOffset,
            yOffset,
            width,
            height,
        );

        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    /**
     * Generate mipmap levels for the current data.
     */
    mipmap(): this {
        const { gl, glTexture } = this;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return this;
    }

    private init(): void {
        const {
            gl,
            width,
            height,
            storageFormat,
            wrapS,
            wrapT,
            wrapR,
            minFilter,
            magFilter,
        } = this;
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        gl.texStorage2D(
            gl.TEXTURE_CUBE_MAP,
            1, // levels
            storageFormat,
            width,
            height,
        );

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, wrapR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, magFilter);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        (this as any).glTexture = texture;
    }

    private storeFace(
        target: number,
        data: StorageFormatToTypedArray[S],
        format: StorageFormatToFormat[S],
        type: StorageFormatToDataType[S],
        xOffset: number,
        yOffset: number,
        width: number,
        height: number,
    ): void {
        const gl = this.gl;
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, rowAlignment(this.storageFormat));
        gl.texSubImage2D(
            target,
            0, // level
            xOffset,
            yOffset,
            width,
            height,
            format,
            type,
            // WebGL bug causes Uint8ClampedArray to be read incorrectly
            // https://github.com/KhronosGroup/WebGL/issues/1533
            data instanceof Uint8ClampedArray
                // Both buffers are u8 -> do not copy, just change lens
                ? new Uint8Array(data.buffer)
                // Other buffer types are fine
                : data,
        );
    }
}

type RowAlignment = 1 | 2 | 4 | 8;

/**
 * OpenGL supports row alignments of 1, 2, 4, or 8. Each storage format consists
 * of a data type and number of channels, e.g. RGB16F has data type size of 2
 * byte and 3 channels.
 * This function finds the greatest possible safe alignment to fit the product
 * of the storage format's data type size and number of channels, e.g. for
 * RGB16F (2 bytes * 3 channels), the greatest safe row alignment is 2.
 */
function rowAlignment(storageFormat: TextureStorageFormat): RowAlignment {
    switch (storageFormat) {
        // RED
        case TextureColorStorageFormat.R8:
        case TextureColorStorageFormat.R8_SNORM:
        case TextureColorStorageFormat.R8UI:
        case TextureColorStorageFormat.R8I:
            return 1;
        case TextureColorStorageFormat.R16UI:
        case TextureColorStorageFormat.R16I:
        case TextureColorStorageFormat.R16F:
            return 2;
        case TextureColorStorageFormat.R32UI:
        case TextureColorStorageFormat.R32I:
        case TextureColorStorageFormat.R32F:
            return 4;

        // RG
        case TextureColorStorageFormat.RG8:
        case TextureColorStorageFormat.RG8_SNORM:
        case TextureColorStorageFormat.RG8UI:
        case TextureColorStorageFormat.RG8I:
            return 2;
        case TextureColorStorageFormat.RG16UI:
        case TextureColorStorageFormat.RG16I:
        case TextureColorStorageFormat.RG16F:
            return 4;
        case TextureColorStorageFormat.RG32UI:
        case TextureColorStorageFormat.RG32I:
        case TextureColorStorageFormat.RG32F:
            return 8;

        // RGB
        case TextureColorStorageFormat.RGB8:
        case TextureColorStorageFormat.RGB8_SNORM:
        case TextureColorStorageFormat.RGB8UI:
        case TextureColorStorageFormat.RGB8I:
            return 1;
        case TextureColorStorageFormat.RGB16UI:
        case TextureColorStorageFormat.RGB16I:
        case TextureColorStorageFormat.RGB16F:
            return 2;
        case TextureColorStorageFormat.RGB32UI:
        case TextureColorStorageFormat.RGB32I:
        case TextureColorStorageFormat.RGB32F:
            return 4;

        // RGBA
        case TextureColorStorageFormat.RGBA8:
        case TextureColorStorageFormat.RGBA8_SNORM:
        case TextureColorStorageFormat.RGBA8UI:
        case TextureColorStorageFormat.RGBA8I:
            return 4;
        case TextureColorStorageFormat.RGBA16UI:
        case TextureColorStorageFormat.RGBA16I:
        case TextureColorStorageFormat.RGBA16F:
            return 8;
        case TextureColorStorageFormat.RGBA32UI:
        case TextureColorStorageFormat.RGBA32I:
        case TextureColorStorageFormat.RGBA32F:
            return 8;

        // DEPTH
        case TextureDepthStorageFormat.DEPTH_COMPONENT16:
            return 2;
        case TextureDepthStorageFormat.DEPTH_COMPONENT24:
            return 1;
        case TextureDepthStorageFormat.DEPTH_COMPONENT32F:
            return 4;

        // DEPTH STEPNCIL
        case TextureDepthStencilStorageFormat.DEPTH24_STENCIL8:
            return 4;
        case TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8:
            // TODO: how is DEPTH32F_STENCUL8 represented in memory?
            return 1;

        default:
            return assert.unreachable(storageFormat);
    }
}
