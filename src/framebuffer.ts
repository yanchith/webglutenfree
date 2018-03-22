import * as assert from "./util/assert";
import { Device as _Device } from "./device";
import { Target } from "./target";
import {
    Texture as _Texture,
    TextureInternalFormat as Fmt,
    TextureColorInternalFormat as ColorFmt,
    TextureDepthInternalFormat as DepthFmt,
    TextureDepthStencilInternalFormat as DepthStencilFmt,
} from "./texture";

export class Framebuffer {

    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     */
    static create(
        dev: _Device,
        width: number,
        height: number,
        color: _Texture<ColorFmt> | _Texture<ColorFmt>[],
        depthStencil?: _Texture<DepthFmt> | _Texture<DepthStencilFmt>,
    ): Framebuffer {
        const colors = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colors, "color");
        colors.forEach(buffer => {
            assert.equal(width, buffer.width, "width");
            assert.equal(height, buffer.height, "height");
        });

        if (depthStencil) {
            assert.equal(width, depthStencil.width, "width");
            assert.equal(height, depthStencil.height, "height");
        }

        return new Framebuffer(dev, width, height, colors, depthStencil);
    }

    readonly width: number;
    readonly height: number;

    readonly glFramebuffer: WebGLFramebuffer | null;

    private dev: _Device;
    private glColorAttachments: number[];

    private framebufferTarget: Target | null;

    private colors: _Texture<ColorFmt>[];
    private depthStencil?: _Texture<DepthFmt> | _Texture<DepthStencilFmt>;

    constructor(
        dev: _Device,
        width: number,
        height: number,
        colors: _Texture<ColorFmt>[],
        depthStencil?: _Texture<DepthFmt> | _Texture<DepthStencilFmt>,
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
        colors.forEach(buffer => buffer.restore());
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
                case Fmt.DEPTH24_STENCIL8:
                case Fmt.DEPTH32F_STENCIL8:
                    _gl.framebufferTexture2D(
                        _gl.DRAW_FRAMEBUFFER,
                        _gl.DEPTH_STENCIL_ATTACHMENT,
                        _gl.TEXTURE_2D,
                        depthStencil.glTexture,
                        0,
                    );
                    break;
                case Fmt.DEPTH_COMPONENT16:
                case Fmt.DEPTH_COMPONENT24:
                case Fmt.DEPTH_COMPONENT32F:
                    _gl.framebufferTexture2D(
                        _gl.DRAW_FRAMEBUFFER,
                        _gl.DEPTH_ATTACHMENT,
                        _gl.TEXTURE_2D,
                        depthStencil.glTexture,
                        0,
                    );
                    break;
                default: assert.never(depthStencil, "Unsupported attachment");
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
