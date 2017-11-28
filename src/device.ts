// Temporary, until available in typings
export type EXTColorBufferFloat = object;

export interface DeviceOptions {
    enableEXTColorBufferFloat?: boolean;
    enableOESTextureFloatLinear?: boolean;
}

export class Device {

    static mount(
        element: HTMLElement = document.body,
        options?: DeviceOptions,
    ): Device {
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        const dpr = window.devicePixelRatio;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        return Device.fromCanvas(canvas, options);
    }

    static fromCanvas(
        canvas: HTMLCanvasElement,
        options?: DeviceOptions,
    ): Device {
        const gl = canvas.getContext("webgl2");
        if (!gl) { throw new Error("Could not acquire webgl2 context"); }
        return Device.fromContext(gl, options);
    }

    static fromContext(
        gl: WebGL2RenderingContext,
        {
            enableEXTColorBufferFloat = false,
            enableOESTextureFloatLinear = false,
        }: DeviceOptions = {},
    ): Device {
        const extColorBufferFloat = enableEXTColorBufferFloat
            ? gl.getExtension("EXT_color_buffer_float")
            : undefined;
        if (enableEXTColorBufferFloat && !extColorBufferFloat) {
            throw new Error("Could not acquire extension: EXT_color_buffer_float");
        }

        const oesTextureFloatLinear = enableOESTextureFloatLinear
            ? gl.getExtension("OES_texture_float_linear")
            : undefined;
        if (enableOESTextureFloatLinear && !oesTextureFloatLinear) {
            throw new Error("Could not acquire extension: OES_texture_float_linear");
        }

        return new Device(
            gl,
            gl.canvas,
            extColorBufferFloat,
            oesTextureFloatLinear,
        );
    }

    private constructor(
        readonly gl: WebGL2RenderingContext,
        readonly canvas: HTMLCanvasElement,
        readonly extColorBufferFloat?: EXTColorBufferFloat,
        readonly oesTextureFloatLinear?: OES_texture_float_linear,
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
