import * as assert from "./util/assert";
import { COMMAND_BINDINGS } from "./command";
import { BufferBits, Filter, Primitive } from "./types";

export type Device = import ("./device").Device;
export type Command<P> = import ("./command").Command<P>;
export type DepthTestDescriptor = import ("./command").DepthTestDescriptor;
export type StencilTestDescriptor = import ("./command").StencilTestDescriptor;
export type BlendDescriptor = import ("./command").BlendDescriptor;
export type UniformDescriptor<P> = import ("./command").UniformDescriptor<P>;
export type TextureAccessor<P> = import ("./command").TextureAccessor<P>;
export type Attributes = import ("./attributes").Attributes;
export type Framebuffer = import ("./framebuffer").Framebuffer;

/**
 * Tracks binding of `Target`s for each `Device`. Each `Device` must have at most
 * one `Target` bound at any time. Nested target binding is not supported even
 * though it is not prohibited by the shape of the API:
 *
 * // This produces a runtime error
 * fbo.target((fbort) => {
 *     dev.target((rt) => rt.draw(...));
 *     fbort.draw(...);
 * });
 *
 * WeakSet is used instead of `private static` variables, as there can be
 * multiple `Device`s owning the targets.
 */
export const TARGET_BINDINGS = new WeakSet<Device>();

const GL_NONE = 0;
const DRAW_BUFFERS_NONE = [GL_NONE];

export interface TargetClearOptions {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
    depth?: number;
    stencil?: number;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}

export type BlitFilter = Filter.NEAREST | Filter.LINEAR;
export interface TargetBlitOptions {
    srcX?: number;
    srcY?: number;
    srcWidth?: number;
    srcHeight?: number;
    dstX?: number;
    dstY?: number;
    dstWidth?: number;
    dstHeight?: number;
    filter?: BlitFilter;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}

export interface TargetDrawOptions {
    viewportX?: number;
    viewportY?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
export class Target {

    constructor(
        private dev: Device,
        private glDrawBuffers: number[],
        private glFramebuffer: WebGLFramebuffer | null,
        private surfaceWidth?: number,
        private surfaceHeight?: number,
    ) { }

    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     *
     * All writes/drawing to the target MUST be done within the callback.
     */
    with(cb: (rt: Target) => void): void {
        const {
            dev,
            dev: { _gl: gl },
            glFramebuffer,
            glDrawBuffers,
        } = this;

        // We would overwrite the currently bound DRAW_FRAMEBUFFER unless we
        // checked
        if (TARGET_BINDINGS.has(dev)) {
            throw new Error("A target for this device is already bound");
        }

        TARGET_BINDINGS.add(dev);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, glFramebuffer);
        gl.drawBuffers(glDrawBuffers);

        cb(this);

        gl.drawBuffers(DRAW_BUFFERS_NONE);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        TARGET_BINDINGS.delete(dev);
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
            scissorX = 0,
            scissorY = 0,
            scissorWidth = this.surfaceWidth === void 0
                ? this.dev._gl.drawingBufferWidth
                : this.surfaceWidth,
            scissorHeight = this.surfaceHeight === void 0
                ? this.dev._gl.drawingBufferHeight
                : this.surfaceHeight,
        }: TargetClearOptions = {},
    ): void {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform clear");
        }

        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);

        if (bits & BufferBits.COLOR) { gl.clearColor(r, g, b, a); }
        if (bits & BufferBits.DEPTH) { gl.clearDepth(depth); }
        if (bits & BufferBits.STENCIL) { gl.clearStencil(stencil); }
        gl.clear(bits);
    }


    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(
        source: Framebuffer,
        bits: BufferBits,
        {
            srcX = 0,
            srcY = 0,
            srcWidth = source.width,
            srcHeight = source.height,
            dstX = 0,
            dstY = 0,
            dstWidth = this.surfaceWidth === void 0
                ? this.dev._gl.drawingBufferWidth
                : this.surfaceWidth,
            dstHeight = this.surfaceHeight === void 0
                ? this.dev._gl.drawingBufferHeight
                : this.surfaceHeight,
            filter = Filter.NEAREST,
            scissorX = dstX,
            scissorY = dstY,
            scissorWidth = dstWidth,
            scissorHeight = dstHeight,
        }: TargetBlitOptions = {},
    ): void {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform blit");
        }

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, source.glFramebuffer);
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
        gl.blitFramebuffer(
            srcX,
            srcY,
            srcWidth,
            srcHeight,
            dstX,
            dstY,
            dstWidth,
            dstHeight,
            bits,
            filter,
        );
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    }

    /**
     * Draw to this target with a void command and attributes.
     */
    draw(cmd: Command<void> | Command<undefined>, attrs: Attributes): void;
    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     */
    draw<P>(
        cmd: Command<P>,
        attrs: Attributes,
        props: P,
        opts?: TargetDrawOptions,
    ): void;
    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     *
     * This is a unified header to stisfy the typechecker.
     */
    draw(
        cmd: Command<any>,
        attrs: Attributes,
        props?: any,
        {
            viewportX = 0,
            viewportY = 0,
            viewportWidth = this.surfaceWidth === void 0
                ? this.dev._gl.drawingBufferWidth
                : this.surfaceWidth,
            viewportHeight = this.surfaceHeight === void 0
                ? this.dev._gl.drawingBufferHeight
                : this.surfaceHeight,
            scissorX = viewportX,
            scissorY = viewportY,
            scissorWidth = viewportWidth,
            scissorHeight = viewportHeight,
        }: TargetDrawOptions = {},
    ): void {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform draw");
        }

        const {
            glProgram,
            depthTestDescr,
            stencilTestDescr,
            blendDescr,
            textureAccessors,
            uniformDescrs,
        } = cmd;

        if (COMMAND_BINDINGS.has(dev)) {
            throw new Error("Command already bound, cannot bind twice");
        }

        this.depthTest(depthTestDescr);
        this.stencilTest(stencilTestDescr);
        this.blend(blendDescr);

        gl.useProgram(glProgram);

        this.textures(textureAccessors, props, 0);
        this.uniforms(uniformDescrs, props, 0);

        // Only bind the VAO if it is not null - we always assume we cleaned
        // up after ourselves so it SHOULD be unbound prior to this point
        if (attrs.glVertexArray) {
            gl.bindVertexArray(attrs.glVertexArray);
        }

        gl.viewport(viewportX, viewportY, viewportWidth, viewportHeight);
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);

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

        // Clean up after ourselves if we bound something
        if (attrs.glVertexArray) {
            gl.bindVertexArray(null);
        }

        gl.useProgram(null);

        this.blend(null);
        this.stencilTest(null);
        this.depthTest(null);
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
        {
            viewportX = 0,
            viewportY = 0,
            viewportWidth = this.surfaceWidth === void 0
                ? this.dev._gl.drawingBufferWidth
                : this.surfaceWidth,
            viewportHeight = this.surfaceHeight === void 0
                ? this.dev._gl.drawingBufferHeight
                : this.surfaceHeight,
            scissorX = viewportX,
            scissorY = viewportY,
            scissorWidth = viewportWidth,
            scissorHeight = viewportHeight,
        }: TargetDrawOptions = {},
    ): void {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform batch");
        }

        const {
            glProgram,
            depthTestDescr,
            stencilTestDescr,
            blendDescr,
            textureAccessors,
            uniformDescrs,
        } = cmd;

        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch

        // Perform shared batch setup, but first ensure no concurrency

        if (COMMAND_BINDINGS.has(dev)) {
            throw new Error("Command already bound, cannot bind twice");
        }

        COMMAND_BINDINGS.add(dev);

        this.depthTest(depthTestDescr);
        this.stencilTest(stencilTestDescr);
        this.blend(blendDescr);

        gl.useProgram(glProgram);

        let i = 0;

        cb((attrs: Attributes, props: P) => {
            if (!TARGET_BINDINGS.has(dev)) {
                throw new Error("A target must be bound to batch draw");
            }
            if (!COMMAND_BINDINGS.has(dev)) {
                throw new Error("A command must be bound to batch draw");
            }

            i++;

            this.textures(textureAccessors, props, i);
            this.uniforms(uniformDescrs, props, i);

            // Only bind the VAO if it is not null - we always assume we
            // cleaned up after ourselves so it SHOULD be unbound prior to
            // this point
            if (attrs.glVertexArray) {
                gl.bindVertexArray(attrs.glVertexArray);
            }

            gl.viewport(viewportX, viewportY, viewportWidth, viewportHeight);
            gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);

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

            // Clean up after ourselves if we bound something. We can't
            // leave this bound as an optimisation, as we assume everywhere
            // it is not bound in beginning of our methods.
            if (attrs.glVertexArray) {
                gl.bindVertexArray(null);
            }
        });

        gl.useProgram(null);

        this.blend(null);
        this.stencilTest(null);
        this.depthTest(null);

        COMMAND_BINDINGS.delete(dev);
    }

    private drawArrays(
        primitive: Primitive,
        count: number,
        offset: number,
        instanceCount: number,
    ): void {
        const gl = this.dev._gl;
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
        const gl = this.dev._gl;
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
        const gl = this.dev._gl;
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
        const gl = this.dev._gl;
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
                    assert.unreachable(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }

    private depthTest(desc: DepthTestDescriptor | null): void {
        const gl = this.dev._gl;
        if (desc) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(desc.func);
            gl.depthMask(desc.mask);
            gl.depthRange(desc.rangeStart, desc.rangeEnd);
        } else { gl.disable(gl.DEPTH_TEST); }
    }

    private stencilTest(desc: StencilTestDescriptor | null): void {
        const gl = this.dev._gl;
        if (desc) {
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
            } = desc;
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

    private blend(desc: BlendDescriptor | null): void {
        const gl = this.dev._gl;
        if (desc) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(
                desc.srcRGB,
                desc.dstRGB,
                desc.srcAlpha,
                desc.dstAlpha,
            );
            gl.blendEquationSeparate(
                desc.eqnRGB,
                desc.eqnAlpha,
            );
            if (desc.color) {
                const [r, g, b, a] = desc.color;
                gl.blendColor(r, g, b, a);
            }
        } else { gl.disable(gl.BLEND); }
    }
}

function access<P, R>(
    props: P,
    index: number,
    value: ((props: P, index: number) => R) | R,
): R { return typeof value === "function" ? value(props, index) : value; }
