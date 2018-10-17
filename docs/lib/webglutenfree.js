class DepthTestDescriptor {
    constructor(func, mask, rangeStart, rangeEnd) {
        this.func = func;
        this.mask = mask;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
    }
    static equals(left, right) {
        if (left === right) {
            return true;
        }
        if (!left || !right) {
            return false;
        }
        if (left.func !== right.func) {
            return false;
        }
        if (left.mask !== right.mask) {
            return false;
        }
        if (left.rangeStart !== right.rangeStart) {
            return false;
        }
        if (left.rangeEnd !== right.rangeEnd) {
            return false;
        }
        return true;
    }
}
class StencilTestDescriptor {
    constructor(fFn, bFn, fFnRef, bFnRef, fFnMask, bFnMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass) {
        this.fFn = fFn;
        this.bFn = bFn;
        this.fFnRef = fFnRef;
        this.bFnRef = bFnRef;
        this.fFnMask = fFnMask;
        this.bFnMask = bFnMask;
        this.fMask = fMask;
        this.bMask = bMask;
        this.fOpFail = fOpFail;
        this.bOpFail = bOpFail;
        this.fOpZFail = fOpZFail;
        this.bOpZFail = bOpZFail;
        this.fOpZPass = fOpZPass;
        this.bOpZPass = bOpZPass;
    }
    static equals(left, right) {
        if (left === right) {
            return true;
        }
        if (!left || !right) {
            return false;
        }
        if (left.fFn !== right.fFn) {
            return false;
        }
        if (left.bFn !== right.bFn) {
            return false;
        }
        if (left.fFnRef !== right.fFnRef) {
            return false;
        }
        if (left.bFnRef !== right.bFnRef) {
            return false;
        }
        if (left.fFnMask !== right.fFnMask) {
            return false;
        }
        if (left.bFnMask !== right.bFnMask) {
            return false;
        }
        if (left.fMask !== right.fMask) {
            return false;
        }
        if (left.bMask !== right.bMask) {
            return false;
        }
        if (left.fOpFail !== right.fOpFail) {
            return false;
        }
        if (left.bOpFail !== right.bOpFail) {
            return false;
        }
        if (left.fOpZFail !== right.fOpZFail) {
            return false;
        }
        if (left.bOpZFail !== right.bOpZFail) {
            return false;
        }
        if (left.fOpZPass !== right.fOpZPass) {
            return false;
        }
        if (left.bOpZPass !== right.bOpZPass) {
            return false;
        }
        return true;
    }
}
class BlendDescriptor {
    constructor(srcRGB, srcAlpha, dstRGB, dstAlpha, eqnRGB, eqnAlpha, color) {
        this.srcRGB = srcRGB;
        this.srcAlpha = srcAlpha;
        this.dstRGB = dstRGB;
        this.dstAlpha = dstAlpha;
        this.eqnRGB = eqnRGB;
        this.eqnAlpha = eqnAlpha;
        this.color = color;
    }
    static equals(left, right) {
        if (left === right) {
            return true;
        }
        if (!left || !right) {
            return false;
        }
        if (left.srcRGB !== right.srcRGB) {
            return false;
        }
        if (left.srcAlpha !== right.srcAlpha) {
            return false;
        }
        if (left.dstRGB !== right.dstRGB) {
            return false;
        }
        if (left.dstAlpha !== right.dstAlpha) {
            return false;
        }
        if (left.eqnRGB !== right.eqnRGB) {
            return false;
        }
        if (left.eqnAlpha !== right.eqnAlpha) {
            return false;
        }
        if (left.color === right.color) {
            return true;
        }
        if (!left.color || !right.color) {
            return false;
        }
        if (left.color[0] !== right.color[0]) {
            return false;
        }
        if (left.color[1] !== right.color[1]) {
            return false;
        }
        if (left.color[2] !== right.color[2]) {
            return false;
        }
        if (left.color[3] !== right.color[3]) {
            return false;
        }
        return true;
    }
}
function arrayEquals(left, right) {
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; ++i) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
}
class State {
    constructor(gl) {
        this.target = null;
        this.command = null;
        this.glProgram = null;
        this.glDrawFramebuffer = null;
        this.depthTest = null;
        this.stencilTest = null;
        this.blend = null;
        this.gl = gl;
        this.glDrawBuffers = [gl.BACK];
    }
    setDepthTest(depthTest) {
        if (!DepthTestDescriptor.equals(this.depthTest, depthTest)) {
            this.depthTest = depthTest;
            this.applyDepthTest();
        }
    }
    setStencilTest(stencilTest) {
        if (!StencilTestDescriptor.equals(this.stencilTest, stencilTest)) {
            this.stencilTest = stencilTest;
            this.applyStencilTest();
        }
    }
    setBlend(blend) {
        if (!BlendDescriptor.equals(this.blend, blend)) {
            this.blend = blend;
            this.applyBlend();
        }
    }
    /**
     * Bind a `Target` for this `State`. Each `Device` must have at
     * most one `Target` bound at any time. Nested target binding is not
     * supported even though it is not prohibited by the shape of the API:
     *
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     */
    bindTarget(target, glDrawFramebuffer, glDrawBuffers) {
        if (this.target) {
            throw new Error("Cannot have two Targets bound at the same time");
        }
        const gl = this.gl;
        if (this.glDrawFramebuffer !== glDrawFramebuffer) {
            this.gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, glDrawFramebuffer);
            this.glDrawFramebuffer = glDrawFramebuffer;
        }
        if (!arrayEquals(this.glDrawBuffers, glDrawBuffers)) {
            this.gl.drawBuffers(glDrawBuffers);
            this.glDrawBuffers = glDrawBuffers;
        }
        this.target = target;
    }
    /**
     * Unbind currently bound target. Only forgets the target from `State`,
     * does not unbind the WebGL framebuffer.
     */
    unbindTarget() {
        if (!this.target) {
            throw new Error("Cannot unbind target, none bound");
        }
        this.target = null;
    }
    /**
     * Bind a `Command` for this `State`. Each `Device` must have at
     * most one `Command` bound at any time. Nested command binding is not
     * supported even though it is not prohibited by the shape of the API:
     *
     * // This produces a runtime error
     * dev.target((rt) => {
     *     rt.batch(cmd, (draw) => {
     *         rt.draw(cmd, attrs, props);
     *     });
     * });
     */
    bindCommand(command, glProgram) {
        if (this.command) {
            throw new Error("Cannot have two Commands bound at the same time");
        }
        if (this.glProgram !== glProgram) {
            this.gl.useProgram(glProgram);
            this.glProgram = glProgram;
        }
        this.command = command;
    }
    /**
     * Unbind currently bound command. Only forgets the command from `State`,
     * does not unbind the WebGL program.
     */
    unbindCommand() {
        if (!this.command) {
            throw new Error("Cannot unbind command, none bound");
        }
        this.command = null;
    }
    assertTargetBound(target, op) {
        if (this.target !== target) {
            throw new Error(`Trying to perform ${op}, expected target ${target}, got: ${this.target}`);
        }
    }
    assertCommandBound(command, op) {
        if (this.command !== command) {
            throw new Error(`Trying to perform ${op}, expected command ${command}, got: ${this.command}`);
        }
    }
    assertTargetUnbound() {
        if (this.target) {
            throw new Error("A Target is already bound, cannot bind twice");
        }
    }
    assertCommandUnbound() {
        if (this.command) {
            throw new Error("A Command is already bound, cannot bind twice");
        }
    }
    applyDepthTest() {
        const { gl, depthTest } = this;
        if (depthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(depthTest.func);
            gl.depthMask(depthTest.mask);
            gl.depthRange(depthTest.rangeStart, depthTest.rangeEnd);
        }
        else {
            gl.disable(gl.DEPTH_TEST);
        }
    }
    applyStencilTest() {
        const { gl, stencilTest } = this;
        if (stencilTest) {
            const { fFn, bFn, fFnRef, bFnRef, fFnMask, bFnMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass, } = stencilTest;
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFuncSeparate(gl.FRONT, fFn, fFnRef, fFnMask);
            gl.stencilFuncSeparate(gl.BACK, bFn, bFnRef, bFnMask);
            gl.stencilMaskSeparate(gl.FRONT, fMask);
            gl.stencilMaskSeparate(gl.BACK, bMask);
            gl.stencilOpSeparate(gl.FRONT, fOpFail, fOpZFail, fOpZPass);
            gl.stencilOpSeparate(gl.BACK, bOpFail, bOpZFail, bOpZPass);
        }
        else {
            gl.disable(gl.STENCIL_TEST);
        }
    }
    applyBlend() {
        const { gl, blend } = this;
        if (blend) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(blend.srcRGB, blend.dstRGB, blend.srcAlpha, blend.dstAlpha);
            gl.blendEquationSeparate(blend.eqnRGB, blend.eqnAlpha);
            if (blend.color) {
                const [r, g, b, a] = blend.color;
                gl.blendColor(r, g, b, a);
            }
        }
        else {
            gl.disable(gl.BLEND);
        }
    }
}

// This file contains facilities for determining whether we are currently in a
// debug build. Production builds completely dead-code-eliminate its contents
// and all blocks guarded by `IS_DEBUG_BUILD` throughout the project.
// For nonproduction builds `IS_DEBUG_BUILD` is not eliminated and always
// evaluates to `true`, however, consumers can always perform the
// same dead code elimination further down the road by replacing (or envifying)
// `process.env.NODE_ENV` with "production".
const __OPAQUE_TRUE__ = Math.random() > -1;
const __OPAQUE_ENV__ = __OPAQUE_TRUE__ ? "development" : "production";
const process = { env: { NODE_ENV: __OPAQUE_ENV__ } };
/**
 * Are we in a debug build?
 */
const IS_DEBUG_BUILD = process.env.NODE_ENV !== "production";

function isFalse(got, fmt) {
    const valueIsFalse = got === false;
    if (IS_DEBUG_BUILD) {
        if (!valueIsFalse) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not false`;
            throw new Error(msg);
        }
    }
    return valueIsFalse;
}
function isArray(got, fmt) {
    const valueIsArray = Array.isArray(got);
    if (IS_DEBUG_BUILD) {
        if (!valueIsArray) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not an array`;
            throw new Error(msg);
        }
    }
    return valueIsArray;
}
function nonNull(got, fmt) {
    const valueIsNonNull = typeof got !== "undefined"
        && (typeof got !== "object" || !!got);
    if (IS_DEBUG_BUILD) {
        if (!valueIsNonNull) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
            throw new Error(msg);
        }
    }
    return valueIsNonNull;
}
function nonEmpty(got, fmt) {
    const valueIsNonEmpty = !!got.length;
    if (IS_DEBUG_BUILD) {
        if (!valueIsNonEmpty) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array value empty`;
            throw new Error(msg);
        }
    }
    return valueIsNonEmpty;
}
function equal(got, expected, fmt) {
    const valuesAreEqual = got === expected;
    if (IS_DEBUG_BUILD) {
        if (!valuesAreEqual) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not equal to ${expected}`;
            throw new Error(msg);
        }
    }
    return valuesAreEqual;
}
function oneOf(got, expected, fmt) {
    const valueIsOneOf = expected.includes(got);
    if (IS_DEBUG_BUILD) {
        if (!valueIsOneOf) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not in ${expected}`;
            throw new Error(msg);
        }
    }
    return valueIsOneOf;
}
function gt(got, low, fmt) {
    const valueIsGt = got > low;
    if (IS_DEBUG_BUILD) {
        if (!valueIsGt) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not GT than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueIsGt;
}
function rangeInclusive(got, low, high, fmt) {
    const valueIsInRangeInclusive = got >= low && got <= high;
    if (IS_DEBUG_BUILD) {
        if (!valueIsInRangeInclusive) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
    return valueIsInRangeInclusive;
}
function unreachable(got, fmt) {
    // "unreachable" can not be eliminated, as its "return value" is
    // captured by the type system at the callsite for control-flow analysis.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
    throw new Error(msg);
}

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
class Target {
    constructor(state, glDrawBuffers, glFramebuffer, surfaceWidth, surfaceHeight) {
        this.state = state;
        this.glDrawBuffers = glDrawBuffers;
        this.glFramebuffer = glFramebuffer;
        this.surfaceWidth = surfaceWidth;
        this.surfaceHeight = surfaceHeight;
    }
    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     *
     * All writes/drawing to the target MUST be done within the callback.
     */
    with(cb) {
        const { state, glFramebuffer, glDrawBuffers, } = this;
        // We would overwrite the currently bound DRAW_FRAMEBUFFER unless we
        // checked
        state.bindTarget(this, glFramebuffer, glDrawBuffers);
        cb(this);
        state.unbindTarget();
    }
    /**
     * Clear selected buffers to provided values.
     */
    clear(bits, { r = 0, g = 0, b = 0, a = 1, depth = 1, stencil = 0, scissorX = 0, scissorY = 0, scissorWidth = this.surfaceWidth === void 0
        ? this.state.gl.drawingBufferWidth
        : this.surfaceWidth, scissorHeight = this.surfaceHeight === void 0
        ? this.state.gl.drawingBufferHeight
        : this.surfaceHeight, } = {}) {
        const { state, state: { gl } } = this;
        state.assertTargetBound(this, "clear");
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
        if (bits & 16384 /* COLOR */) {
            gl.clearColor(r, g, b, a);
        }
        if (bits & 256 /* DEPTH */) {
            gl.clearDepth(depth);
        }
        if (bits & 1024 /* STENCIL */) {
            gl.clearStencil(stencil);
        }
        gl.clear(bits);
    }
    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(source, bits, { srcX = 0, srcY = 0, srcWidth = source.width, srcHeight = source.height, dstX = 0, dstY = 0, dstWidth = this.surfaceWidth === void 0
        ? this.state.gl.drawingBufferWidth
        : this.surfaceWidth, dstHeight = this.surfaceHeight === void 0
        ? this.state.gl.drawingBufferHeight
        : this.surfaceHeight, filter = 9728 /* NEAREST */, scissorX = dstX, scissorY = dstY, scissorWidth = dstWidth, scissorHeight = dstHeight, } = {}) {
        const { state, state: { gl } } = this;
        state.assertTargetBound(this, "blit");
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, source.glFramebuffer);
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
        gl.blitFramebuffer(srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, bits, filter);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    }
    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     *
     * This is a unified header to stisfy the typechecker.
     */
    draw(cmd, attrs, props, { viewportX = 0, viewportY = 0, viewportWidth = this.surfaceWidth === void 0
        ? this.state.gl.drawingBufferWidth
        : this.surfaceWidth, viewportHeight = this.surfaceHeight === void 0
        ? this.state.gl.drawingBufferHeight
        : this.surfaceHeight, scissorX = viewportX, scissorY = viewportY, scissorWidth = viewportWidth, scissorHeight = viewportHeight, } = {}) {
        const { state, state: { gl } } = this;
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
        state.assertTargetBound(this, "draw");
        state.bindCommand(cmd, glProgram);
        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);
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
            this.drawElements(attrs.primitive, attrs.elementCount, attrs.indexType, 0, // offset
            attrs.instanceCount);
        }
        else {
            this.drawArrays(attrs.primitive, attrs.count, 0, // offset
            attrs.instanceCount);
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
    batch(cmd, cb, { viewportX = 0, viewportY = 0, viewportWidth = this.surfaceWidth === void 0
        ? this.state.gl.drawingBufferWidth
        : this.surfaceWidth, viewportHeight = this.surfaceHeight === void 0
        ? this.state.gl.drawingBufferHeight
        : this.surfaceHeight, scissorX = viewportX, scissorY = viewportY, scissorWidth = viewportWidth, scissorHeight = viewportHeight, } = {}) {
        const { state, state: { gl } } = this;
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch
        state.assertTargetBound(this, "batch-draw");
        state.bindCommand(cmd, glProgram);
        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);
        let i = 0;
        cb((attrs, props) => {
            // Did the user do anything sneaky?
            state.assertTargetBound(this, "batch-draw");
            state.assertCommandBound(cmd, "batch-draw");
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
                this.drawElements(attrs.primitive, attrs.elementCount, attrs.indexType, 0, // offset
                attrs.instanceCount);
            }
            else {
                this.drawArrays(attrs.primitive, attrs.count, 0, // offset
                attrs.instanceCount);
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
    drawArrays(primitive, count, offset, instanceCount) {
        if (instanceCount) {
            this.state.gl.drawArraysInstanced(primitive, offset, count, instanceCount);
        }
        else {
            this.state.gl.drawArrays(primitive, offset, count);
        }
    }
    drawElements(primitive, count, type, offset, instCount) {
        if (instCount) {
            this.state.gl.drawElementsInstanced(primitive, count, type, offset, instCount);
        }
        else {
            this.state.gl.drawElements(primitive, count, type, offset);
        }
    }
    textures(textureAccessors, props, index) {
        const gl = this.state.gl;
        textureAccessors.forEach((accessor, i) => {
            const tex = access(props, index, accessor);
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
        });
    }
    uniforms(uniformDescrs, props, index) {
        const gl = this.state.gl;
        uniformDescrs.forEach(({ identifier: ident, location: loc, definition: def, }) => {
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
                    gl.uniformMatrix2fv(loc, false, access(props, index, def.value));
                    break;
                case "matrix3fv":
                    gl.uniformMatrix3fv(loc, false, access(props, index, def.value));
                    break;
                case "matrix4fv":
                    gl.uniformMatrix4fv(loc, false, access(props, index, def.value));
                    break;
                default:
                    unreachable(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }
}
function access(props, index, value) {
    return typeof value === "function"
        ? value(props, index)
        : value;
}

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
function _createCommand(state, vert, frag, { textures = {}, uniforms = {}, depth, stencil, blend, } = {}) {
    nonNull(vert, fmtParamNonNull("vert"));
    nonNull(frag, fmtParamNonNull("frag"));
    const depthDescr = parseDepth(depth);
    const stencilDescr = parseStencil(stencil);
    const blendDescr = parseBlend(blend);
    return new Command(state, vert, frag, textures, uniforms, depthDescr, stencilDescr, blendDescr);
}
class Command {
    constructor(state, vsSource, fsSource, textures, uniforms, depthDescr, stencilDescr, blendDescr) {
        this.state = state;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.textures = textures;
        this.uniforms = uniforms;
        this.depthTestDescr = depthDescr || null;
        this.stencilTestDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;
        this.init();
    }
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore() {
        const { state: { gl }, glProgram } = this;
        if (!gl.isProgram(glProgram)) {
            this.init();
        }
    }
    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes) {
        const { state: { gl }, glProgram } = this;
        return Object.entries(attributes)
            .reduce((accum, [identifier, definition]) => {
            if (INT_PATTERN.test(identifier)) {
                accum[identifier] = definition;
            }
            else {
                const location = gl.getAttribLocation(glProgram, identifier);
                if (location === UNKNOWN_ATTRIB_LOCATION) {
                    throw new Error(`No location for attrib: ${identifier}`);
                }
                accum[location] = definition;
            }
            return accum;
        }, {});
    }
    init() {
        const { state, state: { gl }, vsSource, fsSource, textures, uniforms, } = this;
        // We would overwrite the currently bound program unless we checked
        state.assertCommandUnbound();
        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        // Validation time! (only for nonproduction envs)
        if (IS_DEBUG_BUILD) {
            if (!prog) {
                // ctx loss or not, we can panic all we want in nonprod env!
                throw new Error("Program was not compiled, possible reason: context loss");
            }
            validateUniformDeclarations(gl, prog, uniforms, textures);
        }
        gl.useProgram(prog);
        // Texture declarations are evaluated in two phases:
        // 1) Sampler location offsets are sent to the shader eagerly. This is
        //    ok because even if the textures themselves can change (function
        //    accessors), their offsets stay the same
        // 2) Textures provided by the accessor are activated and bound to their
        //    locations at draw time
        // Note: Object.entries() provides values in a nondeterministic order,
        // but we store the descriptors in an array, remembering the order.
        const textureAccessors = [];
        Object.entries(textures).forEach(([ident, t], i) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for sampler: ${ident}`);
            }
            gl.uniform1i(loc, i);
            textureAccessors.push(t);
        });
        // Some uniform declarations can be evaluated right away, so do it at
        // init-time. Create a descriptor for the rest that is evaluated at
        // render-time.
        const uniformDescrs = [];
        Object.entries(uniforms).forEach(([ident, u]) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }
            if (typeof u.value !== "function") {
                // Eagerly send everything we can process now to GPU
                switch (u.type) {
                    case "1f":
                        gl.uniform1f(loc, u.value);
                        break;
                    case "1fv":
                        gl.uniform1fv(loc, u.value);
                        break;
                    case "1i":
                        gl.uniform1i(loc, u.value);
                        break;
                    case "1iv":
                        gl.uniform1iv(loc, u.value);
                        break;
                    case "1ui":
                        gl.uniform1ui(loc, u.value);
                        break;
                    case "1uiv":
                        gl.uniform1uiv(loc, u.value);
                        break;
                    case "2f": {
                        const [x, y] = u.value;
                        gl.uniform2f(loc, x, y);
                        break;
                    }
                    case "2fv":
                        gl.uniform2fv(loc, u.value);
                        break;
                    case "2i": {
                        const [x, y] = u.value;
                        gl.uniform2i(loc, x, y);
                        break;
                    }
                    case "2iv":
                        gl.uniform2iv(loc, u.value);
                        break;
                    case "2ui": {
                        const [x, y] = u.value;
                        gl.uniform2ui(loc, x, y);
                        break;
                    }
                    case "2uiv":
                        gl.uniform2uiv(loc, u.value);
                        break;
                    case "3f": {
                        const [x, y, z] = u.value;
                        gl.uniform3f(loc, x, y, z);
                        break;
                    }
                    case "3fv":
                        gl.uniform3fv(loc, u.value);
                        break;
                    case "3i": {
                        const [x, y, z] = u.value;
                        gl.uniform3i(loc, x, y, z);
                        break;
                    }
                    case "3iv":
                        gl.uniform3iv(loc, u.value);
                        break;
                    case "3ui": {
                        const [x, y, z] = u.value;
                        gl.uniform3ui(loc, x, y, z);
                        break;
                    }
                    case "3uiv":
                        gl.uniform3uiv(loc, u.value);
                        break;
                    case "4f": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4f(loc, x, y, z, w);
                        break;
                    }
                    case "4fv":
                        gl.uniform4fv(loc, u.value);
                        break;
                    case "4i": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4i(loc, x, y, z, w);
                        break;
                    }
                    case "4iv":
                        gl.uniform4iv(loc, u.value);
                        break;
                    case "4ui": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4ui(loc, x, y, z, w);
                        break;
                    }
                    case "4uiv":
                        gl.uniform4uiv(loc, u.value);
                        break;
                    case "matrix2fv":
                        gl.uniformMatrix2fv(loc, false, u.value);
                        break;
                    case "matrix3fv":
                        gl.uniformMatrix3fv(loc, false, u.value);
                        break;
                    case "matrix4fv":
                        gl.uniformMatrix4fv(loc, false, u.value);
                        break;
                    default: unreachable(u);
                }
            }
            else {
                // Store a descriptor for lazy values for later use
                uniformDescrs.push(new UniformDescriptor(ident, loc, u));
            }
        });
        gl.useProgram(null);
        this.glProgram = prog;
        this.textureAccessors = textureAccessors;
        this.uniformDescrs = uniformDescrs;
    }
}
class UniformDescriptor {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}
function createProgram(gl, vertex, fragment) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("Could not create WebGL program");
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (gl.isContextLost() || linked) {
        return program;
    }
    const msg = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link shader program: ${msg}`);
}
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Could not create WebGL shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (gl.isContextLost() || compiled) {
        return shader;
    }
    const msg = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    const prettySource = source
        .split("\n")
        .map((l, i) => `${i + 1}: ${l}`)
        .join("\n");
    throw new Error(`Could not compile shader:\n${msg}\n${prettySource}`);
}
/**
 * Check whether the uniforms declared in shaders and command strictly match.
 * There may be no missing or redundant uniforms on either side and types of
 * provided uniforms must match exactly
 */
function validateUniformDeclarations(gl, prog, uniforms, textures) {
    const nUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    const progUniforms = new Map();
    // Note: gl.getUniformLocation accepts a shorthand for uniform names of
    // basic type arrays (trailing "[0]" can be omitted). Because
    // gl.getActiveUniforms always gives us the full name, we need to widen
    // our mathing to accept the shorthands and pair them with the introspected
    // WebGLActiveInfos
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation
    const shorthands = new Map();
    for (let i = 0; i < nUniforms; ++i) {
        const info = gl.getActiveUniform(prog, i);
        progUniforms.set(info.name, info);
        if (info.name.endsWith("[0]")) {
            const shorthand = info.name.substring(0, info.name.length - 3);
            shorthands.set(shorthand, info.name);
        }
    }
    // The "list" of uniforms left to check from the program's perspective
    const toCheck = new Set(progUniforms.keys());
    Object.entries(uniforms).map(([name, tyObj]) => {
        const type = tyObj.type;
        // TODO: should we assert array uniforms if we discover it in their names?
        const shorthand = shorthands.has(name) && shorthands.get(name);
        const progUniform = progUniforms.has(name)
            ? progUniforms.get(name)
            : shorthand && progUniforms.has(shorthand)
                ? progUniforms.get(shorthands.get(name))
                : null;
        if (progUniform) {
            validateUniformDeclaration(gl, progUniform, type);
        }
        else {
            throw new Error(`Redundant uniform [name = ${name}, type = ${type}]`);
        }
        if (shorthand) {
            toCheck.delete(shorthand);
        }
        else {
            toCheck.delete(name);
        }
    });
    Object.keys(textures).map((name) => {
        if (progUniforms.has(name)) {
            const progUniform = progUniforms.get(name);
            validateUniformDeclaration(gl, progUniform, "1i");
        }
        else {
            throw new Error(`Redundant texture [name = ${name}]`);
        }
        toCheck.delete(name);
    });
    if (toCheck.size) {
        const names = [...toCheck].join(", ");
        throw new Error(`Missing uniforms: ${names}`);
    }
}
function validateUniformDeclaration(gl, info, type) {
    switch (type) {
        case "1f":
            equal(info.type, gl.FLOAT, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "1fv":
            equal(info.type, gl.FLOAT, fmtTyMismatch(info.name));
            break;
        case "1i":
            oneOf(info.type, [
                gl.INT,
                gl.SAMPLER_2D,
            ], fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "1iv":
            equal(info.type, gl.INT, fmtTyMismatch(info.name));
            break;
        case "1ui":
            equal(info.type, gl.UNSIGNED_INT, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "1uiv":
            equal(info.type, gl.UNSIGNED_INT, fmtTyMismatch(info.name));
            break;
        case "2f":
            equal(info.type, gl.FLOAT_VEC2, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "2fv":
            equal(info.type, gl.FLOAT_VEC2, fmtTyMismatch(info.name));
            break;
        case "2i":
            equal(info.type, gl.INT_VEC2, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "2iv":
            equal(info.type, gl.INT_VEC2, fmtTyMismatch(info.name));
            break;
        case "2ui":
            equal(info.type, gl.UNSIGNED_INT_VEC2, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "2uiv":
            equal(info.type, gl.UNSIGNED_INT_VEC2, fmtTyMismatch(info.name));
            break;
        case "3f":
            equal(info.type, gl.FLOAT_VEC3, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "3fv":
            equal(info.type, gl.FLOAT_VEC3, fmtTyMismatch(info.name));
            break;
        case "3i":
            equal(info.type, gl.INT_VEC3, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "3iv":
            equal(info.type, gl.INT_VEC3, fmtTyMismatch(info.name));
            break;
        case "3ui":
            equal(info.type, gl.UNSIGNED_INT_VEC3, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "3uiv":
            equal(info.type, gl.UNSIGNED_INT_VEC3, fmtTyMismatch(info.name));
            break;
        case "4f":
            equal(info.type, gl.FLOAT_VEC4, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "4fv":
            equal(info.type, gl.FLOAT_VEC4, fmtTyMismatch(info.name));
            break;
        case "4i":
            equal(info.type, gl.INT_VEC4, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "4iv":
            equal(info.type, gl.INT_VEC4, fmtTyMismatch(info.name));
            break;
        case "4ui":
            equal(info.type, gl.UNSIGNED_INT_VEC4, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "4uiv":
            equal(info.type, gl.UNSIGNED_INT_VEC4, fmtTyMismatch(info.name));
            break;
        case "matrix2fv":
            equal(info.type, gl.FLOAT_MAT2, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "matrix3fv":
            equal(info.type, gl.FLOAT_MAT3, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        case "matrix4fv":
            equal(info.type, gl.FLOAT_MAT4, fmtTyMismatch(info.name));
            equal(info.size, 1);
            break;
        default: unreachable(type);
    }
}
function parseDepth(depth) {
    if (!depth) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        nonNull(depth.func, fmtParamNonNull("depth.func"));
    }
    return new DepthTestDescriptor(depth.func || 513 /* LESS */, typeof depth.mask === "boolean" ? depth.mask : true, depth.range ? depth.range[0] : 0, depth.range ? depth.range[1] : 1);
}
function parseStencil(stencil) {
    if (!stencil) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        nonNull(stencil.func, fmtParamNonNull("stencil.func"));
    }
    // TODO: complete stencil validation
    return new StencilTestDescriptor(typeof stencil.func.func === "object"
        ? stencil.func.func.front
        : stencil.func.func, typeof stencil.func.func === "object"
        ? stencil.func.func.back
        : stencil.func.func, typeof stencil.func.ref !== "undefined"
        ? typeof stencil.func.ref === "object"
            ? stencil.func.ref.front
            : stencil.func.ref
        : 1, typeof stencil.func.ref !== "undefined"
        ? typeof stencil.func.ref === "object"
            ? stencil.func.ref.back
            : stencil.func.ref
        : 1, typeof stencil.func.mask !== "undefined"
        ? typeof stencil.func.mask === "object"
            ? stencil.func.mask.front
            : stencil.func.mask
        : 0xFF, typeof stencil.func.mask !== "undefined"
        ? typeof stencil.func.mask === "object"
            ? stencil.func.mask.back
            : stencil.func.mask
        : 0xFF, typeof stencil.mask !== "undefined"
        ? typeof stencil.mask === "object"
            ? stencil.mask.front
            : stencil.mask
        : 0xFF, typeof stencil.mask !== "undefined"
        ? typeof stencil.mask === "object"
            ? stencil.mask.back
            : stencil.mask
        : 0xFF, stencil.op
        ? typeof stencil.op.fail === "object"
            ? stencil.op.fail.front
            : stencil.op.fail
        : 7680 /* KEEP */, stencil.op
        ? typeof stencil.op.fail === "object"
            ? stencil.op.fail.back
            : stencil.op.fail
        : 7680 /* KEEP */, stencil.op
        ? typeof stencil.op.zfail === "object"
            ? stencil.op.zfail.front
            : stencil.op.zfail
        : 7680 /* KEEP */, stencil.op
        ? typeof stencil.op.zfail === "object"
            ? stencil.op.zfail.back
            : stencil.op.zfail
        : 7680 /* KEEP */, stencil.op
        ? typeof stencil.op.zpass === "object"
            ? stencil.op.zpass.front
            : stencil.op.zpass
        : 7680 /* KEEP */, stencil.op
        ? typeof stencil.op.zpass === "object"
            ? stencil.op.zpass.back
            : stencil.op.zpass
        : 7680 /* KEEP */);
}
function parseBlend(blend) {
    if (!blend) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        nonNull(blend.func, fmtParamNonNull("blend.func"));
        nonNull(blend.func.src, fmtParamNonNull("blend.func.src"));
        nonNull(blend.func.dst, fmtParamNonNull("blend.func.dst"));
        if (typeof blend.func.src === "object") {
            nonNull(blend.func.src.rgb, fmtParamNonNull("blend.func.src.rgb"));
            nonNull(blend.func.src.alpha, fmtParamNonNull("blend.func.src.alpha"));
        }
        if (typeof blend.func.dst === "object") {
            nonNull(blend.func.dst.rgb, fmtParamNonNull("blend.func.dst.rgb"));
            nonNull(blend.func.dst.alpha, fmtParamNonNull("blend.func.dst.alpha"));
        }
    }
    return new BlendDescriptor(typeof blend.func.src === "object"
        ? blend.func.src.rgb
        : blend.func.src, typeof blend.func.src === "object"
        ? blend.func.src.alpha
        : blend.func.src, typeof blend.func.dst === "object"
        ? blend.func.dst.rgb
        : blend.func.dst, typeof blend.func.dst === "object"
        ? blend.func.dst.alpha
        : blend.func.dst, blend.equation
        ? typeof blend.equation === "object"
            ? blend.equation.rgb
            : blend.equation
        : 32774 /* FUNC_ADD */, blend.equation
        ? typeof blend.equation === "object"
            ? blend.equation.alpha
            : blend.equation
        : 32774 /* FUNC_ADD */, blend.color);
}
function fmtParamNonNull(name) {
    return () => `Missing parameter ${name}`;
}
function fmtTyMismatch(name) {
    return () => `Type mismatch for uniform field ${name}`;
}

function _createVertexBuffer(gl, type, size, { usage = 35048 /* DYNAMIC_DRAW */ } = {}) {
    return new VertexBuffer(gl, type, size, size * sizeOf(type), usage);
}
function _createVertexBufferWithTypedArray(gl, type, data, { usage = 35044 /* STATIC_DRAW */ } = {}) {
    return new VertexBuffer(gl, type, data.length, data.byteLength, usage).store(data);
}
/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
class VertexBuffer {
    constructor(gl, type, length, byteLength, usage) {
        this.gl = gl;
        this.type = type;
        this.length = length;
        this.byteLength = byteLength;
        this.usage = usage;
        this.glBuffer = null;
        this.init();
    }
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore() {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) {
            this.init();
        }
    }
    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(data, { offset = 0 } = {}) {
        const { gl, glBuffer } = this;
        // WebGL bug causes Uint8ClampedArray to be read incorrectly
        // https://github.com/KhronosGroup/WebGL/issues/1533
        const buffer = data instanceof Uint8ClampedArray
            // Both buffers are u8 -> do not copy, just change lens
            ? new Uint8Array(data.buffer)
            // Other buffer types are fine
            : data;
        const byteOffset = buffer.BYTES_PER_ELEMENT * offset;
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return this;
    }
    init() {
        const { usage, byteLength, gl } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, byteLength, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.glBuffer = buffer;
    }
}
function sizeOf(type) {
    switch (type) {
        case 5120 /* BYTE */:
        case 5121 /* UNSIGNED_BYTE */:
            return 1;
        case 5122 /* SHORT */:
        case 5123 /* UNSIGNED_SHORT */:
            return 2;
        case 5124 /* INT */:
        case 5125 /* UNSIGNED_INT */:
        case 5126 /* FLOAT */:
            return 4;
        default: return unreachable(type);
    }
}

/**
 * Checks whether array has at least two dimensions.
 * Asserts array is not jagged. Only checks first two dimensions.
 * Returns false if array is degenerate (either dimension is 0), as 0d array
 * is not 2d array.
 */
function is2(array) {
    if (!array.length) {
        return false;
    }
    const length2 = Array.isArray(array[0]) ? array[0].length : -1;
    if (IS_DEBUG_BUILD) {
        array.forEach((sub) => {
            if (length2 !== -1) {
                if (isArray(sub)) {
                    equal(sub.length, length2);
                }
            }
            else {
                isFalse(Array.isArray(sub));
            }
        });
    }
    // if length2 === 0, array is degenerate
    // if length2 === -1, array is 1d
    return length2 > 0;
}
/**
 * Returns first two dimensions of array. Assumes nonjagged array and does no
 * checks to prove so. Accepts degenerate arrays.
 */
function shape2(array) {
    const outer = array.length;
    const inner = outer ? array[0].length : 0;
    return [outer, inner];
}
/**
 * Take an unraveled 2d array and a shape. Returns new flat array with all
 * elements from the original unraveled array. Assumes unraveled array is not
 * jagged and shape matches the unraveled dimensions and makes no checks to
 * prove so. Accepts degenerate arrays if shape matches them.
 */
function ravel2(unraveled, shape) {
    const [outer, inner] = shape;
    const raveled = new Array(inner * outer);
    unraveled.forEach((arr, i) => {
        arr.forEach((elem, j) => {
            raveled[inner * i + j] = elem;
        });
    });
    return raveled;
}

function _createElementBuffer(gl, type, primitive, size, { usage = 35048 /* DYNAMIC_DRAW */ } = {}) {
    return new ElementBuffer(gl, type, primitive, size, size * sizeOf$1(type), usage);
}
function _createElementBufferWithArray(gl, data, options) {
    if (is2(data)) {
        const shape = shape2(data);
        rangeInclusive(shape[1], 2, 3, (p) => {
            return `Elements must be 2-tuples or 3-tuples, got ${p}-tuple`;
        });
        const ravel = ravel2(data, shape);
        const primitive = shape[1] === 3
            ? 4 /* TRIANGLE_LIST */
            : 1 /* LINE_LIST */;
        return _createElementBufferWithTypedArray(gl, 5125 /* UNSIGNED_INT */, primitive, new Uint32Array(ravel), options);
    }
    return _createElementBufferWithTypedArray(gl, 5125 /* UNSIGNED_INT */, 0 /* POINT_LIST */, new Uint32Array(data), options);
}
function _createElementBufferWithTypedArray(gl, type, primitive, data, { usage = 35044 /* STATIC_DRAW */ } = {}) {
    return new ElementBuffer(gl, type, primitive, data.length, data.length * sizeOf$1(type), usage).store(data);
}
/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
class ElementBuffer {
    constructor(gl, type, primitive, length, byteLength, usage) {
        this.gl = gl;
        this.type = type;
        this.primitive = primitive;
        this.length = length;
        this.byteLength = byteLength;
        this.usage = usage;
        this.glBuffer = null;
        this.init();
    }
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore() {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) {
            this.init();
        }
    }
    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(data, { offset = 0 } = {}) {
        const { gl, glBuffer } = this;
        // WebGL bug causes Uint8ClampedArray to be read incorrectly
        // https://github.com/KhronosGroup/WebGL/issues/1533
        const buffer = data instanceof Uint8ClampedArray
            // Both buffers are u8 -> do not copy, just change lens
            ? new Uint8Array(data.buffer)
            // Other buffer types are fine
            : data;
        const byteOffset = buffer.BYTES_PER_ELEMENT * offset;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this;
    }
    init() {
        const { usage, byteLength, gl } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, byteLength, usage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.glBuffer = buffer;
    }
}
function sizeOf$1(type) {
    switch (type) {
        case 5121 /* UNSIGNED_BYTE */:
            return 1;
        case 5123 /* UNSIGNED_SHORT */:
            return 2;
        case 5125 /* UNSIGNED_INT */:
            return 4;
        default: return unreachable(type);
    }
}

const INT_PATTERN$1 = /^0|[1-9]\d*$/;
function _createAttributes(state, elements, attributes, { countLimit } = {}) {
    if (typeof countLimit === "number") {
        gt(countLimit, 0, (p) => {
            return `Count limit must be greater than 0, got: ${p}`;
        });
    }
    const attrs = Object.entries(attributes)
        .map(([locationStr, definition]) => {
        if (!INT_PATTERN$1.test(locationStr)) {
            throw new Error("Location not a number. Use Command#locate");
        }
        const location = parseInt(locationStr, 10);
        if (Array.isArray(definition)) {
            if (is2(definition)) {
                const s = shape2(definition);
                const r = ravel2(definition, s);
                return new AttributeDescriptor(location, "pointer" /* POINTER */, _createVertexBufferWithTypedArray(state.gl, 5126 /* FLOAT */, new Float32Array(r)), s[0], s[1], false, 0);
            }
            return new AttributeDescriptor(location, "pointer" /* POINTER */, _createVertexBufferWithTypedArray(state.gl, 5126 /* FLOAT */, new Float32Array(definition)), definition.length, 1, false, 0);
        }
        return new AttributeDescriptor(location, definition.type, definition.buffer, definition.count, definition.size, definition.type === "pointer" /* POINTER */
            ? (definition.normalized || false)
            : false, definition.divisor || 0);
    });
    let primitive;
    let elementBuffer;
    if (typeof elements === "number") {
        primitive = elements;
    }
    else {
        elementBuffer = elements instanceof ElementBuffer
            ? elements
            : _createElementBufferWithArray(state.gl, elements);
        primitive = elementBuffer.primitive;
    }
    const inferredCount = elementBuffer
        ? elementBuffer.length
        : attrs.length
            ? attrs
                .map((attr) => attr.count)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
    const count = typeof countLimit === "number"
        ? Math.min(countLimit, inferredCount)
        : inferredCount;
    const instAttrs = attrs.filter((attr) => !!attr.divisor);
    const instanceCount = instAttrs.length
        ? instAttrs
            .map((attr) => attr.count * attr.divisor)
            .reduce((min, curr) => Math.min(min, curr))
        : 0;
    return new Attributes(state, primitive, attrs, count, instanceCount, elementBuffer);
}
/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
class Attributes {
    constructor(state, primitive, attributes, count, instanceCount, elements) {
        this.state = state;
        this.primitive = primitive;
        this.elementBuffer = elements;
        this.attributes = attributes;
        this.count = count;
        this.elementCount = elements ? elements.length : 0;
        this.instanceCount = instanceCount;
        this.glVertexArray = null;
        this.init();
    }
    get indexed() {
        return !!this.elementBuffer;
    }
    get indexType() {
        return this.elementBuffer && this.elementBuffer.type;
    }
    /**
     * Reinitialize invalid vertex array, eg. after context is lost. Also tries
     * to reinitialize vertex buffer and element buffer dependencies.
     */
    restore() {
        const { state: { gl }, glVertexArray, attributes, elementBuffer } = this;
        if (elementBuffer) {
            elementBuffer.restore();
        }
        attributes.forEach((attr) => attr.buffer.restore());
        // If we have no attributes nor elements, there is no need to restore
        // any GPU state
        if (this.hasAttribs() && !gl.isVertexArray(glVertexArray)) {
            this.init();
        }
    }
    init() {
        // Do not create the gl vao if there are no buffers to bind
        if (!this.hasAttribs()) {
            return;
        }
        const { state: { gl }, attributes, elementBuffer } = this;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        attributes.forEach(({ location, type, buffer: { glBuffer, type: glBufferType }, size, normalized = false, divisor, }) => {
            // Enable sending attribute arrays for location
            gl.enableVertexAttribArray(location);
            // Send buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
            switch (type) {
                case "pointer" /* POINTER */:
                    gl.vertexAttribPointer(location, size, glBufferType, normalized, 0, 0);
                    break;
                case "ipointer" /* IPOINTER */:
                    gl.vertexAttribIPointer(location, size, glBufferType, 0, 0);
                    break;
                default: unreachable(type);
            }
            if (divisor) {
                gl.vertexAttribDivisor(location, divisor);
            }
        });
        if (elementBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer.glBuffer);
        }
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (elementBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
        this.glVertexArray = vao;
    }
    hasAttribs() {
        // IF we have either attributes or elements, this geometry can not
        // longer be considered empty.
        return !!this.elementBuffer || !!this.attributes.length;
    }
}
class AttributeDescriptor {
    constructor(location, type, buffer, count, size, normalized, divisor) {
        this.location = location;
        this.type = type;
        this.buffer = buffer;
        this.count = count;
        this.size = size;
        this.normalized = normalized;
        this.divisor = divisor;
    }
}

function _createTexture(gl, width, height, storageFormat, { min = 9728 /* NEAREST */, mag = 9728 /* NEAREST */, wrapS = 33071 /* CLAMP_TO_EDGE */, wrapT = 33071 /* CLAMP_TO_EDGE */, } = {}) {
    return new Texture(gl, width, height, storageFormat, wrapS, wrapT, min, mag);
}
function _createTextureWithTypedArray(gl, width, height, storageFormat, data, dataFormat, dataType, options = {}) {
    const { min = 9728 /* NEAREST */, mag = 9728 /* NEAREST */, wrapS = 33071 /* CLAMP_TO_EDGE */, wrapT = 33071 /* CLAMP_TO_EDGE */, } = options;
    return new Texture(gl, width, height, storageFormat, wrapS, wrapT, min, mag).store(data, dataFormat, dataType, options);
}
/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type.
 */
class Texture {
    constructor(gl, width, height, storageFormat, wrapS, wrapT, minFilter, magFilter) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.glTexture = null;
        this.init();
    }
    /**
     * Reinitialize invalid texture, eg. after context is lost.
     */
    restore() {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) {
            this.init();
        }
    }
    /**
     * Upload new data to texture. Does not take ownership of data.
     */
    store(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        // This pixel row alignment is theoretically smaller than needed
        // TODO: find greatest correct unpack alignment for pixel rows
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, data.BYTES_PER_ELEMENT);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, // level
        xOffset, yOffset, width, height, format, type, 
        // WebGL bug causes Uint8ClampedArray to be read incorrectly
        // https://github.com/KhronosGroup/WebGL/issues/1533
        data instanceof Uint8ClampedArray
            // Both buffers are u8 -> do not copy, just change lens
            ? new Uint8Array(data.buffer)
            // Other buffer types are fine
            : data);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        return this;
    }
    /**
     * Generate mipmap levels for the current data.
     */
    mipmap() {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    init() {
        const { gl, width, height, storageFormat, wrapS, wrapT, minFilter, magFilter, } = this;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texStorage2D(gl.TEXTURE_2D, 1, storageFormat, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.glTexture = texture;
    }
}

function _createFramebuffer(state, width, height, color, depthStencil) {
    const colors = Array.isArray(color) ? color : [color];
    if (IS_DEBUG_BUILD) {
        nonEmpty(colors, () => {
            return "Framebuffer color attachments must not be empty";
        });
        colors.forEach((buffer) => {
            equal(width, buffer.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            equal(height, buffer.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        });
        if (depthStencil) {
            equal(width, depthStencil.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            equal(height, depthStencil.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }
    }
    return new Framebuffer(state, width, height, colors, depthStencil);
}
/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
class Framebuffer {
    constructor(state, width, height, colors, depthStencil) {
        this.state = state;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.depthStencil = depthStencil;
        this.glColorAttachments = colors
            .map((_, i) => state.gl.COLOR_ATTACHMENT0 + i);
        this.glFramebuffer = null;
        this.framebufferTarget = null;
        this.init();
    }
    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore() {
        const { state: { gl }, glFramebuffer, colors, depthStencil, } = this;
        colors.forEach((buffer) => buffer.restore());
        if (depthStencil) {
            depthStencil.restore();
        }
        if (!gl.isFramebuffer(glFramebuffer)) {
            this.init();
        }
    }
    /**
     * Request a render target from this framebuffer to draw into. The target
     * will contain all attached color buffers.
     *
     * Drawing should be done within the callback by
     * calling `ratget.clear()` or `target.draw()` family of methods.
     *
     * Also see `device.target()`.
     */
    target(cb) {
        if (this.framebufferTarget) {
            this.framebufferTarget.with(cb);
        }
    }
    init() {
        const { width, height, state, state: { gl }, glColorAttachments, colors, depthStencil, } = this;
        // This would overwrite a the currently bound `Target`s FBO
        state.assertTargetUnbound();
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
        colors.forEach((buffer, i) => {
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, buffer.glTexture, 0);
        });
        if (depthStencil) {
            switch (depthStencil.storageFormat) {
                case 35056 /* DEPTH24_STENCIL8 */:
                case 36013 /* DEPTH32F_STENCIL8 */:
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthStencil.glTexture, 0);
                    break;
                case 33189 /* DEPTH_COMPONENT16 */:
                case 33190 /* DEPTH_COMPONENT24 */:
                case 36012 /* DEPTH_COMPONENT32F */:
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthStencil.glTexture, 0);
                    break;
                default: unreachable(depthStencil, (p) => {
                    return `Unsupported attachment: ${p}`;
                });
            }
        }
        const status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.deleteFramebuffer(fbo);
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("FRAMEBUFFER_UNSUPPORTED");
                default: throw new Error("Framebuffer incomplete");
            }
        }
        this.glFramebuffer = fbo;
        if (fbo) {
            this.framebufferTarget = new Target(state, glColorAttachments, fbo, width, height);
        }
    }
}

class Device {
    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options = {}) {
        const { element = document.body } = options;
        if (element instanceof HTMLCanvasElement) {
            return Device.createWithCanvas(element, options);
        }
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.createWithCanvas(canvas, options);
    }
    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static createWithCanvas(canvas, options = {}) {
        const { alpha = true, antialias = true, depth = true, stencil = true, preserveDrawingBuffer = false, } = options;
        const gl = canvas.getContext("webgl2", {
            alpha,
            antialias,
            depth,
            stencil,
            preserveDrawingBuffer,
        });
        if (!gl) {
            throw new Error("Could not get webgl2 context");
        }
        return Device.createWithContext(gl, options);
    }
    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of it voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static createWithContext(gl, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, } = {}) {
        if (extensions) {
            extensions.forEach((ext) => {
                // We currently do not have extensions with callable API
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }
        if (debug) {
            const wrapper = {};
            for (const key in gl) {
                if (typeof gl[key] === "function") {
                    wrapper[key] = createDebugFunc(gl, key);
                }
                else {
                    wrapper[key] = gl[key];
                }
            }
            gl = wrapper;
        }
        return new Device(gl, pixelRatio, viewportWidth, viewportHeight);
    }
    constructor(gl, explicitPixelRatio, explicitViewportWidth, explicitViewportHeight) {
        this._gl = gl;
        this._canvas = gl.canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewportWidth = explicitViewportWidth;
        this.explicitViewportHeight = explicitViewportHeight;
        this.update();
        this.state = new State(gl);
        this.backbufferTarget = new Target(this.state, [gl.BACK], null, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // Enable scissor test globally. Practically everywhere you would want
        // it disbled you can pass explicit scissor box instead. The impact on
        // perf is negligent
        gl.enable(gl.SCISSOR_TEST);
    }
    /**
     * Return width of the gl drawing buffer.
     */
    get bufferWidth() {
        return this._gl.drawingBufferWidth;
    }
    /**
     * Return height of the gl drawing buffer.
     */
    get bufferHeight() {
        return this._gl.drawingBufferHeight;
    }
    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    get canvasWidth() {
        return this._canvas.width;
    }
    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    get canvasHeight() {
        return this._canvas.height;
    }
    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSWidth() {
        return this._canvas.clientWidth;
    }
    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSHeight() {
        return this._canvas.clientHeight;
    }
    /**
     * Return the device pixel ratio for this device
     */
    get pixelRatio() {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }
    /**
     * Notify the device to check whether updates are needed. This resizes the
     * canvas, if the device pixel ratio or css canvas width/height changed.
     */
    update() {
        const dpr = this.pixelRatio;
        const canvas = this._canvas;
        const width = typeof this.explicitViewportWidth !== "undefined"
            ? this.explicitViewportWidth
            : canvas.clientWidth * dpr;
        const height = typeof this.explicitViewportHeight !== "undefined"
            ? this.explicitViewportHeight
            : canvas.clientHeight * dpr;
        if (width !== canvas.width) {
            canvas.width = width;
        }
        if (height !== canvas.height) {
            canvas.height = height;
        }
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
    target(cb) {
        this.backbufferTarget.with(cb);
    }
    /**
     * Create a new command with given vertex and fragment shader.
     *
     * Commands contain WebGL programs, but also WebGL configuration needed
     * for drawing: blend, depth test and stencil test configurations, and
     * uniform callbacks. Uniform callbacks transform recieved props into
     * uniform values when the command is executed, but if constant, they
     * will eagerly upload the uniform values to the shaders and not do
     * at in execution time.
     */
    createCommand(vert, frag, options) {
        return _createCommand(this.state, vert, frag, options);
    }
    /**
     * Create a new vertex buffer with given type and of given size.
     */
    createVertexBuffer(type, size, options) {
        return _createVertexBuffer(this._gl, type, size, options);
    }
    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createVertexBufferWithTypedArray(type, data, options) {
        return _createVertexBufferWithTypedArray(this._gl, type, data, options);
    }
    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    createElementBuffer(type, primitive, size, options) {
        return _createElementBuffer(this._gl, type, primitive, size, options);
    }
    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    createElementBufferWithArray(data, options) {
        return _createElementBufferWithArray(this._gl, data, options);
    }
    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createElementBufferWithTypedArray(type, primitive, data, options) {
        return _createElementBufferWithTypedArray(this._gl, type, primitive, data, options);
    }
    /**
     * Create new attributes with element and attribute definitions, and an
     * optional count limit.
     *
     * Element definitions can either be a primitive definition, reference an
     * existing element buffer, or have enough information to create an element
     * buffer.
     *
     * Attribute definitions can either reference an existing vertex buffer,
     * or have enough information to create a vertex buffer.
     *
     * Empty attribute definitions are valid. If no attributes nor elements
     * given, there will be no underlying vertex array object created, only the
     * count will be given to gl.drawArrays()
     */
    createAttributes(elements, attributes, options) {
        return _createAttributes(this.state, elements, attributes, options);
    }
    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    createEmptyAttributes(primitive, count) {
        return new Attributes(this.state, primitive, [], count, 0);
    }
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    createTexture(width, height, storageFormat, options) {
        return _createTexture(this._gl, width, height, storageFormat, options);
    }
    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    createTextureWithImage(image, options) {
        return _createTextureWithTypedArray(this._gl, image.width, image.height, 32856 /* RGBA8 */, image.data, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, options);
    }
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    createTextureWithTypedArray(width, height, internalFormat, data, dataFormat, dataType, options) {
        return _createTextureWithTypedArray(this._gl, width, height, internalFormat, data, dataFormat, dataType, options);
    }
    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * WebGL will synchronize their usage so they can either be written to via
     * the framebuffer, or written to or read via their own methods.
     */
    createFramebuffer(width, height, color, depthStencil) {
        return _createFramebuffer(this.state, width, height, color, depthStencil);
    }
}
function createDebugFunc(gl, key) {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}

export { Device, Target, Command, VertexBuffer, ElementBuffer, Attributes, Texture, Framebuffer };
//# sourceMappingURL=webglutenfree.js.map
