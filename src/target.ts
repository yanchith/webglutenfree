import * as assert from "./util/assert";
import { State } from "./state";
import {
    Command,
    UniformType,
    UniformDescriptor,
    TextureDescriptor,
} from "./command";
import { ElementPrimitive } from "./element-buffer";
import { Attributes } from "./attributes";
import { Framebuffer } from "./framebuffer";

export enum TargetBufferBitmask {
    COLOR = 0x00004000,
    DEPTH = 0x00000100,
    STENCIL = 0x00000400,
    COLOR_DEPTH = COLOR | DEPTH,
    COLOR_STENCIL = COLOR | STENCIL,
    DEPTH_STENCIL = DEPTH | STENCIL,
    COLOR_DEPTH_STENCIL = COLOR | DEPTH | STENCIL,
}

export enum TargetBlitFilter {
    NEAREST = 0x2600,
    LINEAR = 0x2601,
}

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

export interface TargetBlitOptions {
    srcX?: number;
    srcY?: number;
    srcWidth?: number;
    srcHeight?: number;
    dstX?: number;
    dstY?: number;
    dstWidth?: number;
    dstHeight?: number;
    filter?: TargetBlitFilter;
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
        private state: State,
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
            state,
            glFramebuffer,
            glDrawBuffers,
        } = this;

        // We would overwrite the currently bound DRAW_FRAMEBUFFER unless we
        // checked
        state.bindTarget(this, glFramebuffer, glDrawBuffers);
        cb(this);
        state.unbindTarget();
    }

    /**
     * Clear selected buffers to provided values.
     */
    clear(
        bits: TargetBufferBitmask,
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
                ? this.state.gl.drawingBufferWidth
                : this.surfaceWidth,
            scissorHeight = this.surfaceHeight === void 0
                ? this.state.gl.drawingBufferHeight
                : this.surfaceHeight,
        }: TargetClearOptions = {},
    ): void {
        const { state, state: { gl } } = this;
        state.assertTargetBound(this, "clear");

        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);

        if (bits & TargetBufferBitmask.COLOR) { gl.clearColor(r, g, b, a); }
        if (bits & TargetBufferBitmask.DEPTH) { gl.clearDepth(depth); }
        if (bits & TargetBufferBitmask.STENCIL) { gl.clearStencil(stencil); }
        gl.clear(bits);
    }


    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(
        source: Framebuffer,
        bits: TargetBufferBitmask,
        {
            srcX = 0,
            srcY = 0,
            srcWidth = source.width,
            srcHeight = source.height,
            dstX = 0,
            dstY = 0,
            dstWidth = this.surfaceWidth === void 0
                ? this.state.gl.drawingBufferWidth
                : this.surfaceWidth,
            dstHeight = this.surfaceHeight === void 0
                ? this.state.gl.drawingBufferHeight
                : this.surfaceHeight,
            filter = TargetBlitFilter.NEAREST,
            scissorX = dstX,
            scissorY = dstY,
            scissorWidth = dstWidth,
            scissorHeight = dstHeight,
        }: TargetBlitOptions = {},
    ): void {
        const { state, state: { gl } } = this;
        state.assertTargetBound(this, "blit");

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
        cmd: Command<unknown>,
        attrs: Attributes,
        props?: unknown,
        {
            viewportX = 0,
            viewportY = 0,
            viewportWidth = this.surfaceWidth === void 0
                ? this.state.gl.drawingBufferWidth
                : this.surfaceWidth,
            viewportHeight = this.surfaceHeight === void 0
                ? this.state.gl.drawingBufferHeight
                : this.surfaceHeight,
            scissorX = viewportX,
            scissorY = viewportY,
            scissorWidth = viewportWidth,
            scissorHeight = viewportHeight,
        }: TargetDrawOptions = {},
    ): void {
        const { state, state: { gl } } = this;
        const {
            glProgram,
            depthTestDescr,
            stencilTestDescr,
            blendDescr,
            textureDescrs,
            uniformDescrs,
        } = cmd;

        state.assertTargetBound(this, "draw");
        state.bindCommand(cmd, glProgram);

        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);

        this.textures(textureDescrs, props, 0);
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

        state.unbindCommand();
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
                ? this.state.gl.drawingBufferWidth
                : this.surfaceWidth,
            viewportHeight = this.surfaceHeight === void 0
                ? this.state.gl.drawingBufferHeight
                : this.surfaceHeight,
            scissorX = viewportX,
            scissorY = viewportY,
            scissorWidth = viewportWidth,
            scissorHeight = viewportHeight,
        }: TargetDrawOptions = {},
    ): void {
        const { state, state: { gl } } = this;
        const {
            glProgram,
            depthTestDescr,
            stencilTestDescr,
            blendDescr,
            uniformDescrs,
            textureDescrs,
        } = cmd;

        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch

        state.assertTargetBound(this, "batch-draw");
        state.bindCommand(cmd, glProgram);

        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);

        let i = 0;

        cb((attrs: Attributes, props: P) => {
            // Did the user do anything sneaky?
            state.assertTargetBound(this, "batch-draw");
            state.assertCommandBound(cmd, "batch-draw");
            i++;

            this.uniforms(uniformDescrs, props, i);
            this.textures(textureDescrs, props, i);

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

        state.unbindCommand();
    }

    private drawArrays(
        primitive: ElementPrimitive,
        count: number,
        offset: number,
        instanceCount: number,
    ): void {
        if (instanceCount) {
            this.state.gl.drawArraysInstanced(
                primitive,
                offset,
                count,
                instanceCount,
            );
        } else {
            this.state.gl.drawArrays(primitive, offset, count);
        }
    }

    private drawElements(
        primitive: ElementPrimitive,
        count: number,
        type: number,
        offset: number,
        instCount: number,
    ): void {
        if (instCount) {
            this.state.gl.drawElementsInstanced(
                primitive,
                count,
                type,
                offset,
                instCount,
            );
        } else {
            this.state.gl.drawElements(
                primitive,
                count,
                type,
                offset,
            );
        }
    }

    private uniforms<P>(
        uniformDescrs: UniformDescriptor<P>[],
        props: P,
        index: number,
    ): void {
        const gl = this.state.gl;
        uniformDescrs.forEach(({
            identifier: ident,
            location: loc,
            definition: def,
        }) => {
            switch (def.type) {
                case UniformType.FLOAT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1f(loc, value);
                    } else {
                        gl.uniform1fv(loc, value);
                    }
                    break;
                }
                case UniformType.INT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1i(loc, value);
                    } else {
                        gl.uniform1iv(loc, value);
                    }
                    break;
                }
                case UniformType.UNSIGNED_INT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1ui(loc, value);
                    } else {
                        gl.uniform1uiv(loc, value);
                    }
                    break;
                }
                case UniformType.FLOAT_VEC2:
                    gl.uniform2fv(loc, def.value(props, index));
                    break;
                case UniformType.INT_VEC2:
                    gl.uniform2iv(loc, def.value(props, index));
                    break;
                case UniformType.UNSIGNED_INT_VEC2:
                    gl.uniform2uiv(loc, def.value(props, index));
                    break;
                case UniformType.FLOAT_VEC3:
                    gl.uniform3fv(loc, def.value(props, index));
                    break;
                case UniformType.INT_VEC3:
                    gl.uniform3iv(loc, def.value(props, index));
                    break;
                case UniformType.UNSIGNED_INT_VEC3:
                    gl.uniform3uiv(loc, def.value(props, index));
                    break;
                case UniformType.FLOAT_VEC4:
                    gl.uniform4fv(loc, def.value(props, index));
                    break;
                case UniformType.INT_VEC4:
                    gl.uniform4iv(loc, def.value(props, index));
                    break;
                case UniformType.UNSIGNED_INT_VEC4:
                    gl.uniform4uiv(loc, def.value(props, index));
                    break;
                case UniformType.FLOAT_MAT2:
                    gl.uniformMatrix2fv(loc, false, def.value(props, index));
                    break;
                case UniformType.FLOAT_MAT3:
                    gl.uniformMatrix3fv(loc, false, def.value(props, index));
                    break;
                case UniformType.FLOAT_MAT4:
                    gl.uniformMatrix4fv(loc, false, def.value(props, index));
                    break;
                default:
                    assert.unreachable(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }

    private textures<P>(
        textureDescrs: TextureDescriptor<P>[],
        props: P,
        index: number,
    ): void {
        const gl = this.state.gl;
        textureDescrs.forEach(({ identifier: ident, definition: def }, i) => {
            const tex = typeof def.value === "function"
                ? def.value(props, index)
                : def.value;

            gl.activeTexture(gl.TEXTURE0 + i);
            switch (def.type) {
                case UniformType.SAMPLER_2D:
                    gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
                    break;
                case UniformType.SAMPLER_CUBE:
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex.glTexture);
                    break;
                default:
                    assert.unreachable(
                        def,
                        () => `Unknown texture uniform: ${ident}`,
                    );
                    break;
            }
        });
    }
}
