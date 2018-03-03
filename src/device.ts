import { Stack } from "./util/stack";
import { Target } from "./target";
import { DepthDescriptor, StencilDescriptor, BlendDescriptor } from "./command";

export interface DeviceMountOptions {
    element?: HTMLElement;
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewport?: [number, number];
}

export interface DeviceFromCanvasOptions {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewport?: [number, number];
}

export interface DeviceFromContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewport?: [number, number];
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
    static mount(options: DeviceMountOptions = {}): Device {
        const { element = document.body } = options;
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
        options: DeviceFromCanvasOptions = {},
    ): Device {
        const {
            alpha = true,
            antialias = true,
            depth = true,
            stencil = true,
            preserveDrawingBuffer = false,
        } = options;
        const gl = canvas.getContext("webgl2", {
            alpha,
            antialias,
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
            debug,
        }: DeviceFromContextOptions = {},
    ): Device {
        if (extensions) {
            extensions.forEach(ext => {
                // We currently do not have extensions with callable API
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }

        if (debug) {
            const wrapper = {} as any;
            for (const key in gl) {
                if (typeof (gl as any)[key] === "function") {
                    wrapper[key] = createDebugFunc(gl, key);
                } else {
                    wrapper[key] = (gl as any)[key];
                }
            }
            gl = wrapper;
        }

        const dev = new Device(gl, gl.canvas, pixelRatio, viewport);
        dev.update();
        return dev;
    }

    readonly gl: WebGL2RenderingContext;
    readonly canvas: HTMLCanvasElement;

    readonly __STACK_VERTEX_ARRAY: Stack<WebGLVertexArrayObject | null>;
    readonly __STACK_PROGRAM: Stack<WebGLProgram | null>;
    readonly __STACK_DEPTH_TEST: Stack<DepthDescriptor | null>;
    readonly __STACK_STENCIL_TEST: Stack<StencilDescriptor | null>;
    readonly __STACK_BLEND: Stack<BlendDescriptor | null>;
    readonly __STACK_DRAW_FRAMEBUFFER: Stack<WebGLFramebuffer | null>;
    readonly __STACK_READ_FRAMEBUFFER: Stack<WebGLFramebuffer | null>;
    readonly __STACK_DRAW_BUFFERS: Stack<number[]>;

    private explicitPixelRatio?: number;
    private explicitViewport?: [number, number];

    private backbufferTarget: Target;


    private constructor(
        gl: WebGL2RenderingContext,
        canvas: HTMLCanvasElement,
        explicitPixelRatio?: number,
        explicitViewport?: [number, number],
    ) {
        this.gl = gl;
        this.canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewport = explicitViewport;
        this.backbufferTarget = new Target(this, [gl.BACK], null);

        this.__STACK_VERTEX_ARRAY = new Stack<WebGLVertexArrayObject | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.bindVertexArray(val),
        );

        this.__STACK_PROGRAM = new Stack<WebGLProgram | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.useProgram(val),
        );

        this.__STACK_DEPTH_TEST = new Stack<DepthDescriptor | null>(
            null,
            (prev, val) => {
                if (!DepthDescriptor.equals(prev, val)) {
                    if (val) {
                        gl.enable(gl.DEPTH_TEST);
                        gl.depthFunc(val.func);
                        gl.depthMask(val.mask);
                        gl.depthRange(val.rangeStart, val.rangeEnd);
                    } else { gl.disable(gl.DEPTH_TEST); }
                }
            },
        );

        this.__STACK_STENCIL_TEST = new Stack<StencilDescriptor | null>(
            null,
            (prev, val) => {
                if (!StencilDescriptor.equals(prev, val)) {
                    if (val) {
                        const {
                            fFunc,
                            bFunc,
                            fFuncRef,
                            bFuncRef,
                            fFuncMask,
                            bFuncMask,
                            fMask,
                            bMask,
                            fOpFail,
                            bOpFail,
                            fOpZFail,
                            bOpZFail,
                            fOpZPass,
                            bOpZPass,
                        } = val;
                        gl.enable(gl.STENCIL_TEST);
                        gl.stencilFuncSeparate(gl.FRONT, fFunc, fFuncRef, fFuncMask);
                        gl.stencilFuncSeparate(gl.BACK, bFunc, bFuncRef, bFuncMask);
                        gl.stencilMaskSeparate(gl.FRONT, fMask);
                        gl.stencilMaskSeparate(gl.BACK, bMask);
                        gl.stencilOpSeparate(gl.FRONT, fOpFail, fOpZFail, fOpZPass);
                        gl.stencilOpSeparate(gl.BACK, bOpFail, bOpZFail, bOpZPass);
                    } else { gl.disable(gl.STENCIL_TEST); }
                }
            },
        );

        this.__STACK_BLEND = new Stack<BlendDescriptor | null>(
            null,
            (prev, val) => {
                if (!BlendDescriptor.equals(prev, val)) {
                    if (val) {
                        gl.enable(gl.BLEND);
                        gl.blendFuncSeparate(
                            val.srcRGB,
                            val.dstRGB,
                            val.srcAlpha,
                            val.dstAlpha,
                        );
                        gl.blendEquationSeparate(
                            val.eqnRGB,
                            val.eqnAlpha,
                        );
                        if (val.color) {
                            const [r, g, b, a] = val.color;
                            gl.blendColor(r, g, b, a);
                        }
                    } else { gl.disable(gl.BLEND); }
                }
            },
        );

        this.__STACK_DRAW_FRAMEBUFFER = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, val),
        );

        this.__STACK_READ_FRAMEBUFFER = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.READ_FRAMEBUFFER, val),
        );

        this.__STACK_DRAW_BUFFERS = new Stack<number[]>(
            [gl.BACK],
            (prev, val) => eqNumberArrays(prev, val)
                ? void 0
                : gl.drawBuffers(val),
        );
    }

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
     * Request a render target from the device to draw into. This gives you the
     * gl.BACK target.
     *
     * Drawing should be done within the callback by
     * calling `ratget.clear()` or `target.draw()` family of methods.
     *
     * Also see `framebuffer.target()`.
     */
    target(cb: (rt: Target) => void): void {
        this.backbufferTarget.with(cb);
    }
}

function createDebugFunc(gl: any, key: string): (...args: any[]) => any {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}

function eqNumberArrays(left: number[], right: number[]): boolean {
    if (left === right) { return true; }
    if (left.length !== right.length) { return false; }
    for (let i = 0; i < left.length; i++) {
        if (left[i] !== right[i]) { return false; }
    }
    return true;

}
