var BufferUsage;
(function (BufferUsage) {
    BufferUsage[BufferUsage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
    BufferUsage[BufferUsage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
    BufferUsage[BufferUsage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
    BufferUsage[BufferUsage["STATIC_READ"] = 35045] = "STATIC_READ";
    BufferUsage[BufferUsage["DYNAMIC_READ"] = 35049] = "DYNAMIC_READ";
    BufferUsage[BufferUsage["STREAM_READ"] = 35041] = "STREAM_READ";
    BufferUsage[BufferUsage["STATIC_COPY"] = 35046] = "STATIC_COPY";
    BufferUsage[BufferUsage["DYNAMIC_COPY"] = 35050] = "DYNAMIC_COPY";
    BufferUsage[BufferUsage["STREAM_COPY"] = 35042] = "STREAM_COPY";
})(BufferUsage || (BufferUsage = {}));

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

function is(got, expected, fmt) {
    const valuesEqual = got === expected;
    if (IS_DEBUG_BUILD) {
        if (!valuesEqual) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not equal to ${expected}`;
            throw new Error(msg);
        }
    }
    return valuesEqual;
}
function isTrue(got, fmt) {
    const valueTrue = got === true;
    if (IS_DEBUG_BUILD) {
        if (!valueTrue) {
            const msg = fmt
                ? typeof fmt === "string" ? fmt : fmt(got)
                : `Assertion failed: values ${got} is not true`;
            throw new Error(msg);
        }
    }
    return valueTrue;
}
function isNumber(got, fmt) {
    const valueNumber = typeof got === "number";
    if (IS_DEBUG_BUILD) {
        if (!valueNumber) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not a number`;
            throw new Error(msg);
        }
    }
    return valueNumber;
}
function isArray(got, fmt) {
    const valueArray = Array.isArray(got);
    if (IS_DEBUG_BUILD) {
        if (!valueArray) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not an array`;
            throw new Error(msg);
        }
    }
    return valueArray;
}
function isString(got, fmt) {
    const valueString = typeof got === "string";
    if (IS_DEBUG_BUILD) {
        if (!valueString) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not a string`;
            throw new Error(msg);
        }
    }
    return valueString;
}
function isNotNullOrUndefined(got, fmt) {
    const valueNotNullOrUndefined = typeof got !== "undefined" && got !== null;
    if (IS_DEBUG_BUILD) {
        if (!valueNotNullOrUndefined) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
            throw new Error(msg);
        }
    }
    return valueNotNullOrUndefined;
}
function isNotEmpty(got, fmt) {
    const valueNotEmpty = !!got.length;
    if (IS_DEBUG_BUILD) {
        if (!valueNotEmpty) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array value empty`;
            throw new Error(msg);
        }
    }
    return valueNotEmpty;
}
function isGreater(got, low, fmt) {
    const valueGreater = got > low;
    if (IS_DEBUG_BUILD) {
        if (!valueGreater) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not greater than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueGreater;
}
function isInRangeInclusive(got, low, high, fmt) {
    const valueInRangeInclusive = got >= low && got <= high;
    if (IS_DEBUG_BUILD) {
        if (!valueInRangeInclusive) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
    return valueInRangeInclusive;
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
 * A thin layer on top of WebGL remembering the current state, only
 * setting the actual WebGL state when needed.
 *
 * `State` contains locks and state bits. Locks represent an ongoing
 * usage session with a resource. While a resource is locked, all the
 * state bits set when locking are expected to still be in place. Any
 * attempt to set those state bits while the lock is held is
 * considered an error.
 */
class State {
    constructor(gl) {
        this.lockedTarget = null;
        this.lockedCommand = null;
        // Each bit of state can also be `undefined`, meaning "we don't
        // know". This will cause the comparison to fail and we will issue
        // a state transition to ensure the value is what we need it to
        // be. This happens for new `State`s, and after `state.reset()` is
        // called. To preserve some sanity, we disallow calling
        // `state.reset()` if we currently have any resource locked (we
        // are in the middle of a rendering session).
        this.glDrawFramebuffer = undefined;
        this.glDrawBuffers = undefined;
        this.glProgram = undefined;
        this.depthTest = undefined;
        this.stencilTest = undefined;
        this.blend = undefined;
        this.gl = gl;
    }
    /**
     * Set the depth test strategy if it differs from the current one.
     */
    setDepthTest(depthTest) {
        if (!DepthTestDescriptor.equals(this.depthTest, depthTest)) {
            const gl = this.gl;
            if (depthTest) {
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(depthTest.func);
                gl.depthMask(depthTest.mask);
                gl.depthRange(depthTest.rangeStart, depthTest.rangeEnd);
            }
            else {
                gl.disable(gl.DEPTH_TEST);
            }
            this.depthTest = depthTest;
        }
    }
    /**
     * Set the stencil test strategy if it differs from the current
     * one.
     */
    setStencilTest(stencilTest) {
        if (!StencilTestDescriptor.equals(this.stencilTest, stencilTest)) {
            const gl = this.gl;
            if (stencilTest) {
                const { frontFunc, backFunc, frontFuncRef, backFuncRef, frontFuncMask, backFuncMask, frontMask, backMask, frontOpFail, backOpFail, frontOpZFail, backOpZFail, frontOpZPass, backOpZPass, } = stencilTest;
                gl.enable(gl.STENCIL_TEST);
                gl.stencilFuncSeparate(gl.FRONT, frontFunc, frontFuncRef, frontFuncMask);
                gl.stencilFuncSeparate(gl.BACK, backFunc, backFuncRef, backFuncMask);
                gl.stencilMaskSeparate(gl.FRONT, frontMask);
                gl.stencilMaskSeparate(gl.BACK, backMask);
                gl.stencilOpSeparate(gl.FRONT, frontOpFail, frontOpZFail, frontOpZPass);
                gl.stencilOpSeparate(gl.BACK, backOpFail, backOpZFail, backOpZPass);
            }
            else {
                gl.disable(gl.STENCIL_TEST);
            }
            this.stencilTest = stencilTest;
        }
    }
    /**
     * Set the blending strategy if it differs from the current one.
     */
    setBlend(blend) {
        if (!BlendDescriptor.equals(this.blend, blend)) {
            const gl = this.gl;
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
            this.blend = blend;
        }
    }
    /**
     * Lock a `Target` for this `State`. Compare the underlying
     * framebuffer and draw buffers and only set them if needed.
     *
     * Each `Device` must have at most one `Target` locked at any
     * time. Nested binding is not supported even though it is not
     * prohibited by the shape of the API:
     *
     * ```typescript
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     * ```
     */
    lockTarget(target, glDrawFramebuffer, glDrawBuffers) {
        if (this.lockedTarget) {
            throw new Error("Cannot lock Target, already locked");
        }
        const gl = this.gl;
        if (this.glDrawFramebuffer !== glDrawFramebuffer) {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, glDrawFramebuffer);
            this.glDrawFramebuffer = glDrawFramebuffer;
        }
        if (typeof this.glDrawBuffers === "undefined"
            || !arrayEquals(this.glDrawBuffers, glDrawBuffers)) {
            gl.drawBuffers(glDrawBuffers);
            this.glDrawBuffers = glDrawBuffers;
        }
        this.lockedTarget = target;
    }
    /**
     * Unlock the currently locked target. Does not unbind the
     * framebuffer nor the draw buffers, expecting they will be
     * conditionally bound in the next call to `State.lockTarget()`.
     *
     * Errors if the target is `null` already, as it indicates a usage
     * bug.
     */
    unlockTarget() {
        if (!this.lockedTarget) {
            throw new Error("Cannot unlock Target, not locked");
        }
        this.lockedTarget = null;
    }
    /**
     * Lock a `Command` for this `State`. Compare the underlying
     * program and only set it if needed.
     *
     * Each `Device` must have at most one `Command` locked at any
     * time. Nested binding is not supported even though it is not
     * prohibited by the shape of the API:
     *
     * ```typescript
     * // This produces a runtime error
     * dev.target((rt) => {
     *     rt.batch(cmd, (draw) => {
     *         rt.draw(cmd, attrs, props);
     *     });
     * });
     * ```
     */
    lockCommand(command, glProgram) {
        if (this.lockedCommand) {
            throw new Error("Cannot lock Command, already locked");
        }
        if (this.glProgram !== glProgram) {
            this.gl.useProgram(glProgram);
            this.glProgram = glProgram;
        }
        this.lockedCommand = command;
    }
    /**
     * Unlock the currently locked command. Does not unbind the
     * program, expecting it will be conditionally bound in the next
     * call to `State.lockCommand()`.
     *
     * Errors if `lockedCommand` is `null` already, as it indicates a
     * usage bug.
     */
    unlockCommand() {
        if (!this.lockedCommand) {
            throw new Error("Cannot unlock Command, not locked");
        }
        this.lockedCommand = null;
    }
    /**
     * Return whether the currently locked Target is the same as the
     * parameter.
     */
    isTargetLocked(target) {
        return this.lockedTarget === target;
    }
    /**
     * Return whether the currently locked Command is the same as the
     * parameter.
     */
    isCommandLocked(command) {
        return this.lockedCommand === command;
    }
    /**
     * Return whether there is no Target currently locked.
     */
    isTargetUnlocked() {
        return this.lockedTarget === null;
    }
    /**
     * Return whether there is no Command currently locked.
     */
    isCommandUnlocked() {
        return this.lockedCommand === null;
    }
    /**
     * Reset all knowledge and assumptions about current state. Can't
     * be used while a resource is locked.
     */
    reset() {
        if (this.lockedTarget) {
            throw new Error("Cannot reset when Target is locked");
        }
        if (this.lockedCommand) {
            throw new Error("Cannot reset when Command is locked");
        }
        this.lockedTarget = null;
        this.lockedCommand = null;
        this.glDrawFramebuffer = undefined;
        this.glDrawBuffers = undefined;
        this.glProgram = undefined;
        this.depthTest = undefined;
        this.stencilTest = undefined;
        this.blend = undefined;
    }
}
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
    constructor(frontFunc, backFunc, frontFuncRef, backFuncRef, frontFuncMask, backFuncMask, frontMask, backMask, frontOpFail, backOpFail, frontOpZFail, backOpZFail, frontOpZPass, backOpZPass) {
        this.frontFunc = frontFunc;
        this.backFunc = backFunc;
        this.frontFuncRef = frontFuncRef;
        this.backFuncRef = backFuncRef;
        this.frontFuncMask = frontFuncMask;
        this.backFuncMask = backFuncMask;
        this.frontMask = frontMask;
        this.backMask = backMask;
        this.frontOpFail = frontOpFail;
        this.backOpFail = backOpFail;
        this.frontOpZFail = frontOpZFail;
        this.backOpZFail = backOpZFail;
        this.frontOpZPass = frontOpZPass;
        this.backOpZPass = backOpZPass;
    }
    static equals(left, right) {
        if (left === right) {
            return true;
        }
        if (!left || !right) {
            return false;
        }
        if (left.frontFunc !== right.frontFunc) {
            return false;
        }
        if (left.backFunc !== right.backFunc) {
            return false;
        }
        if (left.frontFuncRef !== right.frontFuncRef) {
            return false;
        }
        if (left.backFuncRef !== right.backFuncRef) {
            return false;
        }
        if (left.frontFuncMask !== right.frontFuncMask) {
            return false;
        }
        if (left.backFuncMask !== right.backFuncMask) {
            return false;
        }
        if (left.frontMask !== right.frontMask) {
            return false;
        }
        if (left.backMask !== right.backMask) {
            return false;
        }
        if (left.frontOpFail !== right.frontOpFail) {
            return false;
        }
        if (left.backOpFail !== right.backOpFail) {
            return false;
        }
        if (left.frontOpZFail !== right.frontOpZFail) {
            return false;
        }
        if (left.backOpZFail !== right.backOpZFail) {
            return false;
        }
        if (left.frontOpZPass !== right.frontOpZPass) {
            return false;
        }
        if (left.backOpZPass !== right.backOpZPass) {
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

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
var UniformType;
(function (UniformType) {
    UniformType[UniformType["FLOAT"] = 5126] = "FLOAT";
    UniformType[UniformType["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
    UniformType[UniformType["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
    UniformType[UniformType["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
    UniformType[UniformType["INT"] = 5124] = "INT";
    UniformType[UniformType["INT_VEC2"] = 35667] = "INT_VEC2";
    UniformType[UniformType["INT_VEC3"] = 35668] = "INT_VEC3";
    UniformType[UniformType["INT_VEC4"] = 35669] = "INT_VEC4";
    UniformType[UniformType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    UniformType[UniformType["UNSIGNED_INT_VEC2"] = 36294] = "UNSIGNED_INT_VEC2";
    UniformType[UniformType["UNSIGNED_INT_VEC3"] = 36295] = "UNSIGNED_INT_VEC3";
    UniformType[UniformType["UNSIGNED_INT_VEC4"] = 36296] = "UNSIGNED_INT_VEC4";
    UniformType[UniformType["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
    UniformType[UniformType["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
    UniformType[UniformType["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
    UniformType[UniformType["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
    UniformType[UniformType["SAMPLER_CUBE"] = 35680] = "SAMPLER_CUBE";
    // TODO: support all uniform types
    // BOOL
})(UniformType || (UniformType = {}));
var DepthFunc;
(function (DepthFunc) {
    DepthFunc[DepthFunc["ALWAYS"] = 519] = "ALWAYS";
    DepthFunc[DepthFunc["NEVER"] = 512] = "NEVER";
    DepthFunc[DepthFunc["EQUAL"] = 514] = "EQUAL";
    DepthFunc[DepthFunc["NOTEQUAL"] = 517] = "NOTEQUAL";
    DepthFunc[DepthFunc["LESS"] = 513] = "LESS";
    DepthFunc[DepthFunc["LEQUAL"] = 515] = "LEQUAL";
    DepthFunc[DepthFunc["GREATER"] = 516] = "GREATER";
    DepthFunc[DepthFunc["GEQUAL"] = 518] = "GEQUAL";
})(DepthFunc || (DepthFunc = {}));
var StencilFunc;
(function (StencilFunc) {
    StencilFunc[StencilFunc["ALWAYS"] = 519] = "ALWAYS";
    StencilFunc[StencilFunc["NEVER"] = 512] = "NEVER";
    StencilFunc[StencilFunc["EQUAL"] = 514] = "EQUAL";
    StencilFunc[StencilFunc["NOTEQUAL"] = 517] = "NOTEQUAL";
    StencilFunc[StencilFunc["LESS"] = 513] = "LESS";
    StencilFunc[StencilFunc["LEQUAL"] = 515] = "LEQUAL";
    StencilFunc[StencilFunc["GREATER"] = 516] = "GREATER";
    StencilFunc[StencilFunc["GEQUAL"] = 518] = "GEQUAL";
})(StencilFunc || (StencilFunc = {}));
var StencilOp;
(function (StencilOp) {
    StencilOp[StencilOp["KEEP"] = 7680] = "KEEP";
    StencilOp[StencilOp["ZERO"] = 0] = "ZERO";
    StencilOp[StencilOp["REPLACE"] = 7681] = "REPLACE";
    StencilOp[StencilOp["INCR"] = 7682] = "INCR";
    StencilOp[StencilOp["INCR_WRAP"] = 34055] = "INCR_WRAP";
    StencilOp[StencilOp["DECR"] = 7683] = "DECR";
    StencilOp[StencilOp["DECR_WRAP"] = 34056] = "DECR_WRAP";
    StencilOp[StencilOp["INVERT"] = 5386] = "INVERT";
})(StencilOp || (StencilOp = {}));
var BlendFunc;
(function (BlendFunc) {
    BlendFunc[BlendFunc["ZERO"] = 0] = "ZERO";
    BlendFunc[BlendFunc["ONE"] = 1] = "ONE";
    BlendFunc[BlendFunc["SRC_COLOR"] = 768] = "SRC_COLOR";
    BlendFunc[BlendFunc["SRC_ALPHA"] = 770] = "SRC_ALPHA";
    BlendFunc[BlendFunc["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
    BlendFunc[BlendFunc["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
    BlendFunc[BlendFunc["DST_COLOR"] = 774] = "DST_COLOR";
    BlendFunc[BlendFunc["DST_ALPHA"] = 772] = "DST_ALPHA";
    BlendFunc[BlendFunc["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
    BlendFunc[BlendFunc["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    BlendFunc[BlendFunc["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
    BlendFunc[BlendFunc["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
    BlendFunc[BlendFunc["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
    BlendFunc[BlendFunc["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
})(BlendFunc || (BlendFunc = {}));
var BlendEquation;
(function (BlendEquation) {
    BlendEquation[BlendEquation["FUNC_ADD"] = 32774] = "FUNC_ADD";
    BlendEquation[BlendEquation["FUNC_SUBTRACT"] = 32778] = "FUNC_SUBTRACT";
    BlendEquation[BlendEquation["FUNC_REVERSE_SUBTRACT"] = 32779] = "FUNC_REVERSE_SUBTRACT";
    BlendEquation[BlendEquation["MIN"] = 32775] = "MIN";
    BlendEquation[BlendEquation["MAX"] = 32776] = "MAX";
})(BlendEquation || (BlendEquation = {}));
function _createCommand(state, vert, frag, { uniforms = {}, depth, stencil, blend, } = {}) {
    isString(vert, fmtParamNonNull("vert"));
    isString(frag, fmtParamNonNull("frag"));
    const depthDescr = parseDepth(depth);
    const stencilDescr = parseStencil(stencil);
    const blendDescr = parseBlend(blend);
    return new Command(state, vert, frag, uniforms, depthDescr, stencilDescr, blendDescr);
}
class Command {
    constructor(state, vsSource, fsSource, uniforms, depthDescr, stencilDescr, blendDescr) {
        this.state = state;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
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
        const { state, state: { gl }, vsSource, fsSource, uniforms, } = this;
        // `init()` would overwrite and unbind the currently bound
        // `Command`'s program, so assert against it.
        // (`gl.useProgram(null)` is called at the end of `init()`).
        isTrue(state.isCommandUnlocked(), "Expected Command to be unlocked when performing Program init (would overwrite)");
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
            validateUniformDeclarations(gl, prog, uniforms);
        }
        gl.useProgram(prog);
        // Some uniform declarations can be evaluated right away, so do it at
        // init-time. Create a descriptor for the rest that is evaluated at
        // render-time.
        //
        // Texture declarations are evaluated in two phases:
        // 1) Texture location offsets are sent to the shader in init time.
        //    This is ok because even if the textures themselves can change (via
        //    function accessors), their offsets stay the same,
        // 2) Textures provided by the accessor are activated and bound to their
        //    locations at draw time.
        // Note: Object.entries() provides values in a nondeterministic order,
        // but we store the descriptors in an array, remembering the order.
        const uniformDescrs = [];
        const textureDescrs = [];
        Object.entries(uniforms).forEach(([ident, u]) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }
            // Handle textures first...
            switch (u.type) {
                case UniformType.SAMPLER_2D:
                case UniformType.SAMPLER_CUBE:
                    // The old lenght is the new index to access the texture
                    // under with gl.activeTexture()
                    gl.uniform1i(loc, textureDescrs.length);
                    textureDescrs.push(new TextureDescriptor(ident, u));
                    return;
            }
            // ... and then handle the rest of the uniforms
            if (typeof u.value !== "function") {
                // Eagerly send everything we can process now to GPU
                // TODO: there are additional else if guards as ts inference
                // broke in 3.1 or 3.2, but we are sure that
                // typeof u.value !== "function"
                switch (u.type) {
                    case UniformType.FLOAT:
                        if (typeof u.value === "number") {
                            gl.uniform1f(loc, u.value);
                        }
                        else if (typeof u.value !== "function") {
                            gl.uniform1fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT:
                        if (typeof u.value === "number") {
                            gl.uniform1i(loc, u.value);
                        }
                        else if (typeof u.value !== "function") {
                            gl.uniform1iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT:
                        if (typeof u.value === "number") {
                            gl.uniform1ui(loc, u.value);
                        }
                        else if (typeof u.value !== "function") {
                            gl.uniform1uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT2:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix2fv(loc, false, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT3:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix3fv(loc, false, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT4:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix4fv(loc, false, u.value);
                        }
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
        this.uniformDescrs = uniformDescrs;
        this.textureDescrs = textureDescrs;
    }
}
class UniformDescriptor {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}
class TextureDescriptor {
    constructor(identifier, definition) {
        this.identifier = identifier;
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
function validateUniformDeclarations(gl, prog, uniforms) {
    const nUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    const progUniforms = new Map();
    // Note: gl.getUniformLocation accepts a shorthand for uniform names of
    // basic type arrays (trailing "[0]" can be omitted). Because
    // gl.getActiveUniforms always gives us the full name, we need to widen
    // our matching to accept the shorthands and pair them with the introspected
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
        const shorthand = shorthands.has(name) && shorthands.get(name);
        const progUniform = progUniforms.has(name)
            ? progUniforms.get(name)
            : shorthand && progUniforms.has(shorthand)
                ? progUniforms.get(shorthands.get(name))
                : null;
        if (progUniform) {
            // TODO: validate array lengths?
            is(progUniform.type, tyObj.type, fmtTyMismatch(progUniform.name));
        }
        else {
            throw new Error(`Redundant uniform: ${name}`);
        }
        if (shorthand) {
            toCheck.delete(shorthand);
        }
        else {
            toCheck.delete(name);
        }
    });
    if (toCheck.size) {
        const names = [...toCheck].join(", ");
        throw new Error(`Missing uniforms: ${names}`);
    }
}
function parseDepth(depth) {
    if (!depth) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        isNumber(depth.func, fmtParamNonNull("depth.func"));
    }
    return new DepthTestDescriptor(depth.func || DepthFunc.LESS, typeof depth.mask === "boolean" ? depth.mask : true, depth.range ? depth.range[0] : 0, depth.range ? depth.range[1] : 1);
}
function parseStencil(stencil) {
    if (!stencil) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        isNotNullOrUndefined(stencil.func, fmtParamNonNull("stencil.func"));
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
        : StencilOp.KEEP, stencil.op
        ? typeof stencil.op.fail === "object"
            ? stencil.op.fail.back
            : stencil.op.fail
        : StencilOp.KEEP, stencil.op
        ? typeof stencil.op.zfail === "object"
            ? stencil.op.zfail.front
            : stencil.op.zfail
        : StencilOp.KEEP, stencil.op
        ? typeof stencil.op.zfail === "object"
            ? stencil.op.zfail.back
            : stencil.op.zfail
        : StencilOp.KEEP, stencil.op
        ? typeof stencil.op.zpass === "object"
            ? stencil.op.zpass.front
            : stencil.op.zpass
        : StencilOp.KEEP, stencil.op
        ? typeof stencil.op.zpass === "object"
            ? stencil.op.zpass.back
            : stencil.op.zpass
        : StencilOp.KEEP);
}
function parseBlend(blend) {
    if (!blend) {
        return undefined;
    }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        isNotNullOrUndefined(blend.func, fmtParamNonNull("blend.func"));
        isNotNullOrUndefined(blend.func.src, fmtParamNonNull("blend.func.src"));
        isNotNullOrUndefined(blend.func.dst, fmtParamNonNull("blend.func.dst"));
        if (typeof blend.func.src === "object") {
            isNotNullOrUndefined(blend.func.src.rgb, fmtParamNonNull("blend.func.src.rgb"));
            isNotNullOrUndefined(blend.func.src.alpha, fmtParamNonNull("blend.func.src.alpha"));
        }
        if (typeof blend.func.dst === "object") {
            isNotNullOrUndefined(blend.func.dst.rgb, fmtParamNonNull("blend.func.dst.rgb"));
            isNotNullOrUndefined(blend.func.dst.alpha, fmtParamNonNull("blend.func.dst.alpha"));
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
        : BlendEquation.FUNC_ADD, blend.equation
        ? typeof blend.equation === "object"
            ? blend.equation.alpha
            : blend.equation
        : BlendEquation.FUNC_ADD, blend.color);
}
function fmtParamNonNull(name) {
    return () => `Missing parameter ${name}`;
}
function fmtTyMismatch(name) {
    return () => `Type mismatch for uniform field ${name}`;
}

var TargetBufferBitmask;
(function (TargetBufferBitmask) {
    TargetBufferBitmask[TargetBufferBitmask["COLOR"] = 16384] = "COLOR";
    TargetBufferBitmask[TargetBufferBitmask["DEPTH"] = 256] = "DEPTH";
    TargetBufferBitmask[TargetBufferBitmask["STENCIL"] = 1024] = "STENCIL";
    TargetBufferBitmask[TargetBufferBitmask["COLOR_DEPTH"] = 16640] = "COLOR_DEPTH";
    TargetBufferBitmask[TargetBufferBitmask["COLOR_STENCIL"] = 17408] = "COLOR_STENCIL";
    TargetBufferBitmask[TargetBufferBitmask["DEPTH_STENCIL"] = 1280] = "DEPTH_STENCIL";
    TargetBufferBitmask[TargetBufferBitmask["COLOR_DEPTH_STENCIL"] = 17664] = "COLOR_DEPTH_STENCIL";
})(TargetBufferBitmask || (TargetBufferBitmask = {}));
var TargetBlitFilter;
(function (TargetBlitFilter) {
    TargetBlitFilter[TargetBlitFilter["NEAREST"] = 9728] = "NEAREST";
    TargetBlitFilter[TargetBlitFilter["LINEAR"] = 9729] = "LINEAR";
})(TargetBlitFilter || (TargetBlitFilter = {}));
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
        state.lockTarget(this, glFramebuffer, glDrawBuffers);
        cb(this);
        state.unlockTarget();
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
        isTrue(state.isTargetLocked(this), "Expected Target to be locked when performing clear");
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
        if (bits & TargetBufferBitmask.COLOR) {
            gl.clearColor(r, g, b, a);
        }
        if (bits & TargetBufferBitmask.DEPTH) {
            gl.clearDepth(depth);
        }
        if (bits & TargetBufferBitmask.STENCIL) {
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
        : this.surfaceHeight, filter = TargetBlitFilter.NEAREST, scissorX = dstX, scissorY = dstY, scissorWidth = dstWidth, scissorHeight = dstHeight, } = {}) {
        const { state, state: { gl } } = this;
        isTrue(state.isTargetLocked(this), "Expected Target to be locked when performing blit");
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
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, textureDescrs, uniformDescrs, } = cmd;
        isTrue(state.isTargetLocked(this), "Expected Target to be locked when performing draw");
        state.lockCommand(cmd, glProgram);
        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);
        this.textures(textureDescrs, props, 0);
        this.uniforms(uniformDescrs, props, 0);
        // TODO: figure out if we can optimize this away
        gl.bindVertexArray(attrs.glVertexArray);
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
        // TODO: figure out if we can optimize this away
        gl.bindVertexArray(null);
        state.unlockCommand();
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
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, uniformDescrs, textureDescrs, } = cmd;
        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch
        isTrue(state.isTargetLocked(this), "Expected Target to be locked when performing batch draw (pre check)");
        state.lockCommand(cmd, glProgram);
        state.setDepthTest(depthTestDescr);
        state.setStencilTest(stencilTestDescr);
        state.setBlend(blendDescr);
        let i = 0;
        cb((attrs, props) => {
            // Did the user do anything sneaky?
            isTrue(state.isTargetLocked(this), "Expected Target to be locked when performing batch draw (inner loop)");
            isTrue(state.isCommandLocked(cmd), "Expected Command to be locked when performing batch draw (inner loop)");
            i++;
            this.uniforms(uniformDescrs, props, i);
            this.textures(textureDescrs, props, i);
            // TODO: figure out if we can optimize this away
            gl.bindVertexArray(attrs.glVertexArray);
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
            // TODO: figure out if we can optimize this away
            gl.bindVertexArray(null);
        });
        state.unlockCommand();
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
    uniforms(uniformDescrs, props, index) {
        const gl = this.state.gl;
        uniformDescrs.forEach(({ identifier: ident, location: loc, definition: def, }) => {
            switch (def.type) {
                case UniformType.FLOAT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1f(loc, value);
                    }
                    else {
                        gl.uniform1fv(loc, value);
                    }
                    break;
                }
                case UniformType.INT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1i(loc, value);
                    }
                    else {
                        gl.uniform1iv(loc, value);
                    }
                    break;
                }
                case UniformType.UNSIGNED_INT: {
                    const value = def.value(props, index);
                    if (typeof value === "number") {
                        gl.uniform1ui(loc, value);
                    }
                    else {
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
                    unreachable(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }
    textures(textureDescrs, props, index) {
        const gl = this.state.gl;
        textureDescrs.forEach(({ identifier, definition }, i) => {
            const tex = typeof definition.value === "function"
                ? definition.value(props, index)
                : definition.value;
            gl.activeTexture(gl.TEXTURE0 + i);
            switch (definition.type) {
                case UniformType.SAMPLER_2D:
                    gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
                    break;
                case UniformType.SAMPLER_CUBE:
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex.glTexture);
                    break;
                default:
                    unreachable(definition, () => `Unknown texture uniform: ${identifier}`);
                    break;
            }
        });
        gl.activeTexture(gl.TEXTURE0);
    }
}

var VertexBufferIntegerDataType;
(function (VertexBufferIntegerDataType) {
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["BYTE"] = 5120] = "BYTE";
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["SHORT"] = 5122] = "SHORT";
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["INT"] = 5124] = "INT";
    VertexBufferIntegerDataType[VertexBufferIntegerDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
})(VertexBufferIntegerDataType || (VertexBufferIntegerDataType = {}));
var VertexBufferFloatDataType;
(function (VertexBufferFloatDataType) {
    VertexBufferFloatDataType[VertexBufferFloatDataType["FLOAT"] = 5126] = "FLOAT";
})(VertexBufferFloatDataType || (VertexBufferFloatDataType = {}));
function _createVertexBuffer(gl, type, size, { usage = BufferUsage.DYNAMIC_DRAW } = {}) {
    return new VertexBuffer(gl, type, size, size * sizeOf(type), usage);
}
function _createVertexBufferWithTypedArray(gl, type, data, { usage = BufferUsage.STATIC_DRAW } = {}) {
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
        case VertexBufferIntegerDataType.BYTE:
        case VertexBufferIntegerDataType.UNSIGNED_BYTE:
            return 1;
        case VertexBufferIntegerDataType.SHORT:
        case VertexBufferIntegerDataType.UNSIGNED_SHORT:
            return 2;
        case VertexBufferIntegerDataType.INT:
        case VertexBufferIntegerDataType.UNSIGNED_INT:
        case VertexBufferFloatDataType.FLOAT:
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
                    is(sub.length, length2);
                }
            }
            else {
                is(Array.isArray(sub), false);
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

var ElementPrimitive;
(function (ElementPrimitive) {
    ElementPrimitive[ElementPrimitive["POINT_LIST"] = 0] = "POINT_LIST";
    ElementPrimitive[ElementPrimitive["LINE_LIST"] = 1] = "LINE_LIST";
    ElementPrimitive[ElementPrimitive["LINE_LOOP"] = 2] = "LINE_LOOP";
    ElementPrimitive[ElementPrimitive["LINE_STRIP"] = 3] = "LINE_STRIP";
    ElementPrimitive[ElementPrimitive["TRIANGLE_LIST"] = 4] = "TRIANGLE_LIST";
    ElementPrimitive[ElementPrimitive["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    ElementPrimitive[ElementPrimitive["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(ElementPrimitive || (ElementPrimitive = {}));
var ElementBufferDataType;
(function (ElementBufferDataType) {
    ElementBufferDataType[ElementBufferDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    ElementBufferDataType[ElementBufferDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    ElementBufferDataType[ElementBufferDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
})(ElementBufferDataType || (ElementBufferDataType = {}));
function _createElementBuffer(gl, type, primitive, size, { usage = BufferUsage.DYNAMIC_DRAW } = {}) {
    return new ElementBuffer(gl, type, primitive, size, size * sizeOf$1(type), usage);
}
function _createElementBufferWithArray(gl, data, options) {
    if (is2(data)) {
        const shape = shape2(data);
        isInRangeInclusive(shape[1], 2, 3, (p) => {
            return `Elements must be 2-tuples or 3-tuples, got ${p}-tuple`;
        });
        const ravel = ravel2(data, shape);
        const primitive = shape[1] === 3
            ? ElementPrimitive.TRIANGLE_LIST
            : ElementPrimitive.LINE_LIST;
        return _createElementBufferWithTypedArray(gl, ElementBufferDataType.UNSIGNED_INT, primitive, new Uint32Array(ravel), options);
    }
    return _createElementBufferWithTypedArray(gl, ElementBufferDataType.UNSIGNED_INT, ElementPrimitive.POINT_LIST, new Uint32Array(data), options);
}
function _createElementBufferWithTypedArray(gl, type, primitive, data, { usage = BufferUsage.STATIC_DRAW } = {}) {
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
        case ElementBufferDataType.UNSIGNED_BYTE:
            return 1;
        case ElementBufferDataType.UNSIGNED_SHORT:
            return 2;
        case ElementBufferDataType.UNSIGNED_INT:
            return 4;
        default: return unreachable(type);
    }
}

const INT_PATTERN$1 = /^0|[1-9]\d*$/;
/**
 * Attribute type for reading vertex buffers. POINTER provides normalization
 * options for converting integer values to floats. IPOINTER always retains
 * integers types.
 */
var AttributeType;
(function (AttributeType) {
    AttributeType["POINTER"] = "pointer";
    AttributeType["IPOINTER"] = "ipointer";
})(AttributeType || (AttributeType = {}));
function _createAttributes(state, elements, attributes, { countLimit } = {}) {
    if (typeof countLimit === "number") {
        isGreater(countLimit, 0, (p) => {
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
                return new AttributeDescriptor(location, AttributeType.POINTER, _createVertexBufferWithTypedArray(state.gl, VertexBufferFloatDataType.FLOAT, new Float32Array(r)), s[0], s[1], false, 0);
            }
            return new AttributeDescriptor(location, AttributeType.POINTER, _createVertexBufferWithTypedArray(state.gl, VertexBufferFloatDataType.FLOAT, new Float32Array(definition)), definition.length, 1, false, 0);
        }
        return new AttributeDescriptor(location, definition.type, definition.buffer, definition.count, definition.size, definition.type === AttributeType.POINTER
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
                case AttributeType.POINTER:
                    gl.vertexAttribPointer(location, size, glBufferType, normalized, 0, 0);
                    break;
                case AttributeType.IPOINTER:
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

var TextureColorStorageFormat;
(function (TextureColorStorageFormat) {
    // R
    TextureColorStorageFormat[TextureColorStorageFormat["R8"] = 33321] = "R8";
    TextureColorStorageFormat[TextureColorStorageFormat["R8_SNORM"] = 36756] = "R8_SNORM";
    TextureColorStorageFormat[TextureColorStorageFormat["R8UI"] = 33330] = "R8UI";
    TextureColorStorageFormat[TextureColorStorageFormat["R8I"] = 33329] = "R8I";
    TextureColorStorageFormat[TextureColorStorageFormat["R16UI"] = 33332] = "R16UI";
    TextureColorStorageFormat[TextureColorStorageFormat["R16I"] = 33331] = "R16I";
    TextureColorStorageFormat[TextureColorStorageFormat["R16F"] = 33325] = "R16F";
    TextureColorStorageFormat[TextureColorStorageFormat["R32UI"] = 33334] = "R32UI";
    TextureColorStorageFormat[TextureColorStorageFormat["R32I"] = 33333] = "R32I";
    TextureColorStorageFormat[TextureColorStorageFormat["R32F"] = 33326] = "R32F";
    // RG
    TextureColorStorageFormat[TextureColorStorageFormat["RG8"] = 33323] = "RG8";
    TextureColorStorageFormat[TextureColorStorageFormat["RG8_SNORM"] = 36757] = "RG8_SNORM";
    TextureColorStorageFormat[TextureColorStorageFormat["RG8UI"] = 33336] = "RG8UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RG8I"] = 33335] = "RG8I";
    TextureColorStorageFormat[TextureColorStorageFormat["RG16UI"] = 33338] = "RG16UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RG16I"] = 33337] = "RG16I";
    TextureColorStorageFormat[TextureColorStorageFormat["RG16F"] = 33327] = "RG16F";
    TextureColorStorageFormat[TextureColorStorageFormat["RG32UI"] = 33340] = "RG32UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RG32I"] = 33339] = "RG32I";
    TextureColorStorageFormat[TextureColorStorageFormat["RG32F"] = 33328] = "RG32F";
    // RGB
    TextureColorStorageFormat[TextureColorStorageFormat["RGB8"] = 32849] = "RGB8";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB8_SNORM"] = 36758] = "RGB8_SNORM";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB8UI"] = 36221] = "RGB8UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB8I"] = 36239] = "RGB8I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB16UI"] = 36215] = "RGB16UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB16I"] = 36233] = "RGB16I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB16F"] = 34843] = "RGB16F";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB32UI"] = 36209] = "RGB32UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB32I"] = 36227] = "RGB32I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGB32F"] = 34837] = "RGB32F";
    // RGBA
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA8"] = 32856] = "RGBA8";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA8_SNORM"] = 36759] = "RGBA8_SNORM";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA8I"] = 36238] = "RGBA8I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA16UI"] = 36214] = "RGBA16UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA16I"] = 36232] = "RGBA16I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA16F"] = 34842] = "RGBA16F";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA32UI"] = 36208] = "RGBA32UI";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA32I"] = 36226] = "RGBA32I";
    TextureColorStorageFormat[TextureColorStorageFormat["RGBA32F"] = 34836] = "RGBA32F";
    // TODO: support exotic formats
    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(TextureColorStorageFormat || (TextureColorStorageFormat = {}));
var TextureDepthStorageFormat;
(function (TextureDepthStorageFormat) {
    TextureDepthStorageFormat[TextureDepthStorageFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    TextureDepthStorageFormat[TextureDepthStorageFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    TextureDepthStorageFormat[TextureDepthStorageFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
})(TextureDepthStorageFormat || (TextureDepthStorageFormat = {}));
var TextureDepthStencilStorageFormat;
(function (TextureDepthStencilStorageFormat) {
    TextureDepthStencilStorageFormat[TextureDepthStencilStorageFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    TextureDepthStencilStorageFormat[TextureDepthStencilStorageFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
})(TextureDepthStencilStorageFormat || (TextureDepthStencilStorageFormat = {}));
var TextureFormat;
(function (TextureFormat) {
    TextureFormat[TextureFormat["RED"] = 6403] = "RED";
    TextureFormat[TextureFormat["RG"] = 33319] = "RG";
    TextureFormat[TextureFormat["RGB"] = 6407] = "RGB";
    TextureFormat[TextureFormat["RGBA"] = 6408] = "RGBA";
    TextureFormat[TextureFormat["RED_INTEGER"] = 36244] = "RED_INTEGER";
    TextureFormat[TextureFormat["RG_INTEGER"] = 33320] = "RG_INTEGER";
    TextureFormat[TextureFormat["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
    TextureFormat[TextureFormat["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
    // TODO: support exotic formats
    TextureFormat[TextureFormat["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    TextureFormat[TextureFormat["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(TextureFormat || (TextureFormat = {}));
var TextureDataType;
(function (TextureDataType) {
    TextureDataType[TextureDataType["BYTE"] = 5120] = "BYTE";
    TextureDataType[TextureDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TextureDataType[TextureDataType["SHORT"] = 5122] = "SHORT";
    TextureDataType[TextureDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TextureDataType[TextureDataType["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
    TextureDataType[TextureDataType["INT"] = 5124] = "INT";
    TextureDataType[TextureDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    TextureDataType[TextureDataType["FLOAT"] = 5126] = "FLOAT";
    // TODO: support exotic formats
    // UNSIGNED_SHORT_4_4_4_4
    // UNSIGNED_SHORT_5_5_5_1
    // UNSIGNED_SHORT_5_6_5
    TextureDataType[TextureDataType["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
    // UNSIGNED_INT_5_9_9_9_REV
    // UNSIGNED_INT_2_10_10_10_REV
    // UNSIGNED_INT_10F_11F_11F_REV
    TextureDataType[TextureDataType["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
})(TextureDataType || (TextureDataType = {}));
var TextureWrap;
(function (TextureWrap) {
    TextureWrap[TextureWrap["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    TextureWrap[TextureWrap["REPEAT"] = 10497] = "REPEAT";
    TextureWrap[TextureWrap["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(TextureWrap || (TextureWrap = {}));
var TextureMinFilter;
(function (TextureMinFilter) {
    TextureMinFilter[TextureMinFilter["NEAREST"] = 9728] = "NEAREST";
    TextureMinFilter[TextureMinFilter["LINEAR"] = 9729] = "LINEAR";
    TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(TextureMinFilter || (TextureMinFilter = {}));
var TextureMagFilter;
(function (TextureMagFilter) {
    TextureMagFilter[TextureMagFilter["NEAREST"] = 9728] = "NEAREST";
    TextureMagFilter[TextureMagFilter["LINEAR"] = 9729] = "LINEAR";
})(TextureMagFilter || (TextureMagFilter = {}));
function _createTexture2D(gl, width, height, storageFormat, { min = TextureMinFilter.NEAREST, mag = TextureMagFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = {}) {
    return new Texture2D(gl, width, height, storageFormat, wrapS, wrapT, min, mag);
}
function _createTexture2DWithTypedArray(gl, width, height, storageFormat, data, dataFormat, dataType, options = {}) {
    const { min = TextureMinFilter.NEAREST, mag = TextureMagFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = options;
    return new Texture2D(gl, width, height, storageFormat, wrapS, wrapT, min, mag).store(data, dataFormat, dataType, options);
}
function _createTextureCubeMap(gl, width, height, storageFormat, { min = TextureMinFilter.NEAREST, mag = TextureMagFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, wrapR = TextureWrap.CLAMP_TO_EDGE, } = {}) {
    return new TextureCubeMap(gl, width, height, storageFormat, wrapS, wrapT, wrapR, min, mag);
}
function _createTextureCubeMapWithTypedArray(gl, width, height, storageFormat, dataPositiveX, dataNegativeX, dataPositiveY, dataNegativeY, dataPositiveZ, dataNegativeZ, dataFormat, dataType, options = {}) {
    const { min = TextureMinFilter.NEAREST, mag = TextureMagFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, wrapR = TextureWrap.CLAMP_TO_EDGE, } = options;
    return new TextureCubeMap(gl, width, height, storageFormat, wrapS, wrapT, wrapR, min, mag).store(dataPositiveX, dataNegativeX, dataPositiveY, dataNegativeY, dataPositiveZ, dataNegativeZ, dataFormat, dataType, options);
}
/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type. Data can be stored to textures either
 * from the CPU, via the `Texture2D.store()`, or they can be rendered to as
 * `Framebuffer` attachments. Data from textures can read in shaders via
 * sampling.
 */
class Texture2D {
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
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, rowAlignment(this.storageFormat));
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
/**
 * Cubemaps consist of 6 different textures conceptually layed out as faces of a
 * cube around origin [0, 0, 0]. Each of the 6 textures in a cubemap has the
 * same dimensions and storage format.
 * In shaders, cubemaps can be sampled using a vec3 interpreted as a direction
 * from origin. This makes cubemaps ideal to implement skyboxes and environment
 * mapping.
 */
class TextureCubeMap {
    constructor(gl, width, height, storageFormat, wrapS, wrapT, wrapR, minFilter, magFilter) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.wrapR = wrapR;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.glTexture = null;
        this.init();
    }
    /**
     * Reinitialize invalid cubemap, eg. after context is lost.
     */
    restore() {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) {
            this.init();
        }
    }
    /**
     * Upload new data to cubemap. Does not take ownership of data.
     * The 6 typed arrays must be of the same length.
     */
    store(dataPositiveX, dataNegativeX, dataPositiveY, dataNegativeY, dataPositiveZ, dataNegativeZ, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        is(dataNegativeX.length, dataPositiveX.length);
        is(dataPositiveY.length, dataPositiveX.length);
        is(dataNegativeY.length, dataPositiveX.length);
        is(dataPositiveZ.length, dataPositiveX.length);
        is(dataNegativeZ.length, dataPositiveX.length);
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_X, dataPositiveX, format, type, xOffset, yOffset, width, height);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, dataNegativeX, format, type, xOffset, yOffset, width, height);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, dataPositiveY, format, type, xOffset, yOffset, width, height);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, dataNegativeY, format, type, xOffset, yOffset, width, height);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, dataPositiveZ, format, type, xOffset, yOffset, width, height);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, dataNegativeZ, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's positive X face.
     * Does not take ownership of data.
     */
    storePositiveX(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_X, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's negative X face.
     * Does not take ownership of data.
     */
    storeNegativeX(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's positive Y face.
     * Does not take ownership of data.
     */
    storePositiveY(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's negative Y face.
     * Does not take ownership of data.
     */
    storeNegativeY(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's positive Z face.
     * Does not take ownership of data.
     */
    storePositiveZ(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Upload new data to cubemap's negative Z face.
     * Does not take ownership of data.
     */
    storeNegativeZ(data, format, type, { xOffset = 0, yOffset = 0, width = this.width, height = this.height, mipmap = false, } = {}) {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        this.storeFace(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, data, format, type, xOffset, yOffset, width, height);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    /**
     * Generate mipmap levels for the current data.
     */
    mipmap() {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_X);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }
    init() {
        const { gl, width, height, storageFormat, wrapS, wrapT, wrapR, minFilter, magFilter, } = this;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texStorage2D(gl.TEXTURE_CUBE_MAP, 1, // levels
        storageFormat, width, height);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, wrapR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        this.glTexture = texture;
    }
    storeFace(target, data, format, type, xOffset, yOffset, width, height) {
        const gl = this.gl;
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, rowAlignment(this.storageFormat));
        gl.texSubImage2D(target, 0, // level
        xOffset, yOffset, width, height, format, type, 
        // WebGL bug causes Uint8ClampedArray to be read incorrectly
        // https://github.com/KhronosGroup/WebGL/issues/1533
        data instanceof Uint8ClampedArray
            // Both buffers are u8 -> do not copy, just change lens
            ? new Uint8Array(data.buffer)
            // Other buffer types are fine
            : data);
    }
}
/**
 * OpenGL supports row alignments of 1, 2, 4, or 8. Each storage format consists
 * of a data type and number of channels, e.g. RGB16F has data type size of 2
 * byte and 3 channels.
 * This function finds the greatest possible safe alignment to fit the product
 * of the storage format's data type size and number of channels, e.g. for
 * RGB16F (2 bytes * 3 channels), the greatest safe row alignment is 2.
 */
function rowAlignment(storageFormat) {
    switch (storageFormat) {
        // RED
        case TextureColorStorageFormat.R8:
        case TextureColorStorageFormat.R8_SNORM:
        case TextureColorStorageFormat.R8UI:
        case TextureColorStorageFormat.R8I:
            return 1;
        case TextureColorStorageFormat.R16UI:
        case TextureColorStorageFormat.R16I:
        case TextureColorStorageFormat.R16F:
            return 2;
        case TextureColorStorageFormat.R32UI:
        case TextureColorStorageFormat.R32I:
        case TextureColorStorageFormat.R32F:
            return 4;
        // RG
        case TextureColorStorageFormat.RG8:
        case TextureColorStorageFormat.RG8_SNORM:
        case TextureColorStorageFormat.RG8UI:
        case TextureColorStorageFormat.RG8I:
            return 2;
        case TextureColorStorageFormat.RG16UI:
        case TextureColorStorageFormat.RG16I:
        case TextureColorStorageFormat.RG16F:
            return 4;
        case TextureColorStorageFormat.RG32UI:
        case TextureColorStorageFormat.RG32I:
        case TextureColorStorageFormat.RG32F:
            return 8;
        // RGB
        case TextureColorStorageFormat.RGB8:
        case TextureColorStorageFormat.RGB8_SNORM:
        case TextureColorStorageFormat.RGB8UI:
        case TextureColorStorageFormat.RGB8I:
            return 1;
        case TextureColorStorageFormat.RGB16UI:
        case TextureColorStorageFormat.RGB16I:
        case TextureColorStorageFormat.RGB16F:
            return 2;
        case TextureColorStorageFormat.RGB32UI:
        case TextureColorStorageFormat.RGB32I:
        case TextureColorStorageFormat.RGB32F:
            return 4;
        // RGBA
        case TextureColorStorageFormat.RGBA8:
        case TextureColorStorageFormat.RGBA8_SNORM:
        case TextureColorStorageFormat.RGBA8UI:
        case TextureColorStorageFormat.RGBA8I:
            return 4;
        case TextureColorStorageFormat.RGBA16UI:
        case TextureColorStorageFormat.RGBA16I:
        case TextureColorStorageFormat.RGBA16F:
            return 8;
        case TextureColorStorageFormat.RGBA32UI:
        case TextureColorStorageFormat.RGBA32I:
        case TextureColorStorageFormat.RGBA32F:
            return 8;
        // DEPTH
        case TextureDepthStorageFormat.DEPTH_COMPONENT16:
            return 2;
        case TextureDepthStorageFormat.DEPTH_COMPONENT24:
            return 1;
        case TextureDepthStorageFormat.DEPTH_COMPONENT32F:
            return 4;
        // DEPTH STEPNCIL
        case TextureDepthStencilStorageFormat.DEPTH24_STENCIL8:
            return 4;
        case TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8:
            // TODO: how is DEPTH32F_STENCUL8 represented in memory?
            return 1;
        default:
            return unreachable(storageFormat);
    }
}

var RenderbufferColorStorageFormat;
(function (RenderbufferColorStorageFormat) {
    // R
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R8"] = 33321] = "R8";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R8_SNORM"] = 36756] = "R8_SNORM";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R8UI"] = 33330] = "R8UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R8I"] = 33329] = "R8I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R16UI"] = 33332] = "R16UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R16I"] = 33331] = "R16I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R16F"] = 33325] = "R16F";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R32UI"] = 33334] = "R32UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R32I"] = 33333] = "R32I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["R32F"] = 33326] = "R32F";
    // RG
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG8"] = 33323] = "RG8";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG8_SNORM"] = 36757] = "RG8_SNORM";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG8UI"] = 33336] = "RG8UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG8I"] = 33335] = "RG8I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG16UI"] = 33338] = "RG16UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG16I"] = 33337] = "RG16I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG16F"] = 33327] = "RG16F";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG32UI"] = 33340] = "RG32UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG32I"] = 33339] = "RG32I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RG32F"] = 33328] = "RG32F";
    // RGBA
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA8"] = 32856] = "RGBA8";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA8_SNORM"] = 36759] = "RGBA8_SNORM";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA8I"] = 36238] = "RGBA8I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA16UI"] = 36214] = "RGBA16UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA16I"] = 36232] = "RGBA16I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA16F"] = 34842] = "RGBA16F";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA32UI"] = 36208] = "RGBA32UI";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA32I"] = 36226] = "RGBA32I";
    RenderbufferColorStorageFormat[RenderbufferColorStorageFormat["RGBA32F"] = 34836] = "RGBA32F";
})(RenderbufferColorStorageFormat || (RenderbufferColorStorageFormat = {}));
var RenderbufferDepthStorageFormat;
(function (RenderbufferDepthStorageFormat) {
    RenderbufferDepthStorageFormat[RenderbufferDepthStorageFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    RenderbufferDepthStorageFormat[RenderbufferDepthStorageFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    RenderbufferDepthStorageFormat[RenderbufferDepthStorageFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
})(RenderbufferDepthStorageFormat || (RenderbufferDepthStorageFormat = {}));
var RenderbufferDepthStencilStorageFormat;
(function (RenderbufferDepthStencilStorageFormat) {
    RenderbufferDepthStencilStorageFormat[RenderbufferDepthStencilStorageFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    RenderbufferDepthStencilStorageFormat[RenderbufferDepthStencilStorageFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
})(RenderbufferDepthStencilStorageFormat || (RenderbufferDepthStencilStorageFormat = {}));
function _createRenderbuffer(gl, width, height, storageFormat, { samples = 0 } = {}) {
    return new Renderbuffer(gl, width, height, storageFormat, samples);
}
/**
 * Renderbuffers are images of 2D data, similar to `Texture2D`. In contrast to
 * `Texture2D`, `Renderbuffer`s can only be written to on the GPU via rendering,
 * and they can not be sampled in shaders. `Framebuffer`s containing
 * `Renderbuffer` attachments can still be blit to other framebuffers.
 *
 * These limitations and the fact that their storage format is always optimized
 * for rendering should result in a performance improvement when rendering to
 * `Renderbuffer` attachments instead of `Texture2D`.
 *
 * One other difference compared to `Texture2D` is that `Renderbuffer`s can be
 * multisampled. If you need to combine multisampling with post processing, you
 * can first render the scene into a multisampled `Renderbuffer` attachment, and
 * afterwards blit it to a `Framebuffer` containing `Texture2D` attachments.
 */
class Renderbuffer {
    constructor(gl, width, height, storageFormat, samples) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.storageFormat = storageFormat;
        this.samples = samples;
        this.glRenderbuffer = null;
        this.init();
    }
    restore() {
        const { gl, glRenderbuffer } = this;
        if (!gl.isRenderbuffer(glRenderbuffer)) {
            this.init();
        }
    }
    init() {
        const { gl, width, height, storageFormat, samples } = this;
        const renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        if (samples) {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, storageFormat, width, height);
        }
        else {
            gl.renderbufferStorage(gl.RENDERBUFFER, storageFormat, width, height);
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        this.glRenderbuffer = renderbuffer;
    }
}

function _createFramebuffer(state, width, height, color, depthStencil) {
    const colors = (Array.isArray(color) ? color : [color]);
    if (IS_DEBUG_BUILD) {
        isNotEmpty(colors, () => {
            return "Framebuffer color attachments must not be empty";
        });
        for (const buffer of colors) {
            is(width, buffer.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            is(height, buffer.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }
        if (depthStencil) {
            is(width, depthStencil.width, (got, expected) => {
                return `Expected attachment width ${expected}, got ${got}`;
            });
            is(height, depthStencil.height, (got, expected) => {
                return `Expected attachment height ${expected}, got ${got}`;
            });
        }
    }
    return new Framebuffer(state, width, height, colors, depthStencil);
}
// TODO: _createFramebufferWithCubeMapFace
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
        this.glColorAttachments = new Array(colors.length);
        for (let i = 0; i < colors.length; ++i) {
            this.glColorAttachments[i] = state.gl.COLOR_ATTACHMENT0 + i;
        }
        this.glFramebuffer = null;
        this.framebufferTarget = null;
        this.init();
    }
    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore() {
        const { state: { gl }, glFramebuffer, colors, depthStencil, } = this;
        for (const buffer of colors) {
            buffer.restore();
        }
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
        // `init()` would overwrite and unbind the currently bound
        // `Target`'s FBO, so assert against it.
        // (`gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)` is called
        // at the end of `init()`).
        isTrue(state.isTargetUnlocked(), "Expected Target to be unlocked when performing Framebuffer init (would overwrite)");
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
        for (let i = 0; i < colors.length; ++i) {
            const buffer = colors[i];
            if (buffer instanceof Renderbuffer) {
                gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.RENDERBUFFER, buffer.glRenderbuffer);
            }
            else {
                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, buffer.glTexture, 0);
            }
        }
        if (depthStencil) {
            if (depthStencil instanceof Renderbuffer) {
                switch (depthStencil.storageFormat) {
                    case RenderbufferDepthStencilStorageFormat.DEPTH24_STENCIL8:
                    case RenderbufferDepthStencilStorageFormat.DEPTH32F_STENCIL8:
                        gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencil.glRenderbuffer);
                        break;
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT16:
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT24:
                    case RenderbufferDepthStorageFormat.DEPTH_COMPONENT32F:
                        gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthStencil.glRenderbuffer);
                        break;
                    default: unreachable(depthStencil, (p) => {
                        return `Unsupported framebuffer renderbuffer attachment: ${p}`;
                    });
                }
            }
            else {
                switch (depthStencil.storageFormat) {
                    case TextureDepthStencilStorageFormat.DEPTH24_STENCIL8:
                    case TextureDepthStencilStorageFormat.DEPTH32F_STENCIL8:
                        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthStencil.glTexture, 0);
                        break;
                    case TextureDepthStorageFormat.DEPTH_COMPONENT16:
                    case TextureDepthStorageFormat.DEPTH_COMPONENT24:
                    case TextureDepthStorageFormat.DEPTH_COMPONENT32F:
                        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthStencil.glTexture, 0);
                        break;
                    default: unreachable(depthStencil, (p) => {
                        return `Unsupported framebuffer texture attachment: ${p}`;
                    });
                }
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

/**
 * Available extensions.
 */
var Extension;
(function (Extension) {
    Extension["EXTColorBufferFloat"] = "EXT_color_buffer_float";
    Extension["OESTextureFloatLinear"] = "OES_texture_float_linear";
})(Extension || (Extension = {}));
class Device {
    constructor(gl, canvas, explicitPixelRatio, explicitViewportWidth, explicitViewportHeight) {
        this.gl = gl;
        this.canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewportWidth = explicitViewportWidth;
        this.explicitViewportHeight = explicitViewportHeight;
        this.resizeToFit();
        this.state = new State(gl);
        this.backbufferTarget = new Target(this.state, [gl.BACK], null, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // Enable scissor test globally. Practically everywhere you would want
        // it disabled you can pass explicit scissor box instead. The impact on
        // perf is negligent.
        gl.enable(gl.SCISSOR_TEST);
    }
    /**
     * Create a new device from existing `HTMLCanvasElement`. Does not take
     * ownership of canvas.
     */
    static createWithCanvasElement(canvas, options = {}) {
        const { alpha = true, antialias = true, depth = true, stencil = true, preserveDrawingBuffer = false, } = options;
        const gl = canvas.getContext("webgl2", {
            alpha,
            antialias,
            depth,
            stencil,
            preserveDrawingBuffer,
        });
        if (!gl) {
            throw new Error("Could not get WebGL2 context");
        }
        return Device.createWithWebGLContext(gl, options);
    }
    /**
     * Create a new device from existing WebGL context. Does not take ownership
     * of context, but concurrent usage may be the source of bugs. Be sure to
     * know what you are doing.
     *
     * Note that only contexts created from `HTMLCanvasElement` are supported
     * and contexts create from `OffscreenCanvas` will fail.
     *
     * Also see `device.reset()`.
     */
    static createWithWebGLContext(gl, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, } = {}) {
        // We need to check whether the provided canvas isn't offscreen, but
        // only if our current platform supports it. Note that `OffscreenCanvas`
        // is accessed from `globalThis` (falling back to `self` for older
        // platforms) to prevent name reference errors.
        let canvas;
        const g = typeof globalThis === "undefined" ? self : globalThis;
        if (g.OffscreenCanvas && gl.canvas instanceof g.OffscreenCanvas) {
            throw new Error("Offscreen canvas is not supported yet");
        }
        else {
            canvas = gl.canvas;
        }
        if (extensions) {
            extensions.forEach((ext) => {
                // We currently do not have extensions with callable API
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }
        if (debug) {
            gl = Object.entries(gl).reduce((accum, [k, v]) => (Object.assign(Object.assign({}, accum), { [k]: v === "function" ? createDebugFunc(gl, k) : v })), gl);
        }
        return new Device(gl, canvas, pixelRatio, viewportWidth, viewportHeight);
    }
    /**
     * Return width of the WebGL drawing buffer in physical (device)
     * pixels. This will usually be the same as
     * `device.requestedPhysicalWidth`, but can be smaller if WebGL
     * decides to allocate a smaller drawing buffer than requested,
     * e.g. when the size is not supported by hardware.
     */
    get physicalWidth() {
        return this.gl.drawingBufferWidth;
    }
    /**
     * Return height of the WebGL drawing buffer in physical
     * (device) pixels. This will usually be the same as
     * `device.requestedPhysicalHeight`, but can be smaller if WebGL
     * decides to allocate a smaller drawing buffer than requested,
     * e.g. when the size is not supported by hardware.
     */
    get physicalHeight() {
        return this.gl.drawingBufferHeight;
    }
    /**
     * Return width of the canvas in physical (device) pixels. This
     * will usually be the same as `device.physicalWidth`.
     */
    get requestedPhysicalWidth() {
        return this.canvas.width;
    }
    /**
     * Return height of the canvas in physical (device) pixels. This
     * will usually be the same as `device.physicalHeight`.
     */
    get requestedPhysicalHeight() {
        return this.canvas.height;
    }
    /**
     * Return width of canvas in logical (CSS) pixels (before applying
     * device pixel ratio). This is useful for e.g. computing the
     * position of mouse events.
     */
    get logicalWidth() {
        return this.canvas.clientWidth;
    }
    /**
     * Return height of canvas in logical (CSS) pixels (before
     * applying device pixel ratio). This is useful for e.g. computing
     * the position of mouse events.
     */
    get logicalHeight() {
        return this.canvas.clientHeight;
    }
    /**
     * Return the device pixel ratio for this device.
     */
    get pixelRatio() {
        return this.explicitPixelRatio || window.devicePixelRatio;
    }
    /**
     * Resize the canvas if the device pixel ratio or canvas
     * dimensions changed.
     */
    resizeToFit() {
        const dpr = this.pixelRatio;
        const canvas = this.canvas;
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
        return _createVertexBuffer(this.gl, type, size, options);
    }
    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createVertexBufferWithTypedArray(type, data, options) {
        return _createVertexBufferWithTypedArray(this.gl, type, data, options);
    }
    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    createElementBuffer(type, primitive, size, options) {
        return _createElementBuffer(this.gl, type, primitive, size, options);
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
        return _createElementBufferWithArray(this.gl, data, options);
    }
    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    createElementBufferWithTypedArray(type, primitive, data, options) {
        return _createElementBufferWithTypedArray(this.gl, type, primitive, data, options);
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
     * Create a new 2D texture with given width, height, and storage format.
     * The storage format determines what kind of data is possible to store.
     */
    createTexture2D(width, height, storageFormat, options) {
        return _createTexture2D(this.gl, width, height, storageFormat, options);
    }
    /**
     * Create a new 2D texture with width and height equal to that of the given
     * image and store the image in the texture.
     * The storage format determines what kind of data is possible to store and
     * is preset as RGBA8.
     */
    createTexture2DWithImage(image, options) {
        return _createTexture2DWithTypedArray(this.gl, image.width, image.height, TextureColorStorageFormat.RGBA8, image.data, TextureFormat.RGBA, TextureDataType.UNSIGNED_BYTE, options);
    }
    /**
     * Create a new 2D texture with given width, height, and storage format and
     * store data of given format and type contained in the provided typed array
     * to the texture.
     * The storage format determines what kind of data is possible to store.
     */
    createTexture2DWithTypedArray(width, height, storageFormat, data, dataFormat, dataType, options) {
        return _createTexture2DWithTypedArray(this.gl, width, height, storageFormat, data, dataFormat, dataType, options);
    }
    /**
     * Create a new cubemap texture where each face has a given width, height,
     * and storage format.
     * The storage format determines what kind of data is possible to store.
     */
    createTextureCubeMap(width, height, storageFormat, options) {
        return _createTextureCubeMap(this.gl, width, height, storageFormat, options);
    }
    /**
     * Create a new cubemap texture where each face has a width and height equal
     * to that of the given images and store the provided images in the
     * cubemap's faces.
     * The storage format determines what kind of data is possible to store and
     * is preset as RGBA8.
     * Each image must have the same dimensions.
     */
    createTextureCubeMapWithImage(imagePositiveX, imageNegativeX, imagePositiveY, imageNegativeY, imagePositiveZ, imageNegativeZ, options) {
        const width = imagePositiveX.width;
        const height = imagePositiveX.height;
        // Assert all images have same sizes
        is(imageNegativeX.width, width, fmtImageDimsMismatch);
        is(imagePositiveY.width, width, fmtImageDimsMismatch);
        is(imageNegativeY.width, width, fmtImageDimsMismatch);
        is(imagePositiveZ.width, width, fmtImageDimsMismatch);
        is(imageNegativeZ.width, width, fmtImageDimsMismatch);
        is(imageNegativeX.height, height, fmtImageDimsMismatch);
        is(imagePositiveY.height, height, fmtImageDimsMismatch);
        is(imageNegativeY.height, height, fmtImageDimsMismatch);
        is(imagePositiveZ.height, height, fmtImageDimsMismatch);
        is(imageNegativeZ.height, height, fmtImageDimsMismatch);
        return _createTextureCubeMapWithTypedArray(this.gl, imagePositiveX.width, imagePositiveY.height, TextureColorStorageFormat.RGBA8, imagePositiveX.data, imageNegativeX.data, imagePositiveY.data, imageNegativeY.data, imagePositiveZ.data, imageNegativeZ.data, TextureFormat.RGBA, TextureDataType.UNSIGNED_BYTE, options);
    }
    /**
     * Create a new cubemap texture where each face has a given width, height,
     * and storage format and store data contained in the provided typed arrays
     * in the cubemap's faces.
     * The storage format determines what kind of data is possible to store.
     * Each typed array must have the same length.
     */
    createTextureCubeMapWithTypedArray(width, height, storageFormat, dataPositiveX, dataNegativeX, dataPositiveY, dataNegativeY, dataPositiveZ, dataNegativeZ, dataFormat, dataType, options) {
        return _createTextureCubeMapWithTypedArray(this.gl, width, height, storageFormat, dataPositiveX, dataNegativeX, dataPositiveY, dataNegativeY, dataPositiveZ, dataNegativeZ, dataFormat, dataType, options);
    }
    /**
     * Create a new renderbuffer with given width, height, and storage format.
     * Pass in `options.samples` to configure multisampling.
     */
    createRenderbuffer(width, height, storageFormat, options) {
        return _createRenderbuffer(this.gl, width, height, storageFormat, options);
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
    /**
     * Reset all tracked WebGL state.
     *
     * Instead of always issuing calls to WebGL, we sometimes remember
     * various pieces of it's state ourselves. This works great for
     * preventing state transitions when rendering while keeping the
     * rendering code straightforward, but breaks apart once we have
     * to share the WebGL context with someone else.
     *
     * `device.reset()` is an escape hatch that notifies the device
     * that it should no longer trust the values it has
     * remembered. Use it when using `webglutenfree` with another
     * WebGL wrapper, such as `three.js`, or when needing to use the
     * GL context yourself. Note that calling `device.reset()` with
     * any resources bound is an error, i.e. don't do this:
     *
     * ```typescript
     * dev.target((rt) => {
     *     // Trying to reset the device while rendering is an error!
     *     dev.reset();
     * });
     * ```
     *
     * Also see `Device.createWithWebGLContext()`.
     */
    reset() {
        this.state.reset();
    }
}
function createDebugFunc(gl, key) {
    return () => {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}
function fmtImageDimsMismatch() {
    return "All provided images must have the same dimensions";
}

export { AttributeType, Attributes, BlendEquation, BlendFunc, BufferUsage, Command, DepthFunc, Device, ElementBuffer, ElementBufferDataType, ElementPrimitive, Extension, Framebuffer, Renderbuffer, RenderbufferColorStorageFormat, RenderbufferDepthStencilStorageFormat, RenderbufferDepthStorageFormat, StencilFunc, StencilOp, Target, TargetBlitFilter, TargetBufferBitmask, Texture2D, TextureColorStorageFormat, TextureCubeMap, TextureDataType, TextureDepthStencilStorageFormat, TextureDepthStorageFormat, TextureFormat, TextureMagFilter, TextureMinFilter, TextureWrap, UniformType, VertexBuffer, VertexBufferFloatDataType, VertexBufferIntegerDataType };
//# sourceMappingURL=webglutenfree.js.map
