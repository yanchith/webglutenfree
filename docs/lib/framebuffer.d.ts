import { Device as _Device } from "./device";
import { Target } from "./target";
import { Texture as _Texture, TextureColorInternalFormat as ColorFmt, TextureDepthInternalFormat as DepthFmt, TextureDepthStencilInternalFormat as DepthStencilFmt } from "./texture";
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
    static create(dev: _Device, width: number, height: number, color: _Texture<ColorFmt> | _Texture<ColorFmt>[], depthStencil?: _Texture<DepthFmt> | _Texture<DepthStencilFmt>): Framebuffer;
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
    private init();
}
