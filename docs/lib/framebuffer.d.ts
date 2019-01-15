import { State } from "./state";
import { Target } from "./target";
import { Texture2D, TextureColorStorageFormat, TextureDepthStorageFormat, TextureDepthStencilStorageFormat } from "./texture";
import { Renderbuffer, RenderbufferColorStorageFormat, RenderbufferDepthStorageFormat, RenderbufferDepthStencilStorageFormat } from "./renderbuffer";
export declare function _createFramebuffer(state: State, width: number, height: number, color: Texture2D<TextureColorStorageFormat> | Texture2D<TextureColorStorageFormat>[] | Renderbuffer<RenderbufferColorStorageFormat> | Renderbuffer<RenderbufferColorStorageFormat>[], depthStencil?: Texture2D<TextureDepthStorageFormat> | Texture2D<TextureDepthStencilStorageFormat> | Renderbuffer<RenderbufferDepthStorageFormat> | Renderbuffer<RenderbufferDepthStencilStorageFormat>): Framebuffer;
/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
export declare class Framebuffer {
    readonly width: number;
    readonly height: number;
    readonly glFramebuffer: WebGLFramebuffer | null;
    private state;
    private glColorAttachments;
    private framebufferTarget;
    private colors;
    private depthStencil?;
    constructor(state: State, width: number, height: number, colors: Texture2D<TextureColorStorageFormat>[] | Renderbuffer<RenderbufferColorStorageFormat>[], depthStencil?: Texture2D<TextureDepthStorageFormat> | Texture2D<TextureDepthStencilStorageFormat> | Renderbuffer<RenderbufferDepthStorageFormat> | Renderbuffer<RenderbufferDepthStencilStorageFormat>);
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
//# sourceMappingURL=framebuffer.d.ts.map