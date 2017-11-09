import * as glutil from "./glutil";
import { Texture } from "./texture";

export class Framebuffer {

    static fromTextures(
        gl: WebGL2RenderingContext,
        textures: Texture[],
    ): Framebuffer {
        const fbo = glutil.createFramebuffer(gl, textures.map(t => t.glTexture));

        const attachment = gl.COLOR_ATTACHMENT0;
        return new Framebuffer(
            gl,
            fbo,
            textures.map((_, i) => attachment + i),
            textures[0].width, textures[0].height,
        );
    }

    private constructor(
        private gl: WebGL2RenderingContext,
        readonly fbo: WebGLFramebuffer,
        readonly colorAttachments: number[],
        readonly width: number,
        readonly height: number,
    ) { }

    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    }

    unbind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}
