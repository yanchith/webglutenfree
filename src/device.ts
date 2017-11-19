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

    get width(): number {
        return this.gl.drawingBufferWidth;
    }

    get height(): number {
        return this.gl.drawingBufferHeight;
    }

}
