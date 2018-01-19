import * as assert from "./assert";
import { Device } from "./device";
import { Texture, TextureInternalFormat } from "./texture";
import { Target } from "./target";

export interface FramebufferProps {
    width: number;
    height: number;
    // TODO: more concrete generic types
    color: Texture<TextureInternalFormat> | Texture<TextureInternalFormat>[];
    depth?: Texture<TextureInternalFormat>;
    stencil?: Texture<TextureInternalFormat>;
}

export class Framebuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        { width, height, color, depth, stencil }: FramebufferProps,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colorBuffers = Array.isArray(color) ? color : [color];
        colorBuffers.forEach(buffer => {
            assert.equal(width, buffer.width, "width");
            assert.equal(height, buffer.height, "height");
        });
        if (depth) {
            assert.equal(width, depth.width, "width");
            assert.equal(height, depth.height, "height");
        }
        if (stencil) {
            assert.equal(width, stencil.width, "width");
            assert.equal(height, stencil.height, "height");
        }

        return new Framebuffer(
            gl,
            width,
            height,
            colorBuffers,
            depth,
            stencil,
        );
    }

    readonly width: number;
    readonly height: number;

    private gl: WebGL2RenderingContext;
    private glFramebuffer: WebGLFramebuffer | null;
    private glColorAttachments: number[];

    private framebufferTarget: Target | null;

    private colorBuffers: Texture<TextureInternalFormat>[];
    private depthBuffer?: Texture<TextureInternalFormat>;
    private stencilBuffer?: Texture<TextureInternalFormat>;

    private constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        colorBuffers: Texture<TextureInternalFormat>[],
        depthBuffer?: Texture<TextureInternalFormat>,
        stencilBuffer?: Texture<TextureInternalFormat>,
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.colorBuffers = colorBuffers;
        this.depthBuffer = depthBuffer;
        this.stencilBuffer = stencilBuffer;
        this.glColorAttachments = colorBuffers
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
            colorBuffers,
            depthBuffer,
            stencilBuffer,
        } = this;

        const fbo = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        colorBuffers.forEach((buffer, i) => {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0 + i,
                gl.TEXTURE_2D,
                buffer.glTexture,
                0,
            );
        });

        if (depthBuffer) {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.TEXTURE_2D,
                depthBuffer,
                0,
            );
        }
        if (stencilBuffer) {
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.STENCIL_ATTACHMENT,
                gl.TEXTURE_2D,
                stencilBuffer,
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
            colorBuffers,
            depthBuffer,
            stencilBuffer,
        } = this;
        colorBuffers.forEach(buffer => buffer.restore());
        if (depthBuffer) { depthBuffer.restore(); }
        if (stencilBuffer) { stencilBuffer.restore(); }
        if (!gl.isFramebuffer(glFramebuffer)) { this.init(); }
    }

    target(cb: (rt: Target) => void): void {
        if (this.framebufferTarget) { this.framebufferTarget.with(cb); }
    }
}
