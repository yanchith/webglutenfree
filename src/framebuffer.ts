import * as glutil from "./glutil";
import { Device } from "./device";
import { Texture } from "./texture";

export class Framebuffer {

    static fromTextures(
        dev: WebGL2RenderingContext | Device,
        textures: Texture[],
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
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
        readonly glFramebuffer: WebGLFramebuffer,
        readonly colorAttachments: number[],
        readonly width: number,
        readonly height: number,
    ) { }

    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFramebuffer);
    }

    unbind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}
