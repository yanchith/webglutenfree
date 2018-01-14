import { Framebuffer } from "./framebuffer";

export interface DeviceOptions {
    pixelRatio?: number;
    viewport?: [number, number];
    context?: {
        antialias?: boolean,
        alpha?: boolean;
        depth?: boolean;
        stencil?: boolean;
        preserveDrawingBuffer?: boolean;
    };
    extensions?: Extension[];
}

/**
 * Available extensions.
 */
export enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear",
}

export class Device {

    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static mount(
        element: HTMLElement = document.body,
        options?: DeviceOptions,
    ): Device {
        if (element instanceof HTMLCanvasElement) {
            return Device.fromCanvas(element, options);
        }

        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.fromCanvas(canvas, options);
    }

    /**
     * Create a new device (containing a gl context) from existing canvas.
     */
    static fromCanvas(
        canvas: HTMLCanvasElement,
        options: DeviceOptions = {},
    ): Device {
        const {
            antialias = true,
            alpha = true,
            depth = true,
            stencil = true,
            preserveDrawingBuffer = false,
        } = options.context || {};
        const gl = canvas.getContext("webgl2", {
            antialias,
            alpha,
            depth,
            stencil,
            preserveDrawingBuffer,
        });
        if (!gl) { throw new Error("Could not get webgl2 context"); }
        return Device.fromContext(gl, options);
    }

    /**
     * Create a new device from existing gl context.
     */
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

        const dev = new Device(
            gl,
            gl.canvas,
            pixelRatio,
            viewport,
        );
        dev.update();
        return dev;
    }

    private constructor(
        readonly gl: WebGL2RenderingContext,
        readonly canvas: HTMLCanvasElement,
        private explicitPixelRatio?: number,
        private explicitViewport?: [number, number],
    ) { }

    /**
     * Return width of the gl drawing buffer.
     */
    get bufferWidth(): number {
        return this.gl.drawingBufferWidth;
    }

    /**
     * Return height of the gl drawing buffer.
     */
    get bufferHeight(): number {
        return this.gl.drawingBufferHeight;
    }

    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    get canvasWidth(): number {
        return this.canvas.width;
    }

    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    get canvasHeight(): number {
        return this.canvas.height;
    }

    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSWidth(): number {
        return this.canvas.clientWidth;
    }

    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSHeight(): number {
        return this.canvas.clientHeight;
    }

    /**
     * Return the device pixel ratio for this device
     */
    get pixelRatio(): number {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }

    /**
     * Notify the device to check whether updates are needed. This resizes the
     * canvas, if the device pixel ratio or css canvas width/height changed.
     */
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

    /**
     * Clear the color buffer to provided color. Optionally, clear color buffers
     * attached to a framebuffer instead.
     */
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

    /**
     * Clear the depth buffer to provided depth. Optionally, clear depth buffer
     * attached to a framebuffer instead.
     */
    clearDepth(depth: number, fbo?: Framebuffer): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearDepth(depth);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    /**
     * Clear the stencil buffer to provided stencil. Optionally, clear stencil
     * buffer attached to a framebuffer instead.
     */
    clearStencil(stencil: number, fbo?: Framebuffer): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearStencil(stencil);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    /**
     * Clear the color buffers and depth buffer to provided color and depth.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearDepth()
     */
    clearColorAndDepth(
        r: number,
        g: number,
        b: number,
        a: number,
        depth: number,
        fbo?: Framebuffer,
    ): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    /**
     * Clear the depth buffer and stencil buffer to provided depth and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearDepth()
     *   device.clearStencil()
     */
    clearDepthAndStencil(
        depth: number,
        stencil: number,
        fbo?: Framebuffer,
    ): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    /**
     * Clear the color buffers and stencil buffer to provided color and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearStencil()
     */
    clearColorAndStencil(
        r: number,
        g: number,
        b: number,
        a: number,
        stencil: number,
        fbo?: Framebuffer,
    ): void {
        const gl = this.gl;
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer); }
        gl.clearColor(r, g, b, a);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    }

    /**
     * Clear the color buffers, depth buffer and stencil buffer to provided
     * color, depth and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearDepth()
     *   device.clearStencil()
     */
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
