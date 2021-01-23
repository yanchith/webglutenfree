export declare enum RenderbufferColorStorageFormat {
    R8 = 33321,
    R8_SNORM = 36756,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    R16F = 33325,
    R32UI = 33334,
    R32I = 33333,
    R32F = 33326,
    RG8 = 33323,
    RG8_SNORM = 36757,
    RG8UI = 33336,
    RG8I = 33335,
    RG16UI = 33338,
    RG16I = 33337,
    RG16F = 33327,
    RG32UI = 33340,
    RG32I = 33339,
    RG32F = 33328,
    RGBA8 = 32856,
    RGBA8_SNORM = 36759,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA16F = 34842,
    RGBA32UI = 36208,
    RGBA32I = 36226,
    RGBA32F = 34836
}
export declare enum RenderbufferDepthStorageFormat {
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012
}
export declare enum RenderbufferDepthStencilStorageFormat {
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013
}
export declare type RenderbufferStorageFormat = RenderbufferColorStorageFormat | RenderbufferDepthStorageFormat | RenderbufferDepthStencilStorageFormat;
export declare type RenderbufferSamples = 0 | 2 | 4 | 8 | 16;
export interface RenderbufferCreateOptions {
    samples?: RenderbufferSamples;
}
export declare function _createRenderbuffer<S extends RenderbufferStorageFormat>(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, { samples }?: RenderbufferCreateOptions): Renderbuffer<S>;
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
export declare class Renderbuffer<S extends RenderbufferStorageFormat> {
    readonly width: number;
    readonly height: number;
    readonly storageFormat: S;
    readonly samples: RenderbufferSamples;
    readonly glRenderbuffer: WebGLRenderbuffer | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, width: number, height: number, storageFormat: S, samples: RenderbufferSamples);
    restore(): void;
    private init;
}
//# sourceMappingURL=renderbuffer.d.ts.map