import * as assert from "./util/assert";
import { BufferBits, Primitive } from "./types";
import { Device as _Device } from "./device";
import {
    Command as _Command,
    UniformDescriptor as _UniformDescriptor,
    TextureAccessor,
} from "./command";
import { Attributes as _Attributes } from "./attributes";
import { Framebuffer as _Framebuffer } from "./framebuffer";

export interface TargetClearOptions {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
    depth?: number;
    stencil?: number;
}

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
export class Target {

    constructor(
        private dev: _Device,
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
            dev: { gl, __STACK_DRAW_BUFFERS, __STACK_DRAW_FRAMEBUFFER },
            glFramebuffer,
            glDrawBuffers,
        } = this;
        const {
            width = gl.drawingBufferWidth,
            height = gl.drawingBufferHeight,
        } = this;

        __STACK_DRAW_FRAMEBUFFER.push(glFramebuffer);
        __STACK_DRAW_BUFFERS.push(glDrawBuffers);

        gl.viewport(0, 0, width, height);

        cb(this);

        __STACK_DRAW_FRAMEBUFFER.pop();
        __STACK_DRAW_BUFFERS.pop();
    }

    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose, which buffers to blit.
     */
    blit(source: _Framebuffer, bits: BufferBits): void {
        const {
            dev: { gl, __STACK_READ_FRAMEBUFFER },
            width,
            height,
        } = this;

        this.with(() => {
            __STACK_READ_FRAMEBUFFER.push(source.glFramebuffer);
            gl.blitFramebuffer(
                0, 0,
                source.width, source.height,
                0, 0,
                width || gl.drawingBufferWidth, height || gl.drawingBufferHeight,
                bits,
                gl.NEAREST,
            );
            __STACK_READ_FRAMEBUFFER.pop();
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
    draw<P>(cmd: _Command<P>, attrs: _Attributes, props: P): void {
        const {
            dev: {
                __STACK_VERTEX_ARRAY,
                __STACK_PROGRAM,
                __STACK_DEPTH_TEST,
                __STACK_STENCIL_TEST,
                __STACK_BLEND,
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
            __STACK_DEPTH_TEST.push(depthDescr);
            __STACK_STENCIL_TEST.push(stencilDescr);
            __STACK_BLEND.push(blendDescr);
            __STACK_PROGRAM.push(glProgram);

            this.textures(textureAccessors, props, 0);
            this.uniforms(uniformDescrs, props, 0);

            // Note that attrs.glVertexArray may be null for empty attrs -> ok
            __STACK_VERTEX_ARRAY.push(attrs.glVertexArray);
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

            __STACK_VERTEX_ARRAY.pop();

            __STACK_BLEND.pop();
            __STACK_STENCIL_TEST.pop();
            __STACK_DEPTH_TEST.pop();
            __STACK_PROGRAM.pop();
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
        cmd: _Command<P>,
        cb: (draw: (attrs: _Attributes, props: P) => void) => void,
    ): void {
        const {
            dev: {
                __STACK_VERTEX_ARRAY,
                __STACK_PROGRAM,
                __STACK_DEPTH_TEST,
                __STACK_STENCIL_TEST,
                __STACK_BLEND,
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

        // Perform shared batch setup

        __STACK_DEPTH_TEST.push(depthDescr);
        __STACK_STENCIL_TEST.push(stencilDescr);
        __STACK_BLEND.push(blendDescr);
        __STACK_PROGRAM.push(glProgram);

        let iter = 0;

        cb((attrs: _Attributes, props: P) => {
            // with() ensures the original target is still bound
            this.with(() => {
                iter++;

                // TODO: find a way to restore vertex array rebinding
                // optimization

                // Ensure the shared setup still holds

                __STACK_DEPTH_TEST.push(depthDescr);
                __STACK_STENCIL_TEST.push(stencilDescr);
                __STACK_BLEND.push(blendDescr);
                __STACK_PROGRAM.push(glProgram);

                this.textures(textureAccessors, props, iter);
                this.uniforms(uniformDescrs, props, iter);

                __STACK_VERTEX_ARRAY.push(attrs.glVertexArray);

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

                __STACK_VERTEX_ARRAY.pop();

                __STACK_PROGRAM.pop();
                __STACK_BLEND.pop();
                __STACK_STENCIL_TEST.pop();
                __STACK_DEPTH_TEST.pop();
            });
        });

        __STACK_PROGRAM.pop();
        __STACK_BLEND.pop();
        __STACK_STENCIL_TEST.pop();
        __STACK_DEPTH_TEST.pop();
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
        uniformDescrs: _UniformDescriptor<P>[],
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
