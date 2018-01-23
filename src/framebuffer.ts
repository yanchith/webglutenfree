import * as assert from "./assert";
import { Device, Target } from "./device";
import {
    Texture,
    TextureColorInternalFormat as ColorFormat,
    TextureDepthInternalFormat as DepthFormat,
    TextureDepthStencilInternalFormat as DepthStencilFormat,
} from "./texture";

export class Framebuffer {

    static fromColor(
        dev: Device,
        width: number,
        height: number,
        color: Texture<ColorFormat> | Texture<ColorFormat>[],
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colors = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colors, "color");
        colors.forEach(buffer => {
            assert.equal(width, buffer.width, "width");
            assert.equal(height, buffer.height, "height");
        });

        return new Framebuffer(gl, width, height, colors);
    }

    static fromDepth(
        dev: Device,
        width: number,
        height: number,
        depth: Texture<DepthFormat>,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        assert.equal(width, depth.width, "width");
        assert.equal(height, depth.height, "height");
        return new Framebuffer(gl, width, height, [], depth, true);
    }

    static fromDepthStencil(
        dev: Device,
        width: number,
        height: number,
        depthStencil: Texture<DepthStencilFormat>,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        assert.equal(width, depthStencil.width, "width");
        assert.equal(height, depthStencil.height, "height");
        return new Framebuffer(gl, width, height, [], depthStencil, false);
    }

    static fromColorDepth(
        dev: Device,
        width: number,
        height: number,
        color: Texture<ColorFormat> | Texture<ColorFormat>[],
        depth: Texture<DepthFormat>,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colorBuffers = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colorBuffers, "color");
        colorBuffers.forEach(buffer => {
            assert.equal(width, buffer.width, "width");
            assert.equal(height, buffer.height, "height");
        });
        assert.equal(width, depth.width, "width");
        assert.equal(height, depth.height, "height");

        return new Framebuffer(gl, width, height, colorBuffers, depth, true);
    }

    static fromColorDepthStencil(
        dev: Device,
        width: number,
        height: number,
        color: Texture<ColorFormat> | Texture<ColorFormat>[],
        depthStencil: Texture<DepthStencilFormat>,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colors = Array.isArray(color) ? color : [color];
        assert.nonEmpty(colors, "color");
        colors.forEach(buffer => {
            assert.equal(width, buffer.width, "width");
            assert.equal(height, buffer.height, "height");
        });
        assert.equal(width, depthStencil.width, "width");
        assert.equal(height, depthStencil.height, "height");

        return new Framebuffer(gl, width, height, colors, depthStencil, false);
    }


    readonly width: number;
    readonly height: number;

    private gl: WebGL2RenderingContext;
    private glFramebuffer: WebGLFramebuffer | null;
    private glColorAttachments: number[];

    private framebufferTarget: Target | null;

    private colors: Texture<ColorFormat>[];
    private depthStencil?: Texture<DepthFormat> | Texture<DepthStencilFormat>;
    private depthOnly: boolean;

    private constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        colors: Texture<ColorFormat>[],
        depthStencil?: Texture<DepthFormat> | Texture<DepthStencilFormat>,
        depthOnly: boolean = true,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.depthStencil = depthStencil;
        this.depthOnly = depthOnly;
        this.glColorAttachments = colors
            .map((_, i) => gl.COLOR_ATTACHMENT0 + i);
        this.glFramebuffer = null;
        this.framebufferTarget = null;

        this.init();
    }

    init(): void {
        const {
            width,
            height,
            gl,
            glColorAttachments,
            colors,
            depthStencil,
            depthOnly,
        } = this;

        const fbo = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        colors.forEach((buffer, i) => {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0 + i,
                gl.TEXTURE_2D,
                buffer.glTexture,
                0,
            );
        });

        if (depthStencil) {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                depthOnly ? gl.DEPTH_ATTACHMENT : gl.DEPTH_STENCIL_ATTACHMENT,
                gl.TEXTURE_2D,
                depthStencil,
                0,
            );
        }

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.deleteFramebuffer(fbo);
            throw new Error("Framebuffer not complete");
        }

        (this as any).glFramebuffer = fbo;

        if (fbo) {
            this.framebufferTarget = new Target(
                gl,
                glColorAttachments,
                fbo,
                width,
                height,
            );
        }
    }

    restore(): void {
        const {
            gl,
            glFramebuffer,
            colors,
            depthStencil,
        } = this;
        colors.forEach(buffer => buffer.restore());
        if (depthStencil) { depthStencil.restore(); }
        if (!gl.isFramebuffer(glFramebuffer)) { this.init(); }
    }

    target(cb: (rt: Target) => void): void {
        if (this.framebufferTarget) { this.framebufferTarget.with(cb); }
    }
}
