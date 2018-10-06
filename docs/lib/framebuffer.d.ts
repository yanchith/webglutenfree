import { InternalFormat } from "./types";
import { State } from "./state";
import { Target } from "./target";
export declare type Texture<F> = import("./texture").Texture<F>;
export declare type TextureColorInternalFormat = InternalFormat.R8 | InternalFormat.R8_SNORM | InternalFormat.R8UI | InternalFormat.R8I | InternalFormat.R16UI | InternalFormat.R16I | InternalFormat.R32UI | InternalFormat.R32I | InternalFormat.R16F | InternalFormat.R32F | InternalFormat.RG8 | InternalFormat.RG8_SNORM | InternalFormat.RG8UI | InternalFormat.RG8I | InternalFormat.RG16UI | InternalFormat.RG16I | InternalFormat.RG32UI | InternalFormat.RG32I | InternalFormat.RG16F | InternalFormat.RG32F | InternalFormat.RGB8 | InternalFormat.RGB8_SNORM | InternalFormat.RGB8UI | InternalFormat.RGB8I | InternalFormat.RGB16UI | InternalFormat.RGB16I | InternalFormat.RGB32UI | InternalFormat.RGB32I | InternalFormat.RGB16F | InternalFormat.RGB32F | InternalFormat.RGBA8 | InternalFormat.RGBA8_SNORM | InternalFormat.RGBA8UI | InternalFormat.RGBA8I | InternalFormat.RGBA16UI | InternalFormat.RGBA16I | InternalFormat.RGBA32UI | InternalFormat.RGBA32I | InternalFormat.RGBA16F | InternalFormat.RGBA32F;
export declare type TextureDepthInternalFormat = InternalFormat.DEPTH_COMPONENT16 | InternalFormat.DEPTH_COMPONENT24 | InternalFormat.DEPTH_COMPONENT32F;
export declare type TextureDepthStencilInternalFormat = InternalFormat.DEPTH24_STENCIL8 | InternalFormat.DEPTH32F_STENCIL8;
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
    constructor(state: State, width: number, height: number, colors: Texture<TextureColorInternalFormat>[], depthStencil?: Texture<TextureDepthInternalFormat> | Texture<TextureDepthStencilInternalFormat>);
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