export class Device {

    static createAndMount(element: HTMLElement = document.body): Device {
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.fromCanvas(canvas);
    }

    static fromCanvas(canvas: HTMLCanvasElement): Device {
        const gl = canvas.getContext("webgl2");
        if (!gl) { throw new Error("Could not acquire webgl2 context"); }
        const dpr = window.devicePixelRatio;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        return Device.fromContext(gl);
    }

    static fromContext(gl: WebGL2RenderingContext): Device {
        return new Device(gl);
    }

    private constructor(
        readonly gl: WebGL2RenderingContext,
    ) {}

    get bufferWidth(): number {
        return this.gl.drawingBufferWidth;
    }

    get bufferHeight(): number {
        return this.gl.drawingBufferHeight;
    }

    get canvasWidth(): number {
        return this.gl.canvas.width;
    }

    get canvasHeight(): number {
        return this.gl.canvas.height;
    }

    updateCanvas(): void {
        const gl = this.gl;
        const dpr = window.devicePixelRatio;
        const width = gl.canvas.clientWidth * dpr;
        const height = gl.canvas.clientHeight * dpr;
        if (width !== gl.canvas.clientWidth || height !== gl.canvas.clientHeight) {
            gl.canvas.width = width;
            gl.canvas.height = height;
        }
    }
}
