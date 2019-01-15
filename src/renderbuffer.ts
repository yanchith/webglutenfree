export enum RenderbufferColorStorageFormat {
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
}

export enum RenderbufferDepthStorageFormat {
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
}

export enum RenderbufferDepthStencilStorageFormat {
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
}

export type RenderbufferStorageFormat =
    | RenderbufferColorStorageFormat
    | RenderbufferDepthStorageFormat
    | RenderbufferDepthStencilStorageFormat
    ;

export type RenderbufferSamples = 0 | 2 | 4 | 8 | 16;

export interface RenderbufferCreateOptions {
    samples?: RenderbufferSamples;
}

export function _createRenderbuffer<S extends RenderbufferStorageFormat>(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    storageFormat: S,
    { samples = 0 }: RenderbufferCreateOptions = {},
): Renderbuffer<S> {
    return new Renderbuffer(gl, width, height, storageFormat, samples);
}

/**
 * Renderbuffers are images of 2D data, similar to `Texture2D`. In contrast to
 * `Texture2D`, `Renderbuffer`s can only be written to on the GPU via rendering,
 * and they can not be sampled in shaders. `Framebuffer`s containing
 * `Renderbuffer` attachments can still be blit to other framebuffers.
 *
 * These limitations and the fact that their storage format is always optimized
 * for rendering should result in a performance improvement when rendering to
 * `Renderbuffer` attachments instead of `Texture2D`.
 *
 * One other difference compared to `Texture2D` is that `Renderbuffer`s can be
 * multisampled. If you need to combine multisampling with post processing, you
 * can first render the scene into a multisampled `Renderbuffer` attachment, and
 * afterwards blit it to a `Framebuffer` containing `Texture2D` attachments.
 */
export class Renderbuffer<S extends RenderbufferStorageFormat> {

    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly samples: RenderbufferSamples;

    readonly glRenderbuffer: WebGLRenderbuffer | null;

    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        storageFormat: S,
        samples: RenderbufferSamples,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
        this.samples = samples;
        this.glRenderbuffer = null;

        this.init();
    }

    restore(): void {
        const { gl, glRenderbuffer } = this;
        if (!gl.isRenderbuffer(glRenderbuffer)) { this.init(); }
    }

    private init(): void {
        const { gl, width, height, storageFormat, samples } = this;

        const renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

        if (samples) {
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                samples,
                storageFormat,
                width,
                height,
            );
        } else {
            gl.renderbufferStorage(gl.RENDERBUFFER, storageFormat, width, height);
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        (this as any).glRenderbuffer = renderbuffer;
    }
}
