import * as glutil from "./glutil";
import { Device } from "./device";
import { Texture } from "./texture";

export class Framebuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        textures: Texture[],
    ): Framebuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const fbo = glutil.createFramebuffer(gl, textures.map(t => t.glTexture));
        const [width, height] = textures.reduce((accum, curr) => {
            const [w, h] = accum;
            return [Math.min(w, curr.width), Math.min(h, curr.height)];
        }, [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
        return new Framebuffer(
            fbo,
            textures.map((_, i) => gl.COLOR_ATTACHMENT0 + i),
            width,
            height,
        );
    }

    private constructor(
        readonly glFramebuffer: WebGLFramebuffer,
        readonly glColorAttachments: number[],
        readonly width: number,
        readonly height: number,
    ) { }
}
