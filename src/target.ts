import * as assert from "./assert";
import {
    Command,
    DepthDescriptor,
    StencilDescriptor,
    BlendDescriptor,
    UniformDescriptor,
} from "./command";
import { AttributeData } from "./attribute-data";
import { Primitive } from "./element-buffer";

// This stores a render target stack for each WebGL context. WeakMap is used
// to prevent memory leaks
const CONTEXT_TARGETS = new WeakMap<WebGL2RenderingContext, Target[]>();

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 *
 * Targets provide methods for drawing to a surface, or clearing its values.
 */
export class Target {

    constructor(
        private gl: WebGL2RenderingContext,
        readonly glDrawBuffers: number[],
        readonly glFramebuffer?: WebGLFramebuffer,
        readonly width?: number,
        readonly height?: number,
    ) { }

    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     */
    with(cb: (rt: Target) => void): void {
        // Get our stack, or create it if needed
        let stack = CONTEXT_TARGETS.get(this.gl);
        if (typeof stack === "undefined") {
            stack = [];
            CONTEXT_TARGETS.set(this.gl, stack);
        }

        if (stack.length && stack[stack.length - 1] === this) {
            // No need to grow the stack and do rebinding if just this target
            // is nested
            cb(this);
        } else {
            this.bind();
            stack.push(this);
            cb(this);
            stack.pop();
            if (stack.length) {
                // If there is no target, there is no need to bind it
                stack[length - 1].bind();
            }
        }
    }

    /**
     * Clear the color buffer to provided color.
     */
    clearColor(r: number, g: number, b: number, a: number): void {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Clear the depth buffer to provided depth.
     */
    clearDepth(depth: number): void {
        const gl = this.gl;
        gl.clearDepth(depth);
        gl.clear(gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Clear the stencil buffer to provided stencil.
     */
    clearStencil(stencil: number): void {
        const gl = this.gl;
        gl.clearStencil(stencil);
        gl.clear(gl.STENCIL_BUFFER_BIT);
    }

    /**
     * Clear the color buffers and depth buffer to provided color and depth.
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
    ): void {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Clear the depth buffer and stencil buffer to provided depth and stencil.
     *
     * This is equivalent to but more efficient than:
     *   device.clearDepth()
     *   device.clearStencil()
     */
    clearDepthAndStencil(depth: number, stencil: number): void {
        const gl = this.gl;
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    /**
     * Clear the color buffers and stencil buffer to provided color and stencil.
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
    ): void {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    /**
     * Clear the color buffers, depth buffer and stencil buffer to provided
     * color, depth and stencil.
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
    ): void {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT
            | gl.DEPTH_BUFFER_BIT
            | gl.STENCIL_BUFFER_BIT);
    }

    /**
     * Draw to the target with a command, geometry, and command properties.
     */
    draw<P>(cmd: Command<P>, geometry: AttributeData, props: P): void {
        const gl = this.gl;
        const {
            glProgram,
            depthDescr,
            stencilDescr,
            blendDescr,
            uniformDescrs,
        } = cmd;

        gl.useProgram(glProgram);

        this.beginDepth(depthDescr);
        this.beginStencil(stencilDescr);
        this.beginBlend(blendDescr);

        this.updateUniforms(uniformDescrs, props, 0);

        if (geometry.isEmpty()) {
            gl.drawArrays(geometry.primitive, 0 /* offset */, geometry.count);
        } else {
            gl.bindVertexArray(geometry.glVertexArray);

            if (geometry.elements) {
                this.drawElements(
                    geometry.primitive,
                    geometry.elementCount,
                    geometry.elementType!,
                    0, // offset
                    geometry.instanceCount,
                );
            } else {
                this.drawArrays(
                    geometry.primitive,
                    geometry.count,
                    0, // offset
                    geometry.instanceCount,
                );
            }

            gl.bindVertexArray(null);
        }


        this.endBlend(blendDescr);
        this.endStencil(stencilDescr);
        this.endDepth(depthDescr);

        gl.useProgram(null);
    }

    /**
     * Perform multiple draws to the target with the same command, but multiple
     * geometries and command properties.
     */
    batch<P>(
        cmd: Command<P>,
        cb: (draw: (geometry: AttributeData, props: P) => void) => void,
    ): void {
        const gl = this.gl;
        const {
            glProgram,
            depthDescr,
            stencilDescr,
            blendDescr,
            uniformDescrs,
        } = cmd;

        // When batching (passing in an array of props), the price for
        // gl.useProgram, binding framebuffers, enabling depth/stencil tests and
        // blending is paid only once for all draw calls.

        gl.useProgram(glProgram);

        this.beginDepth(depthDescr);
        this.beginStencil(stencilDescr);
        this.beginBlend(blendDescr);

        let iter = 0;
        let currVao: AttributeData | null = null;
        cb((geometry: AttributeData, props: P) => {
            this.updateUniforms(uniformDescrs, props, iter++);
            if (geometry.isEmpty()) {
                if (currVao) {
                    gl.bindVertexArray(null);
                    currVao = null;
                }
                gl.drawArrays(
                    geometry.primitive,
                    0 /* offset */,
                    geometry.count,
                );
            } else {
                if (geometry !== currVao) {
                    gl.bindVertexArray(geometry.glVertexArray);
                    currVao = geometry;
                }

                if (geometry.elements) {
                    this.drawElements(
                        geometry.primitive,
                        geometry.elementCount,
                        geometry.elementType!,
                        0, // offset
                        geometry.instanceCount,
                    );
                } else {
                    this.drawArrays(
                        geometry.primitive,
                        geometry.count,
                        0, // offset
                        geometry.instanceCount,
                    );
                }
            }
        });

        // If some vaos were bound
        if (currVao) {
            gl.bindVertexArray(null);
        }

        this.endBlend(blendDescr);
        this.endStencil(stencilDescr);
        this.endDepth(depthDescr);

        gl.useProgram(null);
    }

    private bind(): void {
        const { gl, glFramebuffer, glDrawBuffers, width, height } = this;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, glFramebuffer || null);
        gl.drawBuffers(glDrawBuffers);
        gl.viewport(
            0,
            0,
            width || gl.drawingBufferWidth,
            height || gl.drawingBufferHeight,
        );
    }

    private drawArrays(
        primitive: Primitive,
        count: number,
        offset: number,
        instanceCount: number,
    ): void {
        if (instanceCount) {
            this.gl.drawArraysInstanced(
                primitive,
                offset,
                count,
                instanceCount,
            );
        } else {
            this.gl.drawArrays(primitive, offset, count);
        }
    }

    private drawElements(
        primitive: Primitive,
        count: number,
        type: number,
        offset: number,
        instCount: number,
    ): void {
        if (instCount) {
            this.gl.drawElementsInstanced(
                primitive,
                count,
                type,
                offset,
                instCount,
            );
        } else {
            this.gl.drawElements(
                primitive,
                count,
                type,
                offset,
            );
        }
    }

    private beginDepth(depthDescr?: DepthDescriptor): void {
        const gl = this.gl;
        if (depthDescr) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(depthDescr.func);
            gl.depthMask(depthDescr.mask);
            gl.depthRange(depthDescr.rangeStart, depthDescr.rangeEnd);
        }
    }

    private endDepth(depthDescr?: DepthDescriptor): void {
        const gl = this.gl;
        if (depthDescr) { gl.disable(gl.DEPTH_TEST); }
    }

    private beginStencil(stencilDescr?: StencilDescriptor): void {
        const gl = this.gl;
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
        }
    }

    private endStencil(stencilDescr?: StencilDescriptor): void {
        const gl = this.gl;
        if (stencilDescr) { gl.disable(gl.STENCIL_TEST); }
    }

    private beginBlend(blendDescr?: BlendDescriptor): void {
        const gl = this.gl;
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
        }
    }

    private endBlend(blendDescr?: BlendDescriptor): void {
        const gl = this.gl;
        if (blendDescr) { gl.disable(gl.BLEND); }
    }

    private updateUniforms<P>(
        uniformDescrs: UniformDescriptor<P>[],
        props: P,
        index: number,
    ): void {
        const gl = this.gl;

        let textureUnitOffset = 0;

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
                case "texture":
                    // TODO: is this the best way? (is it fast? can we cache?)
                    const texture = access(props, index, def.value);
                    const currentTexture = textureUnitOffset++;
                    gl.activeTexture(gl.TEXTURE0 + currentTexture);
                    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
                    gl.uniform1i(loc, currentTexture);
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
): R {
    return typeof value === "function" ? value(props, index) : value;
}
