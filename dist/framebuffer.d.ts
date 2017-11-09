/// <reference types="webgl2" />
import { Texture } from "./texture";
export declare class Framebuffer {
    private gl;
    readonly fbo: WebGLFramebuffer;
    readonly colorAttachments: number[];
    readonly width: number;
    readonly height: number;
    static fromTextures(gl: WebGL2RenderingContext, textures: Texture[]): Framebuffer;
    private constructor();
    bind(): void;
    unbind(): void;
}
