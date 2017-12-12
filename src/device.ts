import { Framebuffer } from "./framebuffer";

export interface DeviceOptions {
    pixelRatio?: number;
    viewport?: [number, number];
    extensions?: Extension[];
}

export const enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear",
}

export class Device {

    static mount(
        element: HTMLElement = document.body,
        options?: DeviceOptions,
    ): Device {
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        const dev = Device.fromCanvas(canvas, options);
        dev.update();
        return dev;
    }

    static fromCanvas(
        canvas: HTMLCanvasElement,
        options?: DeviceOptions,
    ): Device {
        const gl = canvas.getContext("webgl2");
        if (!gl) { throw new Error("Could not get webgl2 context"); }
        return Device.fromContext(gl, options);
    }

    static fromContext(
        gl: WebGL2RenderingContext,
        {
            pixelRatio,
            viewport,
            extensions,
        }: DeviceOptions = {},
    ): Device {
        if (extensions) {
            extensions.forEach(ext => {
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }

        return new Device(
            gl,
            gl.canvas,
            pixelRatio,
            viewport,
        );
    }

    private constructor(
        readonly gl: WebGL2RenderingContext,
        readonly canvas: HTMLCanvasElement,
        private explicitPixelRatio?: number,
        private explicitViewport?: [number, number],
    ) { }

    get bufferWidth(): number {
        return this.gl.drawingBufferWidth;
    }

    get bufferHeight(): number {
        return this.gl.drawingBufferHeight;
    }

    get canvasWidth(): number {
        return this.canvas.width;
    }

    get canvasHeight(): number {
        return this.canvas.height;
    }

    get canvasCSSWidth(): number {
        return this.canvas.clientWidth;
    }

    get canvasCSSHeight(): number {
        return this.canvas.clientHeight;
    }

    get pixelRatio(): number {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }

    update(): void {
        const dpr = this.pixelRatio;
        const canvas = this.canvas;
        const width = this.explicitViewport
            && this.explicitViewport[0]
            || canvas.clientWidth * dpr;
        const height = this.explicitViewport
            && this.explicitViewport[1]
            || canvas.clientHeight * dpr;
        if (width !== canvas.width) { canvas.width = width; }
        if (height !== canvas.height) { canvas.height = height; }
    }

    clearColor(
        r: number,
        g: number,
        b: number,
        a: number,
        fbo?: Framebuffer,
    ): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    clearDepth(depth: number, fbo?: Framebuffer): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearDepth(depth);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    clearStencil(stencil: number, fbo?: Framebuffer): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearStencil(stencil);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    clear(
        r: number,
        g: number,
        b: number,
        a: number,
        depth: number,
        stencil: number,
        fbo?: Framebuffer,
    ): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }
}
