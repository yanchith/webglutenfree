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

        const fbo = gl.createFramebuffer();
        if (!fbo) { throw new Error("Could not create framebuffer"); }

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        const colorBuffers = Array.isArray(color) ? color : [color];
        colorBuffers.forEach((buffer, i) => {
            assert.equal(width, buffer.width);
            assert.equal(height, buffer.height);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0 + i,
                gl.TEXTURE_2D,
                buffer.glTexture,
                0,
            );
        });

        if (depth) {
            assert.equal(width, depth.width);
            assert.equal(height, depth.height);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.TEXTURE_2D,
                depth,
                0,
            );
        }
        if (stencil) {
            assert.equal(width, stencil.width);
            assert.equal(height, stencil.height);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.STENCIL_ATTACHMENT,
                gl.TEXTURE_2D,
                stencil,
                0,
            );
        }

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.deleteFramebuffer(fbo);
            throw new Error("Framebuffer not complete");
        }

        return new Framebuffer(
            fbo,
            width,
            height,
            colorBuffers.map((_, i) => gl.COLOR_ATTACHMENT0 + i),
        );
    }

    private constructor(
        readonly glFramebuffer: WebGLFramebuffer,
        readonly width: number,
        readonly height: number,
        readonly glColorAttachments: number[],
    ) { }
}
