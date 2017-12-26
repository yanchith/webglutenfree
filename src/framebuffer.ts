import * as assert from "./assert";
import { Device } from "./device";
import { Texture } from "./texture";

export interface FramebufferProps {
    width: number;
    height: number;
    color: Texture | Texture[];
    depth?: Texture;
    stencil?: Texture;
}

export class Framebuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        { width, height, color, depth, stencil }: FramebufferProps,
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colorBuffers = Array.isArray(color) ? color : [color];
        colorBuffers.forEach(buffer => {
            assert.equal(width, buffer.width);
            assert.equal(height, buffer.height);
        });
        if (depth) {
            assert.equal(width, depth.width);
            assert.equal(height, depth.height);
        }
        if (stencil) {
            assert.equal(width, stencil.width);
            assert.equal(height, stencil.height);
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

    readonly glFramebuffer: WebGLFramebuffer | null;
    readonly glColorAttachments: number[];

    private gl: WebGL2RenderingContext;

    private colorBuffers: Texture[];
    private depthBuffer?: Texture;
    private stencilBuffer?: Texture;

    private constructor(
        gl: WebGL2RenderingContext,
        width: number,
        height: number,
        colorBuffers: Texture[],
        depthBuffer?: Texture,
        stencilBuffer?: Texture,
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

        this.init();
    }

    init(): void {
        const { gl, colorBuffers, depthBuffer, stencilBuffer } = this;

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
    }

    restore(): void {
        const { gl, glFramebuffer } = this;
        if (!gl.isFramebuffer(glFramebuffer)) { this.init(); }
    }
}
