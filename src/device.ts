import * as assert from "./util/assert";
import { Stack } from "./util/stack";
import { BufferBits, Primitive } from "./types";
import {
    Command,
    DepthDescriptor,
    StencilDescriptor,
    BlendDescriptor,
    TextureAccessor,
    UniformDescriptor,
} from "./command";
import { Attributes } from "./attributes";
import { Framebuffer } from "./framebuffer";

export const SYM_STACK_PROGRAM = Symbol();
export const SYM_STACK_VERTEX_ARRAY = Symbol();
export const SYM_STACK_READ_FRAMEBUFFER = Symbol();
export const SYM_STACK_DRAW_FRAMEBUFFER = Symbol();
export const SYM_STACK_DRAW_BUFFERS = Symbol();

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

export interface TargetClearOptions {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
    depth?: number;
    stencil?: number;
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

    readonly [SYM_STACK_PROGRAM]: Stack<WebGLProgram | null>;
    readonly [SYM_STACK_VERTEX_ARRAY]: Stack<WebGLVertexArrayObject | null>;
    readonly [SYM_STACK_READ_FRAMEBUFFER]: Stack<WebGLFramebuffer | null>;
    readonly [SYM_STACK_DRAW_FRAMEBUFFER]: Stack<WebGLFramebuffer | null>;
    readonly [SYM_STACK_DRAW_BUFFERS]: Stack<number[]>;

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

        this[SYM_STACK_PROGRAM] = new Stack<WebGLProgram | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.useProgram(val),
        );

        this[SYM_STACK_VERTEX_ARRAY] = new Stack<WebGLVertexArrayObject | null>(
            null,
            (prev, val) => prev === val ? void 0 : gl.bindVertexArray(val),
        );

        this[SYM_STACK_READ_FRAMEBUFFER] = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.READ_FRAMEBUFFER, val),
        );

        this[SYM_STACK_DRAW_FRAMEBUFFER] = new Stack<WebGLFramebuffer | null>(
            null,
            (prev, val) => prev === val
                ? void 0
                : gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, val),
        );

        this[SYM_STACK_DRAW_BUFFERS] = new Stack<number[]>(
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

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
export class Target {

    constructor(
        private dev: Device,
        readonly glDrawBuffers: number[],
        readonly glFramebuffer: WebGLFramebuffer | null,
        readonly width?: number,
        readonly height?: number,
    ) { }

    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     *
     * All drawing to the target should be done within the callback to prevent
     * unnecessary rebinding.
     */
    with(cb: (rt: Target) => void): void {
        const {
            dev: {
                gl,
                [SYM_STACK_DRAW_FRAMEBUFFER]: stackDrawFramebuffer,
                [SYM_STACK_DRAW_BUFFERS]: stackDrawBuffers,
            },
            glFramebuffer,
            glDrawBuffers,
        } = this;
        const {
            width = gl.drawingBufferWidth,
            height = gl.drawingBufferHeight,
        } = this;

        stackDrawFramebuffer.push(glFramebuffer);
        stackDrawBuffers.push(glDrawBuffers);

        gl.viewport(0, 0, width, height);

        cb(this);

        stackDrawFramebuffer.pop();
        stackDrawBuffers.pop();
    }

    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose, which buffers to blit.
     */
    blit(source: Framebuffer, bits: BufferBits): void {
        const {
            dev: { gl, [SYM_STACK_READ_FRAMEBUFFER]: stackReadFramebuffer },
            width,
            height,
        } = this;

        this.with(() => {
            stackReadFramebuffer.push(source.glFramebuffer);
            gl.blitFramebuffer(
                0, 0,
                source.width, source.height,
                0, 0,
                width || gl.drawingBufferWidth, height || gl.drawingBufferHeight,
                bits,
                gl.NEAREST,
            );
            stackReadFramebuffer.pop();
        });
    }

    /**
     * Clear selected buffers to provided values.
     */
    clear(
        bits: BufferBits,
        {
            r = 0,
            g = 0,
            b = 0,
            a = 1,
            depth = 1,
            stencil = 0,
        }: TargetClearOptions = {},
    ): void {
        this.with(() => {
            const gl = this.dev.gl;
            if (bits & BufferBits.COLOR) { gl.clearColor(r, g, b, a); }
            if (bits & BufferBits.DEPTH) { gl.clearDepth(depth); }
            if (bits & BufferBits.STENCIL) { gl.clearStencil(stencil); }
            gl.clear(bits);
        });
    }

    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     */
    draw<P>(cmd: Command<P>, attrs: Attributes, props: P): void {
        const {
            dev: {
                [SYM_STACK_PROGRAM]: stackProgram,
                [SYM_STACK_VERTEX_ARRAY]: stackVertexArray,
            },
        } = this;
        const {
            glProgram,
            depthDescr,
            stencilDescr,
            blendDescr,
            textureAccessors,
            uniformDescrs,
        } = cmd;

        this.with(() => {
            this.depth(depthDescr);
            this.stencil(stencilDescr);
            this.blend(blendDescr);

            stackProgram.push(glProgram);

            this.textures(textureAccessors, props, 0);
            this.uniforms(uniformDescrs, props, 0);

            // Note that attrs.glVertexArray may be null for empty attrs -> ok
            stackVertexArray.push(attrs.glVertexArray);
            if (attrs.indexed) {
                this.drawElements(
                    attrs.primitive,
                    attrs.elementCount,
                    attrs.indexType!,
                    0, // offset
                    attrs.instanceCount,
                );
            } else {
                this.drawArrays(
                    attrs.primitive,
                    attrs.count,
                    0, // offset
                    attrs.instanceCount,
                );
            }

            stackVertexArray.pop();
            stackProgram.pop();
        });
    }

    /**
     * Perform multiple draws to this target with the same command, but multiple
     * attributes and command properties. The properties are passed to the
     * command's uniform or texture callbacks, if used.
     *
     * All drawing should be performed within the callback to prevent
     * unnecesasry rebinding.
     */
    batch<P>(
        cmd: Command<P>,
        cb: (draw: (attrs: Attributes, props: P) => void) => void,
    ): void {
        const {
            dev: {
                [SYM_STACK_PROGRAM]: stackProgram,
                [SYM_STACK_VERTEX_ARRAY]: stackVertexArray,
            },
        } = this;
        const {
            glProgram,
            depthDescr,
            stencilDescr,
            blendDescr,
            textureAccessors,
            uniformDescrs,
        } = cmd;

        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch, unless API
        // is badly abused and the draw() callback is called outside ot batch()

        this.with(() => {
            stackProgram.push(glProgram);

            this.depth(depthDescr);
            this.stencil(stencilDescr);
            this.blend(blendDescr);

            let iter = 0;

            cb((attrs: Attributes, props: P) => {
                this.textures(textureAccessors, props, iter);
                this.uniforms(uniformDescrs, props, iter);
                iter++;

                // TODO: find a way to restore vertex array rebinding
                // optimization

                stackProgram.push(glProgram);
                stackVertexArray.push(attrs.glVertexArray);

                if (attrs.indexed) {
                    this.drawElements(
                        attrs.primitive,
                        attrs.elementCount,
                        attrs.indexType!,
                        0, // offset
                        attrs.instanceCount,
                    );
                } else {
                    this.drawArrays(
                        attrs.primitive,
                        attrs.count,
                        0, // offset
                        attrs.instanceCount,
                    );
                }

                stackVertexArray.pop();
                stackProgram.pop();
            });

            stackProgram.pop();
        });
    }

    private drawArrays(
        primitive: Primitive,
        count: number,
        offset: number,
        instanceCount: number,
    ): void {
        const gl = this.dev.gl;
        if (instanceCount) {
            gl.drawArraysInstanced(
                primitive,
                offset,
                count,
                instanceCount,
            );
        } else {
            gl.drawArrays(primitive, offset, count);
        }
    }

    private drawElements(
        primitive: Primitive,
        count: number,
        type: number,
        offset: number,
        instCount: number,
    ): void {
        const gl = this.dev.gl;
        if (instCount) {
            gl.drawElementsInstanced(
                primitive,
                count,
                type,
                offset,
                instCount,
            );
        } else {
            gl.drawElements(
                primitive,
                count,
                type,
                offset,
            );
        }
    }

    private depth(depthDescr?: DepthDescriptor): void {
        const gl = this.dev.gl;
        if (depthDescr) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(depthDescr.func);
            gl.depthMask(depthDescr.mask);
            gl.depthRange(depthDescr.rangeStart, depthDescr.rangeEnd);
        } else { gl.disable(gl.DEPTH_TEST); }
    }

    private stencil(stencilDescr?: StencilDescriptor): void {
        const gl = this.dev.gl;
        if (stencilDescr) {
            const {
                fFunc,
                bFunc,
                fFuncRef,
                bfuncRef,
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
            } = stencilDescr;
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFuncSeparate(gl.FRONT, fFunc, fFuncRef, fFuncMask);
            gl.stencilFuncSeparate(gl.BACK, bFunc, bfuncRef, bFuncMask);
            gl.stencilMaskSeparate(gl.FRONT, fMask);
            gl.stencilMaskSeparate(gl.BACK, bMask);
            gl.stencilOpSeparate(gl.FRONT, fOpFail, fOpZFail, fOpZPass);
            gl.stencilOpSeparate(gl.BACK, bOpFail, bOpZFail, bOpZPass);
        } else { gl.disable(gl.STENCIL_TEST); }
    }

    private blend(blendDescr?: BlendDescriptor): void {
        const gl = this.dev.gl;
        if (blendDescr) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(
                blendDescr.srcRGB,
                blendDescr.dstRGB,
                blendDescr.srcAlpha,
                blendDescr.dstAlpha,
            );
            gl.blendEquationSeparate(
                blendDescr.equationRGB,
                blendDescr.equationAlpha,
            );
            if (blendDescr.color) {
                const [r, g, b, a] = blendDescr.color;
                gl.blendColor(r, g, b, a);
            }
        } else { gl.disable(gl.BLEND); }
    }

    private textures<P>(
        textureAccessors: TextureAccessor<P>[],
        props: P,
        index: number,
    ): void {
        const gl = this.dev.gl;
        textureAccessors.forEach((accessor, i) => {
            const tex = access(props, index, accessor);
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
        });
    }

    private uniforms<P>(
        uniformDescrs: UniformDescriptor<P>[],
        props: P,
        index: number,
    ): void {
        const gl = this.dev.gl;
        uniformDescrs.forEach(({
            identifier: ident,
            location: loc,
            definition: def,
        }) => {
            switch (def.type) {
                case "1f":
                    gl.uniform1f(loc, access(props, index, def.value));
                    break;
                case "1fv":
                    gl.uniform1fv(loc, access(props, index, def.value));
                    break;
                case "1i":
                    gl.uniform1i(loc, access(props, index, def.value));
                    break;
                case "1iv":
                    gl.uniform1iv(loc, access(props, index, def.value));
                    break;
                case "1ui":
                    gl.uniform1ui(loc, access(props, index, def.value));
                    break;
                case "1uiv":
                    gl.uniform1uiv(loc, access(props, index, def.value));
                    break;
                case "2f": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2f(loc, x, y);
                    break;
                }
                case "2fv":
                    gl.uniform2fv(loc, access(props, index, def.value));
                    break;
                case "2i": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2i(loc, x, y);
                    break;
                }
                case "2iv":
                    gl.uniform2iv(loc, access(props, index, def.value));
                    break;
                case "2ui": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2ui(loc, x, y);
                    break;
                }
                case "2uiv":
                    gl.uniform2uiv(loc, access(props, index, def.value));
                    break;
                case "3f": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3f(loc, x, y, z);
                    break;
                }
                case "3fv":
                    gl.uniform3fv(loc, access(props, index, def.value));
                    break;
                case "3i": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3i(loc, x, y, z);
                    break;
                }
                case "3iv":
                    gl.uniform3iv(loc, access(props, index, def.value));
                    break;
                case "3ui": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3ui(loc, x, y, z);
                    break;
                }
                case "3uiv":
                    gl.uniform3uiv(loc, access(props, index, def.value));
                    break;
                case "4f": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4f(loc, x, y, z, w);
                    break;
                }
                case "4fv":
                    gl.uniform4fv(loc, access(props, index, def.value));
                    break;
                case "4i": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4i(loc, x, y, z, w);
                    break;
                }
                case "4iv":
                    gl.uniform4iv(loc, access(props, index, def.value));
                    break;
                case "4ui": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4ui(loc, x, y, z, w);
                    break;
                }
                case "4uiv":
                    gl.uniform4uiv(loc, access(props, index, def.value));
                    break;
                case "matrix2fv":
                    gl.uniformMatrix2fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                case "matrix3fv":
                    gl.uniformMatrix3fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                case "matrix4fv":
                    gl.uniformMatrix4fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                default:
                    assert.never(def, `Unknown uniform type: (${ident})`);
                    break;
            }
        });
    }
}

function access<P, R>(
    props: P,
    index: number,
    value: ((props: P, index: number) => R) | R,
): R { return typeof value === "function" ? value(props, index) : value; }

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
