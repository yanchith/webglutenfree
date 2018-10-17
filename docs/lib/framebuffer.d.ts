import { State } from "./state";
import { Target } from "./target";
import { Texture, TextureColorStorageFormat, TextureDepthStorageFormat, TextureDepthStencilStorageFormat } from "./texture";
export declare function _createFramebuffer(state: State, width: number, height: number, color: Texture<TextureColorStorageFormat> | Texture<TextureColorStorageFormat>[], depthStencil?: Texture<TextureDepthStorageFormat> | Texture<TextureDepthStencilStorageFormat>): Framebuffer;
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
    constructor(state: State, width: number, height: number, colors: Texture<TextureColorStorageFormat>[], depthStencil?: Texture<TextureDepthStorageFormat> | Texture<TextureDepthStencilStorageFormat>);
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