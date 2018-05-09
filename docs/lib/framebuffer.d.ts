import { Target } from "./target";
import { TextureInternalFormat } from "./texture";
export declare type Device = import("./device").Device;
export declare type Texture<F> = import("./texture").Texture<F>;
export declare type TextureColorInternalFormat = TextureInternalFormat.R8 | TextureInternalFormat.R8_SNORM | TextureInternalFormat.R8UI | TextureInternalFormat.R8I | TextureInternalFormat.R16UI | TextureInternalFormat.R16I | TextureInternalFormat.R32UI | TextureInternalFormat.R32I | TextureInternalFormat.R16F | TextureInternalFormat.R32F | TextureInternalFormat.RG8 | TextureInternalFormat.RG8_SNORM | TextureInternalFormat.RG8UI | TextureInternalFormat.RG8I | TextureInternalFormat.RG16UI | TextureInternalFormat.RG16I | TextureInternalFormat.RG32UI | TextureInternalFormat.RG32I | TextureInternalFormat.RG16F | TextureInternalFormat.RG32F | TextureInternalFormat.RGB8 | TextureInternalFormat.RGB8_SNORM | TextureInternalFormat.RGB8UI | TextureInternalFormat.RGB8I | TextureInternalFormat.RGB16UI | TextureInternalFormat.RGB16I | TextureInternalFormat.RGB32UI | TextureInternalFormat.RGB32I | TextureInternalFormat.RGB16F | TextureInternalFormat.RGB32F | TextureInternalFormat.RGBA8 | TextureInternalFormat.RGBA8_SNORM | TextureInternalFormat.RGBA8UI | TextureInternalFormat.RGBA8I | TextureInternalFormat.RGBA16UI | TextureInternalFormat.RGBA16I | TextureInternalFormat.RGBA32UI | TextureInternalFormat.RGBA32I | TextureInternalFormat.RGBA16F | TextureInternalFormat.RGBA32F;
export declare type TextureDepthInternalFormat = TextureInternalFormat.DEPTH_COMPONENT16 | TextureInternalFormat.DEPTH_COMPONENT24 | TextureInternalFormat.DEPTH_COMPONENT32F;
export declare type TextureDepthStencilInternalFormat = TextureInternalFormat.DEPTH24_STENCIL8 | TextureInternalFormat.DEPTH32F_STENCIL8;
/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
export declare class Framebuffer {
    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * It is still an error to use the attachments while they are written to
     * via the framebuffer, however.
     */
    static create(dev: Device, width: number, height: number, color: Texture<TextureColorInternalFormat> | Texture<TextureColorInternalFormat>[], depthStencil?: Texture<TextureDepthInternalFormat> | Texture<TextureDepthStencilInternalFormat>): Framebuffer;
    readonly width: number;
    readonly height: number;
    readonly glFramebuffer: WebGLFramebuffer | null;
    private dev;
    private glColorAttachments;
    private framebufferTarget;
    private colors;
    private depthStencil?;
    private constructor();
    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Request a render target from this framebuffer to draw into. The target
     * will contain all attached color buffers.
     *
     * Drawing should be done within the callback by
     * calling `ratget.clear()` or `target.draw()` family of methods.
     *
     * Also see `device.target()`.
     */
    target(cb: (rt: Target) => void): void;
    private init;
}
