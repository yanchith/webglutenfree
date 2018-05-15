import * as assert from "./util/assert";
import { InternalFormat } from "./types";
import { Target } from "./target";

export type Device = import ("./device").Device;
export type Texture<F> = import ("./texture").Texture<F>;

export type TextureColorInternalFormat =

    // RED
    | InternalFormat.R8
    | InternalFormat.R8_SNORM
    | InternalFormat.R8UI
    | InternalFormat.R8I
    | InternalFormat.R16UI
    | InternalFormat.R16I
    | InternalFormat.R32UI
    | InternalFormat.R32I
    | InternalFormat.R16F
    | InternalFormat.R32F

    // RG
    | InternalFormat.RG8
    | InternalFormat.RG8_SNORM
    | InternalFormat.RG8UI
    | InternalFormat.RG8I
    | InternalFormat.RG16UI
    | InternalFormat.RG16I
    | InternalFormat.RG32UI
    | InternalFormat.RG32I
    | InternalFormat.RG16F
    | InternalFormat.RG32F

    // RGB
    | InternalFormat.RGB8
    | InternalFormat.RGB8_SNORM
    | InternalFormat.RGB8UI
    | InternalFormat.RGB8I
    | InternalFormat.RGB16UI
    | InternalFormat.RGB16I
    | InternalFormat.RGB32UI
    | InternalFormat.RGB32I
    | InternalFormat.RGB16F
    | InternalFormat.RGB32F

    // RGBA
    | InternalFormat.RGBA8
    | InternalFormat.RGBA8_SNORM
    | InternalFormat.RGBA8UI
    | InternalFormat.RGBA8I
    | InternalFormat.RGBA16UI
    | InternalFormat.RGBA16I
    | InternalFormat.RGBA32UI
    | InternalFormat.RGBA32I
    | InternalFormat.RGBA16F
    | InternalFormat.RGBA32F
    ;

export type TextureDepthInternalFormat =
    | InternalFormat.DEPTH_COMPONENT16
    | InternalFormat.DEPTH_COMPONENT24
    | InternalFormat.DEPTH_COMPONENT32F
    ;

export type TextureDepthStencilInternalFormat =
    | InternalFormat.DEPTH24_STENCIL8
    | InternalFormat.DEPTH32F_STENCIL8
    ;

/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
export class Framebuffer {

    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * It is still an error to use the attachments while they are written to
     * via the framebuffer, however.
     */
    static create(
        dev: Device,
        width: number,
        height: number,
        color:
            | Texture<TextureColorInternalFormat>
            | Texture<TextureColorInternalFormat>[],
        depthStencil?:
            | Texture<TextureDepthInternalFormat>
            | Texture<TextureDepthStencilInternalFormat>,
    ): Framebuffer {
        const colors = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colors, () => {
            return "Framebuffer color attachments must not be empty";
        });
        colors.forEach((buffer) => {
            assert.equal(width, buffer.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.equal(height, buffer.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        });

        if (depthStencil) {
            assert.equal(width, depthStencil.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            assert.equal(height, depthStencil.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }

        return new Framebuffer(dev, width, height, colors, depthStencil);
    }

    readonly width: number;
    readonly height: number;

    readonly glFramebuffer: WebGLFramebuffer | null;

    private dev: Device;
    private glColorAttachments: number[];

    private framebufferTarget: Target | null;

    private colors: Texture<TextureColorInternalFormat>[];
    private depthStencil?: Texture<TextureDepthInternalFormat> | Texture<TextureDepthStencilInternalFormat>;

    private constructor(
        dev: Device,
        width: number,
        height: number,
        colors: Texture<TextureColorInternalFormat>[],
        depthStencil?: Texture<TextureDepthInternalFormat> | Texture<TextureDepthStencilInternalFormat>,
    ) {
        this.dev = dev;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.depthStencil = depthStencil;
        this.glColorAttachments = colors
            .map((_, i) => dev._gl.COLOR_ATTACHMENT0 + i);
        this.glFramebuffer = null;
        this.framebufferTarget = null;

        this.init();
    }

    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore(): void {
        const {
            dev: { _gl },
            glFramebuffer,
            colors,
            depthStencil,
        } = this;
        colors.forEach((buffer) => buffer.restore());
        if (depthStencil) { depthStencil.restore(); }
        if (!_gl.isFramebuffer(glFramebuffer)) { this.init(); }
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
            dev,
            dev: { _gl, _stackDrawFramebuffer },
            glColorAttachments,
            colors,
            depthStencil,
        } = this;

        const fbo = _gl.createFramebuffer();

        _stackDrawFramebuffer.push(fbo);

        colors.forEach((buffer, i) => {
            _gl.framebufferTexture2D(
                _gl.DRAW_FRAMEBUFFER,
                _gl.COLOR_ATTACHMENT0 + i,
                _gl.TEXTURE_2D,
                buffer.glTexture,
                0,
            );
        });

        if (depthStencil) {
            switch (depthStencil.format) {
                case InternalFormat.DEPTH24_STENCIL8:
                case InternalFormat.DEPTH32F_STENCIL8:
                    _gl.framebufferTexture2D(
                        _gl.DRAW_FRAMEBUFFER,
                        _gl.DEPTH_STENCIL_ATTACHMENT,
                        _gl.TEXTURE_2D,
                        depthStencil.glTexture,
                        0,
                    );
                    break;
                case InternalFormat.DEPTH_COMPONENT16:
                case InternalFormat.DEPTH_COMPONENT24:
                case InternalFormat.DEPTH_COMPONENT32F:
                    _gl.framebufferTexture2D(
                        _gl.DRAW_FRAMEBUFFER,
                        _gl.DEPTH_ATTACHMENT,
                        _gl.TEXTURE_2D,
                        depthStencil.glTexture,
                        0,
                    );
                    break;
                default: assert.never(depthStencil, (p) => {
                    return `Unsupported attachment: ${p}`;
                });
            }
        }

        const status = _gl.checkFramebufferStatus(_gl.DRAW_FRAMEBUFFER);

        _stackDrawFramebuffer.pop();

        if (status !== _gl.FRAMEBUFFER_COMPLETE) {
            _gl.deleteFramebuffer(fbo);
            switch (status) {
                case _gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                case _gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                case _gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                case _gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                case _gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("FRAMEBUFFER_UNSUPPORTED");
                default: throw new Error("Framebuffer incomplete");
            }
        }

        (this as any).glFramebuffer = fbo;

        if (fbo) {
            this.framebufferTarget = new Target(
                dev,
                glColorAttachments,
                fbo,
                width,
                height,
            );
        }
    }
}
