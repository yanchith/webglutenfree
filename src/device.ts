import { Stack } from "./util/stack";
import { Target } from "./target";
import { DepthDescriptor, StencilDescriptor, BlendDescriptor } from "./command";

export interface DeviceCreateOptions {
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

export interface DeviceWithCanvasOptions {
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

export interface DeviceWithContextOptions {
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
    static create(options: DeviceCreateOptions = {}): Device {
        const { element = document.body } = options;
        if (element instanceof HTMLCanvasElement) {
            return Device.withCanvas(element, options);
        }

        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.withCanvas(canvas, options);
    }

    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static withCanvas(
        canvas: HTMLCanvasElement,
        options: DeviceWithCanvasOptions = {},
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
        return Device.withContext(gl, options);
    }

    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static withContext(
        gl: WebGL2RenderingContext,
        {
            pixelRatio,
            viewport,
            extensions,
            debug,
        }: DeviceWithContextOptions = {},
    ): Device {
        if (extensions) {
            extensions.forEach((ext) => {
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

    readonly _gl: WebGL2RenderingContext;
    readonly _canvas: HTMLCanvasElement;

    // To manage state, we use multiple stacks of various state bits.
    // Disregarding outside interference, the stack head should always be bound
    // with the GL context - this is implemented with the change callbacks in
    // device constructor. The callbacks also diff the current and previous
    // values, so pushing a value a second time is a NOOP from WebGL perspective.
    // This allows nested target drawing (since the API does not prevent it,
    // we should at least do the correct thing, if not the fast one) by first
    // pushing a stack value before the callback, and ensuring the value just
    // before drawing.
    //
    // fbo.target(fbort => {
    //   dev.target(rt => rt.draw(...));
    //   fbort.draw(,,,);
    // });

    readonly _stackVertexArray: Stack<WebGLVertexArrayObject | null>;
    readonly _stackProgram: Stack<WebGLProgram | null>;
    readonly _stackDepthTest: Stack<DepthDescriptor | null>;
    readonly _stackStencilTest: Stack<StencilDescriptor | null>;
    readonly _stackBlend: Stack<BlendDescriptor | null>;
    readonly _stackDrawFramebuffer: Stack<WebGLFramebuffer | null>;
    readonly _stackReadFramebuffer: Stack<WebGLFramebuffer | null>;
    readonly _stackDrawBuffers: Stack<number[]>;

    private explicitPixelRatio?: number;
    private explicitViewport?: [number, number];

    private backbufferTarget: Target;

    private constructor(
        gl: WebGL2RenderingContext,
        canvas: HTMLCanvasElement,
        explicitPixelRatio?: number,
        explicitViewport?: [number, number],
    ) {
        this._gl = gl;
        this._canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewport = explicitViewport;
        this.backbufferTarget = new Target(this, [gl.BACK], null);

        this._stackVertexArray = new Stack<WebGLVertexArrayObject | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.bindVertexArray(val),
        );

        this._stackProgram = new Stack<WebGLProgram | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.useProgram(val),
        );

        this._stackDepthTest = new Stack<DepthDescriptor | null>(
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

        this._stackStencilTest = new Stack<StencilDescriptor | null>(
            null,
            (prev, val) => {
                if (!StencilDescriptor.equals(prev, val)) {
                    if (val) {
                        const {
                            fFn,
                            bFn,
                            fFnRef,
                            bFnRef,
                            fFnMask,
                            bFnMask,
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
                        gl.stencilFuncSeparate(gl.FRONT, fFn, fFnRef, fFnMask);
                        gl.stencilFuncSeparate(gl.BACK, bFn, bFnRef, bFnMask);
                        gl.stencilMaskSeparate(gl.FRONT, fMask);
                        gl.stencilMaskSeparate(gl.BACK, bMask);
                        gl.stencilOpSeparate(
                            gl.FRONT,
                            fOpFail,
                            fOpZFail,
                            fOpZPass,
                        );
                        gl.stencilOpSeparate(
                            gl.BACK,
                            bOpFail,
                            bOpZFail,
                            bOpZPass,
                        );
                    } else { gl.disable(gl.STENCIL_TEST); }
                }
            },
        );

        this._stackBlend = new Stack<BlendDescriptor | null>(
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

        // Note: DRAW_FRAMEBUFFER and READ_FRAMEBUFFER are handled separately
        // to support blitting. In library code, gl.FRAMEBUFFER target must
        // never be used, as it overwrites READ_FRAMEBUFFER and DRAW_FRAMEBUFFER

        this._stackDrawFramebuffer = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, val),
        );

        this._stackReadFramebuffer = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.READ_FRAMEBUFFER, val),
        );

        this._stackDrawBuffers = new Stack<number[]>(
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
        return this._gl.drawingBufferWidth;
    }

    /**
     * Return height of the gl drawing buffer.
     */
    get bufferHeight(): number {
        return this._gl.drawingBufferHeight;
    }

    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    get canvasWidth(): number {
        return this._canvas.width;
    }

    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    get canvasHeight(): number {
        return this._canvas.height;
    }

    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSWidth(): number {
        return this._canvas.clientWidth;
    }

    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSHeight(): number {
        return this._canvas.clientHeight;
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
        const canvas = this._canvas;
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
     * calling `target.clear()` or `target.draw()` family of methods.
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
