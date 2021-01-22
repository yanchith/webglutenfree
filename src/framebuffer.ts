import * as assert from "./util/assert";
import { IS_DEBUG_BUILD } from "./util/env";
import { State } from "./state";
import { Target } from "./target";
import {
    Texture2D,
    TextureColorStorageFormat,
    TextureDepthStorageFormat,
    TextureDepthStencilStorageFormat,
} from "./texture";
import {
    Renderbuffer,
    RenderbufferColorStorageFormat,
    RenderbufferDepthStorageFormat,
    RenderbufferDepthStencilStorageFormat,
} from "./renderbuffer";

export function _createFramebuffer(
    state: State,
    width: number,
    height: number,
    color:
        | Texture2D<TextureColorStorageFormat>
        | Texture2D<TextureColorStorageFormat>[]
        | Renderbuffer<RenderbufferColorStorageFormat>
        | Renderbuffer<RenderbufferColorStorageFormat>[],
    depthStencil?:
        | Texture2D<TextureDepthStorageFormat>
        | Texture2D<TextureDepthStencilStorageFormat>
        | Renderbuffer<RenderbufferDepthStorageFormat>
        | Renderbuffer<RenderbufferDepthStencilStorageFormat>,
): Framebuffer {
    type Colors =
        | Texture2D<TextureColorStorageFormat>[]
        | Renderbuffer<RenderbufferColorStorageFormat>[]
        ;
    const colors = (Array.isArray(color) ? color : [color]) as Colors;
    if (IS_DEBUG_BUILD) {
        assert.isNotEmpty(colors, () => {
            return "Framebuffer color attachments must not be empty";
        });

        for (const buffer of colors) {
            assert.is(width, buffer.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.is(height, buffer.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }

        if (depthStencil) {
            assert.is(width, depthStencil.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.is(height, depthStencil.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }
    }

    return new Framebuffer(state, width, height, colors, depthStencil);
}

// TODO: _createFramebufferWithCubeMapFace

/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
export class Framebuffer {

    readonly width: number;
    readonly height: number;

    readonly glFramebuffer: WebGLFramebuffer | null;

    private state: State;
    private glColorAttachments: number[];

    private framebufferTarget: Target | null;

    private colors:
        | Texture2D<TextureColorStorageFormat>[]
        | Renderbuffer<RenderbufferColorStorageFormat>[]
        ;
    private depthStencil?:
        | Texture2D<TextureDepthStorageFormat>
        | Texture2D<TextureDepthStencilStorageFormat>
        | Renderbuffer<RenderbufferDepthStorageFormat>
        | Renderbuffer<RenderbufferDepthStencilStorageFormat>
        ;

    constructor(
        state: State,
        width: number,
        height: number,
        colors:
            | Texture2D<TextureColorStorageFormat>[]
            | Renderbuffer<RenderbufferColorStorageFormat>[],
        depthStencil?:
            | Texture2D<TextureDepthStorageFormat>
            | Texture2D<TextureDepthStencilStorageFormat>
            | Renderbuffer<RenderbufferDepthStorageFormat>
            | Renderbuffer<RenderbufferDepthStencilStorageFormat>,
    ) {
        this.state = state;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.depthStencil = depthStencil;
        this.glColorAttachments = new Array(colors.length);
        for (let i = 0; i < colors.length; ++i) {
            this.glColorAttachments[i] = state.gl.COLOR_ATTACHMENT0 + i;
        }
        this.glFramebuffer = null;
        this.framebufferTarget = null;

        this.init();
    }

    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore(): void {
        const {
            state: { gl },
            glFramebuffer,
            colors,
            depthStencil,
        } = this;
        for (const buffer of colors) {
            buffer.restore();
        }
        if (depthStencil) { depthStencil.restore(); }
        if (!gl.isFramebuffer(glFramebuffer)) { this.init(); }
    }

    /**
     * Request a render target from this framebuffer to draw into. The target
     * will contain all attached color buffers.
     *
     * Drawing should be done within the callback by
     * calling `ratget.clear()` or `target.draw()` family of methods.
     *
     * Also see `device.target()`.
     */
    target(cb: (rt: Target) => void): void {
        if (this.framebufferTarget) { this.framebufferTarget.with(cb); }
    }

    private init(): void {
        const {
            width,
            height,
            state,
            state: { gl },
            glColorAttachments,
            colors,
            depthStencil,
        } = this;

        // `init()` would overwrite and unbind the currently bound
        // `Target`'s FBO, so assert against it.
        // (`gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)` is called
        // at the end of `init()`).
        assert.isTrue(
            state.isTargetUnlocked(),
            "Expected Target to be unlocked when performing Framebuffer init (would overwrite)",
        );

        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);

        for (let i = 0; i < colors.length; ++i) {
            const buffer = colors[i]!;
            if (buffer instanceof Renderbuffer) {
                gl.framebufferRenderbuffer(
                    gl.DRAW_FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0 + i,
                    gl.RENDERBUFFER,
                    buffer.glRenderbuffer,
                );
            } else {
                gl.framebufferTexture2D(
                    gl.DRAW_FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0 + i,
                    gl.TEXTURE_2D,
                    buffer.glTexture,
                    0,
                );
            }
        }

        if (depthStencil) {
            if (depthStencil instanceof Renderbuffer) {
                switch (depthStencil.storageFormat) {
                    case RenderbufferDepthStencilStorageFormat.DEPTH24_STENCIL8:
                    case RenderbufferDepthStencilStorageFormat.DEPTH32F_STENCIL8:
                        gl.framebufferRenderbuffer(
                            gl.DRAW_FRAMEBUFFER,
                            gl.DEPTH_STENCIL_ATTACHMENT,
                            gl.RENDERBUFFER,
                            depthStencil.glRenderbuffer,
                        );
                        break;
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT16:
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT24:
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT32F:
                        gl.framebufferRenderbuffer(
                            gl.DRAW_FRAMEBUFFER,
                            gl.DEPTH_ATTACHMENT,
                            gl.RENDERBUFFER,
                            depthStencil.glRenderbuffer,
                        );
                        break;
                    default: assert.unreachable(depthStencil, (p) => {
                        return `Unsupported framebuffer renderbuffer attachment: ${p}`;
                    });
                }
            } else {
                switch (depthStencil.storageFormat) {
                    case TextureDepthStencilStorageFormat.DEPTH24_STENCIL8:
                    case TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8:
                        gl.framebufferTexture2D(
                            gl.DRAW_FRAMEBUFFER,
                            gl.DEPTH_STENCIL_ATTACHMENT,
                            gl.TEXTURE_2D,
                            depthStencil.glTexture,
                            0,
                        );
                        break;
                    case TextureDepthStorageFormat.DEPTH_COMPONENT16:
                    case TextureDepthStorageFormat.DEPTH_COMPONENT24:
                    case TextureDepthStorageFormat.DEPTH_COMPONENT32F:
                        gl.framebufferTexture2D(
                            gl.DRAW_FRAMEBUFFER,
                            gl.DEPTH_ATTACHMENT,
                            gl.TEXTURE_2D,
                            depthStencil.glTexture,
                            0,
                        );
                        break;
                    default: assert.unreachable(depthStencil, (p) => {
                        return `Unsupported framebuffer texture attachment: ${p}`;
                    });
                }
            }
        }

        const status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.deleteFramebuffer(fbo);
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("FRAMEBUFFER_UNSUPPORTED");
                default: throw new Error("Framebuffer incomplete");
            }
        }

        (this as any).glFramebuffer = fbo;

        if (fbo) {
            this.framebufferTarget = new Target(
                state,
                glColorAttachments,
                fbo,
                width,
                height,
            );
        }
    }
}
