/**
 * This file is an exercise in preprocessor voodoo.
 *
 * ""development"", gets suplied by the string replacer during build.
 * If "production", constant evaluation will eliminate the if blocks, making
 * the functions no-ops, in turn eligible for elimination from their callsites.
 *
 * It seems that newer versions of rollup no longer prune the functions away
 * due to some pessimization.
 */
function nonNull(p, fmt) {
    {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            const msg = fmt
                ? fmt(p)
                : `Assertion failed: object is undefined or null`;
            throw new Error(msg);
        }
    }
}
function nonEmpty(p, fmt) {
    {
        if (!p.length) {
            const msg = fmt
                ? fmt(p)
                : `Assertion failed: string or array is empty`;
            throw new Error(msg);
        }
    }
}
function equal(p, expected, fmt) {
    {
        if (p !== expected) {
            const msg = fmt
                ? fmt(p, expected)
                : `Assertion failed: values not equal. Expected ${expected}, got ${p}`;
            throw new Error(msg);
        }
    }
}
function oneOf(p, expected, fmt) {
    {
        if (!expected.includes(p)) {
            const msg = fmt
                ? fmt(p, expected)
                : `Assertion failed: Value ${p} is not one of expected ${expected}`;
            throw new Error(msg);
        }
    }
}
function gt(p, low, fmt) {
    {
        if (p <= low) {
            const msg = fmt
                ? fmt(p, low)
                : `Assertion failed: Value ${p} is lower or equal than expected ${low}`;
            throw new Error(msg);
        }
    }
}
function rangeInclusive(p, low, high, fmt) {
    {
        if (p < low || p > high) {
            const msg = fmt
                ? fmt(p, low, high)
                : `Assertion failed: Value ${p} is not in inclusive range [${low}, ${high}]`;
            throw new Error(msg);
        }
    }
}
function never(p, fmt) {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(p)
        : `Assertion failed: This branch should be unreachable`;
    throw new Error(msg);
}

/**
 * Possible buffer targets to operate on.
 */
var BufferBits;
(function (BufferBits) {
    BufferBits[BufferBits["COLOR"] = 16384] = "COLOR";
    BufferBits[BufferBits["DEPTH"] = 256] = "DEPTH";
    BufferBits[BufferBits["STENCIL"] = 1024] = "STENCIL";
    BufferBits[BufferBits["COLOR_DEPTH"] = 16640] = "COLOR_DEPTH";
    BufferBits[BufferBits["COLOR_STENCIL"] = 17408] = "COLOR_STENCIL";
    BufferBits[BufferBits["DEPTH_STENCIL"] = 1280] = "DEPTH_STENCIL";
    BufferBits[BufferBits["COLOR_DEPTH_STENCIL"] = 17664] = "COLOR_DEPTH_STENCIL";
})(BufferBits || (BufferBits = {}));
/**
 * Possible buffer usage.
 */
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
/**
 * Possible data types.
 */
var DataType;
(function (DataType) {
    DataType[DataType["BYTE"] = 5120] = "BYTE";
    DataType[DataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    DataType[DataType["SHORT"] = 5122] = "SHORT";
    DataType[DataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    DataType[DataType["INT"] = 5124] = "INT";
    DataType[DataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    DataType[DataType["FLOAT"] = 5126] = "FLOAT";
    DataType[DataType["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
    // TODO: support exotic formats
    // UNSIGNED_SHORT_4_4_4_4
    // UNSIGNED_SHORT_5_5_5_1
    // UNSIGNED_SHORT_5_6_5
    DataType[DataType["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
    // UNSIGNED_INT_5_9_9_9_REV
    // UNSIGNED_INT_2_10_10_10_REV
    // UNSIGNED_INT_10F_11F_11F_REV
    DataType[DataType["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
})(DataType || (DataType = {}));
/**
 * Possible data types.
 */
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
    // TODO: support exotic types
    // BOOL
})(UniformType || (UniformType = {}));
/**
 * Drawing primitives.
 */
var Primitive;
(function (Primitive) {
    Primitive[Primitive["POINTS"] = 0] = "POINTS";
    Primitive[Primitive["LINES"] = 1] = "LINES";
    Primitive[Primitive["LINE_LOOP"] = 2] = "LINE_LOOP";
    Primitive[Primitive["LINE_STRIP"] = 3] = "LINE_STRIP";
    Primitive[Primitive["TRIANGLES"] = 4] = "TRIANGLES";
    Primitive[Primitive["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    Primitive[Primitive["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(Primitive || (Primitive = {}));
function sizeOf(type) {
    switch (type) {
        case DataType.BYTE:
        case DataType.UNSIGNED_BYTE:
            return 1;
        case DataType.SHORT:
        case DataType.UNSIGNED_SHORT:
        case DataType.HALF_FLOAT:
            return 2;
        case DataType.INT:
        case DataType.UNSIGNED_INT:
        case DataType.UNSIGNED_INT_24_8:
        case DataType.FLOAT:
            return 4;
        case DataType.FLOAT_32_UNSIGNED_INT_24_8_REV:
            return 8;
        default: return never(type);
    }
}

class Stack {
    constructor(initialValue, onChange) {
        this.s = [initialValue];
        this.onChange = onChange;
    }
    push(value) {
        this.onChange(this.peek(), value, "push");
        this.s.push(value);
    }
    pop() {
        nonEmpty(this.s, () => "Stack must not be empty for pop");
        const prevValue = this.s.pop();
        this.onChange(prevValue, this.peek(), "pop");
        return prevValue;
    }
    peek() {
        nonEmpty(this.s, () => "Stack must never be empty for peek");
        return this.s[this.s.length - 1];
    }
}

/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
class Target {
    constructor(dev, glDrawBuffers, glFramebuffer, width, height) {
        this.dev = dev;
        this.glDrawBuffers = glDrawBuffers;
        this.glFramebuffer = glFramebuffer;
        this.width = width;
        this.height = height;
    }
    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     *
     * All drawing to the target should be done within the callback to prevent
     * unnecessary rebinding.
     */
    with(cb) {
        const { dev: { _gl, _stackDrawBuffers, _stackDrawFramebuffer }, glFramebuffer, glDrawBuffers, } = this;
        const { width = _gl.drawingBufferWidth, height = _gl.drawingBufferHeight, } = this;
        _stackDrawFramebuffer.push(glFramebuffer);
        _stackDrawBuffers.push(glDrawBuffers);
        _gl.viewport(0, 0, width, height);
        cb(this);
        _stackDrawFramebuffer.pop();
        _stackDrawBuffers.pop();
    }
    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(source, bits) {
        const { dev: { _gl, _stackReadFramebuffer }, width, height, } = this;
        this.with(() => {
            _stackReadFramebuffer.push(source.glFramebuffer);
            _gl.blitFramebuffer(0, 0, source.width, source.height, 0, 0, width || _gl.drawingBufferWidth, height || _gl.drawingBufferHeight, bits, _gl.NEAREST);
            _stackReadFramebuffer.pop();
        });
    }
    /**
     * Clear selected buffers to provided values.
     */
    clear(bits, { r = 0, g = 0, b = 0, a = 1, depth = 1, stencil = 0, } = {}) {
        this.with(() => {
            const gl = this.dev._gl;
            if (bits & BufferBits.COLOR) {
                gl.clearColor(r, g, b, a);
            }
            if (bits & BufferBits.DEPTH) {
                gl.clearDepth(depth);
            }
            if (bits & BufferBits.STENCIL) {
                gl.clearStencil(stencil);
            }
            gl.clear(bits);
        });
    }
    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     *
     * This is a unified header to stisfy the typechecker.
     */
    draw(cmd, attrs, props) {
        const { dev: { _stackVertexArray, _stackProgram, _stackDepthTest, _stackStencilTest, _stackBlend, }, } = this;
        const { glProgram, depthDescr, stencilDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
        this.with(() => {
            _stackDepthTest.push(depthDescr);
            _stackStencilTest.push(stencilDescr);
            _stackBlend.push(blendDescr);
            _stackProgram.push(glProgram);
            this.textures(textureAccessors, props, 0);
            this.uniforms(uniformDescrs, props, 0);
            // Note that attrs.glVertexArray may be null for empty attrs -> ok
            _stackVertexArray.push(attrs.glVertexArray);
            if (attrs.indexed) {
                this.drawElements(attrs.primitive, attrs.elementCount, attrs.indexType, 0, // offset
                attrs.instanceCount);
            }
            else {
                this.drawArrays(attrs.primitive, attrs.count, 0, // offset
                attrs.instanceCount);
            }
            _stackVertexArray.pop();
            _stackBlend.pop();
            _stackStencilTest.pop();
            _stackDepthTest.pop();
            _stackProgram.pop();
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
    batch(cmd, cb) {
        const { dev: { _stackVertexArray, _stackProgram, _stackDepthTest, _stackStencilTest, _stackBlend, }, } = this;
        const { glProgram, depthDescr, stencilDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
        // The price for gl.useProgram, enabling depth/stencil tests and
        // blending is paid only once for all draw calls in batch, unless API
        // is badly abused and the draw() callback is called outside ot batch()
        // Perform shared batch setup
        _stackDepthTest.push(depthDescr);
        _stackStencilTest.push(stencilDescr);
        _stackBlend.push(blendDescr);
        _stackProgram.push(glProgram);
        let iter = 0;
        cb((attrs, props) => {
            // with() ensures the original target is still bound
            this.with(() => {
                iter++;
                // TODO: find a way to restore vertex array rebinding
                // optimization
                // Ensure the shared setup still holds
                _stackDepthTest.push(depthDescr);
                _stackStencilTest.push(stencilDescr);
                _stackBlend.push(blendDescr);
                _stackProgram.push(glProgram);
                this.textures(textureAccessors, props, iter);
                this.uniforms(uniformDescrs, props, iter);
                _stackVertexArray.push(attrs.glVertexArray);
                if (attrs.indexed) {
                    this.drawElements(attrs.primitive, attrs.elementCount, attrs.indexType, 0, // offset
                    attrs.instanceCount);
                }
                else {
                    this.drawArrays(attrs.primitive, attrs.count, 0, // offset
                    attrs.instanceCount);
                }
                _stackVertexArray.pop();
                _stackProgram.pop();
                _stackBlend.pop();
                _stackStencilTest.pop();
                _stackDepthTest.pop();
            });
        });
        _stackProgram.pop();
        _stackBlend.pop();
        _stackStencilTest.pop();
        _stackDepthTest.pop();
    }
    drawArrays(primitive, count, offset, instanceCount) {
        const gl = this.dev._gl;
        if (instanceCount) {
            gl.drawArraysInstanced(primitive, offset, count, instanceCount);
        }
        else {
            gl.drawArrays(primitive, offset, count);
        }
    }
    drawElements(primitive, count, type, offset, instCount) {
        const gl = this.dev._gl;
        if (instCount) {
            gl.drawElementsInstanced(primitive, count, type, offset, instCount);
        }
        else {
            gl.drawElements(primitive, count, type, offset);
        }
    }
    textures(textureAccessors, props, index) {
        const gl = this.dev._gl;
        textureAccessors.forEach((accessor, i) => {
            const tex = access(props, index, accessor);
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tex.glTexture);
        });
    }
    uniforms(uniformDescrs, props, index) {
        const gl = this.dev._gl;
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
                    never(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }
}
function access(props, index, value) { return typeof value === "function" ? value(props, index) : value; }

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
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
class Command {
    constructor(dev, vsSource, fsSource, textures, uniforms, depthDescr, stencilDescr, blendDescr) {
        this.dev = dev;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.textures = textures;
        this.uniforms = uniforms;
        this.depthDescr = depthDescr || null;
        this.stencilDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;
        this.glProgram = null;
        this.textureAccessors = [];
        this.uniformDescrs = [];
        this.init();
    }
    static create(dev, vert, frag, { textures = {}, uniforms = {}, depth, stencil, blend, } = {}) {
        nonNull(vert, fmtParamNonNull("vert"));
        nonNull(frag, fmtParamNonNull("frag"));
        if (depth) {
            nonNull(depth.func, fmtParamNonNull("depth.func"));
        }
        if (blend) {
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
        if (stencil) {
            nonNull(stencil.func, fmtParamNonNull("stencil.func"));
            // TODO: complete stencil validation... validation framework?
        }
        const depthDescr = parseDepth(depth);
        const stencilDescr = parseStencil(stencil);
        const blendDescr = parseBlend(blend);
        return new Command(dev, vert, frag, textures, uniforms, depthDescr, stencilDescr, blendDescr);
    }
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore() {
        const { dev: { _gl }, glProgram } = this;
        if (!_gl.isProgram(glProgram)) {
            this.init();
        }
    }
    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes) {
        const { dev: { _gl }, glProgram } = this;
        return Object.entries(attributes)
            .reduce((accum, [identifier, definition]) => {
            if (INT_PATTERN.test(identifier)) {
                accum[identifier] = definition;
            }
            else {
                const location = _gl.getAttribLocation(glProgram, identifier);
                if (location === UNKNOWN_ATTRIB_LOCATION) {
                    throw new Error(`No location for attrib: ${identifier}`);
                }
                accum[location] = definition;
            }
            return accum;
        }, {});
    }
    init() {
        const { dev: { _gl, _stackProgram }, vsSource, fsSource, textures, uniforms, } = this;
        const vs = createShader(_gl, _gl.VERTEX_SHADER, vsSource);
        const fs = createShader(_gl, _gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(_gl, vs, fs);
        _gl.deleteShader(vs);
        _gl.deleteShader(fs);
        // Validation time! (only for nonproduction envs)
        {
            if (!prog) {
                // ctx loss or not, we can panic all we want in nonprod env!
                throw new Error("Program was not compiled, possible reason: context loss");
            }
            validateUniformDeclarations(_gl, prog, uniforms, textures);
        }
        _stackProgram.push(prog);
        // Texture declarations are evaluated in two phases:
        // 1) Sampler location offsets are sent to the shader eagerly
        // 2) Textures are bound to the locations at draw time
        // Note that Object.entries provides values in a nondeterministic order,
        // but we store the descriptors in an array, remembering the order.
        const textureAccessors = [];
        Object.entries(textures).forEach(([ident, t], i) => {
            const loc = _gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for sampler: ${ident}`);
            }
            _gl.uniform1i(loc, i);
            textureAccessors.push(t);
        });
        // Some uniform declarations can be evaluated right away, so do it at
        // init-time. Create a descriptor for the rest that is evaluated at
        // render-time.
        const uniformDescrs = [];
        Object.entries(uniforms).forEach(([ident, u]) => {
            const loc = _gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }
            if (typeof u.value !== "function") {
                // Eagerly send everything we can process now to GPU
                switch (u.type) {
                    case "1f":
                        _gl.uniform1f(loc, u.value);
                        break;
                    case "1fv":
                        _gl.uniform1fv(loc, u.value);
                        break;
                    case "1i":
                        _gl.uniform1i(loc, u.value);
                        break;
                    case "1iv":
                        _gl.uniform1iv(loc, u.value);
                        break;
                    case "1ui":
                        _gl.uniform1ui(loc, u.value);
                        break;
                    case "1uiv":
                        _gl.uniform1uiv(loc, u.value);
                        break;
                    case "2f": {
                        const [x, y] = u.value;
                        _gl.uniform2f(loc, x, y);
                        break;
                    }
                    case "2fv":
                        _gl.uniform2fv(loc, u.value);
                        break;
                    case "2i": {
                        const [x, y] = u.value;
                        _gl.uniform2i(loc, x, y);
                        break;
                    }
                    case "2iv":
                        _gl.uniform2iv(loc, u.value);
                        break;
                    case "2ui": {
                        const [x, y] = u.value;
                        _gl.uniform2ui(loc, x, y);
                        break;
                    }
                    case "2uiv":
                        _gl.uniform2uiv(loc, u.value);
                        break;
                    case "3f": {
                        const [x, y, z] = u.value;
                        _gl.uniform3f(loc, x, y, z);
                        break;
                    }
                    case "3fv":
                        _gl.uniform3fv(loc, u.value);
                        break;
                    case "3i": {
                        const [x, y, z] = u.value;
                        _gl.uniform3i(loc, x, y, z);
                        break;
                    }
                    case "3iv":
                        _gl.uniform3iv(loc, u.value);
                        break;
                    case "3ui": {
                        const [x, y, z] = u.value;
                        _gl.uniform3ui(loc, x, y, z);
                        break;
                    }
                    case "3uiv":
                        _gl.uniform3uiv(loc, u.value);
                        break;
                    case "4f": {
                        const [x, y, z, w] = u.value;
                        _gl.uniform4f(loc, x, y, z, w);
                        break;
                    }
                    case "4fv":
                        _gl.uniform4fv(loc, u.value);
                        break;
                    case "4i": {
                        const [x, y, z, w] = u.value;
                        _gl.uniform4i(loc, x, y, z, w);
                        break;
                    }
                    case "4iv":
                        _gl.uniform4iv(loc, u.value);
                        break;
                    case "4ui": {
                        const [x, y, z, w] = u.value;
                        _gl.uniform4ui(loc, x, y, z, w);
                        break;
                    }
                    case "4uiv":
                        _gl.uniform4uiv(loc, u.value);
                        break;
                    case "matrix2fv":
                        _gl.uniformMatrix2fv(loc, false, u.value);
                        break;
                    case "matrix3fv":
                        _gl.uniformMatrix3fv(loc, false, u.value);
                        break;
                    case "matrix4fv":
                        _gl.uniformMatrix4fv(loc, false, u.value);
                        break;
                    default: never(u);
                }
            }
            else {
                // Store a descriptor for lazy values for later use
                uniformDescrs.push(new UniformDescriptor(ident, loc, u));
            }
        });
        _stackProgram.pop();
        this.glProgram = prog;
        this.textureAccessors = textureAccessors;
        this.uniformDescrs = uniformDescrs;
    }
}
class DepthDescriptor {
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
class StencilDescriptor {
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
class UniformDescriptor {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}
function parseDepth(depth) {
    if (!depth) {
        return undefined;
    }
    return new DepthDescriptor(depth.func || DepthFunc.LESS, typeof depth.mask === "boolean" ? depth.mask : true, depth.range ? depth.range[0] : 0, depth.range ? depth.range[1] : 1);
}
function parseStencil(stencil) {
    if (!stencil) {
        return undefined;
    }
    return new StencilDescriptor(typeof stencil.func.func === "object"
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
function createProgram(gl, vertex, fragment) {
    const program = gl.createProgram();
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
    for (let i = 0; i < nUniforms; ++i) {
        const info = gl.getActiveUniform(prog, i);
        // Naming collision-wise, it is safe to trim "[0]"
        // It only indicates an array uniform, which we can not validate too well
        const key = info.name.includes("[0]")
            ? info.name.substring(0, info.name.length - 3)
            : info.name;
        progUniforms.set(key, info);
    }
    // The "list" of uniforms left to check from the program's perspective
    const toCheck = new Set(progUniforms.keys());
    Object.entries(uniforms).map(([name, tyObj]) => {
        const type = tyObj.type;
        if (progUniforms.has(name)) {
            const progUniform = progUniforms.get(name);
            validateUniformDeclaration(gl, progUniform, type);
        }
        else {
            throw new Error(`Redundant uniform [name = ${name}, type = ${type}]`);
        }
        toCheck.delete(name);
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
        default: never(type);
    }
}
function fmtParamNonNull(name) {
    return () => `Missing parameter ${name}`;
}
function fmtTyMismatch(name) {
    return () => `Type mismatch for uniform field ${name}`;
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
    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options = {}) {
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
    static withCanvas(canvas, options = {}) {
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
        return Device.withContext(gl, options);
    }
    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static withContext(gl, { pixelRatio, viewport, extensions, debug, } = {}) {
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
        const dev = new Device(gl, gl.canvas, pixelRatio, viewport);
        dev.update();
        return dev;
    }
    constructor(gl, canvas, explicitPixelRatio, explicitViewport) {
        this._gl = gl;
        this._canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewport = explicitViewport;
        this.backbufferTarget = new Target(this, [gl.BACK], null);
        this._stackVertexArray = new Stack(null, (prev, val) => prev === val ? void 0 : gl.bindVertexArray(val));
        this._stackProgram = new Stack(null, (prev, val) => prev === val ? void 0 : gl.useProgram(val));
        this._stackDepthTest = new Stack(null, (prev, val) => {
            if (!DepthDescriptor.equals(prev, val)) {
                if (val) {
                    gl.enable(gl.DEPTH_TEST);
                    gl.depthFunc(val.func);
                    gl.depthMask(val.mask);
                    gl.depthRange(val.rangeStart, val.rangeEnd);
                }
                else {
                    gl.disable(gl.DEPTH_TEST);
                }
            }
        });
        this._stackStencilTest = new Stack(null, (prev, val) => {
            if (!StencilDescriptor.equals(prev, val)) {
                if (val) {
                    const { fFn, bFn, fFnRef, bFnRef, fFnMask, bFnMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass, } = val;
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
        });
        this._stackBlend = new Stack(null, (prev, val) => {
            if (!BlendDescriptor.equals(prev, val)) {
                if (val) {
                    gl.enable(gl.BLEND);
                    gl.blendFuncSeparate(val.srcRGB, val.dstRGB, val.srcAlpha, val.dstAlpha);
                    gl.blendEquationSeparate(val.eqnRGB, val.eqnAlpha);
                    if (val.color) {
                        const [r, g, b, a] = val.color;
                        gl.blendColor(r, g, b, a);
                    }
                }
                else {
                    gl.disable(gl.BLEND);
                }
            }
        });
        // Note: DRAW_FRAMEBUFFER and READ_FRAMEBUFFER are handled separately
        // to support blitting. In library code, gl.FRAMEBUFFER target must
        // never be used, as it overwrites READ_FRAMEBUFFER and DRAW_FRAMEBUFFER
        this._stackDrawFramebuffer = new Stack(null, (prev, val) => prev === val
            ? void 0
            : gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, val));
        this._stackReadFramebuffer = new Stack(null, (prev, val) => prev === val
            ? void 0
            : gl.bindFramebuffer(gl.READ_FRAMEBUFFER, val));
        this._stackDrawBuffers = new Stack([gl.BACK], (prev, val) => eqNumberArrays(prev, val)
            ? void 0
            : gl.drawBuffers(val));
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
        const width = this.explicitViewport
            && this.explicitViewport[0]
            || canvas.clientWidth * dpr;
        const height = this.explicitViewport
            && this.explicitViewport[1]
            || canvas.clientHeight * dpr;
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
}
function createDebugFunc(gl, key) {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
}
function eqNumberArrays(left, right) {
    if (left === right) {
        return true;
    }
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
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
     * Create a new vertex buffer with given type and of given size.
     */
    static create(dev, type, size, { usage = BufferUsage.DYNAMIC_DRAW } = {}) {
        return new VertexBuffer(dev._gl, type, size, size * sizeOf(type), usage);
    }
    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    static withTypedArray(dev, type, data, { usage = BufferUsage.STATIC_DRAW } = {}) {
        return new VertexBuffer(dev._gl, type, data.length, data.length * sizeOf(type), usage).store(data);
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
        const { type, gl, glBuffer } = this;
        const buffer = Array.isArray(data)
            ? createBuffer(type, data)
            // Note: we have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
                ? new Uint8Array(data)
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
function createBuffer(type, arr) {
    switch (type) {
        case DataType.BYTE: return new Int8Array(arr);
        case DataType.SHORT: return new Int16Array(arr);
        case DataType.INT: return new Int32Array(arr);
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        case DataType.FLOAT: return new Float32Array(arr);
        default: return never(type, (p) => `Invalid buffer type: ${p}`);
    }
}

/**
 * Chacks whether array is at least 2d, mostly useful because of return type
 * predicate.
 */
function isArray2(array) {
    return !!array.length && Array.isArray(array[0]);
}
function shape2(array) {
    const outer = array.length;
    const inner = outer ? array[0].length : 0;
    return [outer, inner];
}
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
     * Create a new element buffer with given type, primitive, and size.
     */
    static create(dev, type, primitive, size, { usage = BufferUsage.DYNAMIC_DRAW } = {}) {
        return new ElementBuffer(dev._gl, type, primitive, size, size * sizeOf(type), usage);
    }
    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    static withArray(dev, data, options) {
        if (isArray2(data)) {
            const shape = shape2(data);
            rangeInclusive(shape[1], 2, 3, (p) => {
                return `Elements must be 2-tuples or 3-tuples, got ${p}-tuple`;
            });
            const ravel = ravel2(data, shape);
            const primitive = shape[1] === 3
                ? Primitive.TRIANGLES
                : Primitive.LINES;
            return ElementBuffer.withTypedArray(dev, DataType.UNSIGNED_INT, primitive, ravel);
        }
        return ElementBuffer.withTypedArray(dev, DataType.UNSIGNED_INT, Primitive.POINTS, data, options);
    }
    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    static withTypedArray(dev, type, primitive, data, { usage = BufferUsage.STATIC_DRAW } = {}) {
        return new ElementBuffer(dev._gl, type, primitive, data.length, data.length * sizeOf(type), usage).store(data);
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
        const { type, gl, glBuffer } = this;
        const buffer = Array.isArray(data)
            ? createBuffer$1(type, data)
            // Note: we have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
                ? new Uint8Array(data)
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
function createBuffer$1(type, arr) {
    switch (type) {
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        default: return never(type, (p) => `invalid buffer type: ${p}`);
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
/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
class Attributes {
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
    static create(dev, elements, attributes, { countLimit } = {}) {
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
            return AttributeDescriptor.create(dev, location, definition);
        });
        let primitive;
        let elementBuffer;
        if (typeof elements === "number") {
            primitive = elements;
        }
        else {
            elementBuffer = elements instanceof ElementBuffer
                ? elements
                : ElementBuffer.withArray(dev, elements);
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
        return new Attributes(dev, primitive, attrs, count, instanceCount, elementBuffer);
    }
    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    static empty(dev, primitive, count) {
        return new Attributes(dev, primitive, [], count, 0);
    }
    constructor(dev, primitive, attributes, count, instanceCount, elements) {
        this.dev = dev;
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
        const { dev: { _gl }, glVertexArray, attributes, elementBuffer } = this;
        if (elementBuffer) {
            elementBuffer.restore();
        }
        attributes.forEach((attr) => attr.buffer.restore());
        // If we have no attributes nor elements, there is no need to restore
        // any GPU state
        if (!this.hasAttribs() && !_gl.isVertexArray(glVertexArray)) {
            this.init();
        }
    }
    init() {
        // Do not create the gl vao if there are no buffers to bind
        if (this.hasAttribs()) {
            return;
        }
        const { dev: { _gl, _stackVertexArray }, attributes, elementBuffer, } = this;
        const vao = _gl.createVertexArray();
        _stackVertexArray.push(vao);
        attributes.forEach(({ location, type, buffer: { glBuffer, type: glBufferType }, size, normalized = false, divisor, }) => {
            // Enable sending attribute arrays for location
            _gl.enableVertexAttribArray(location);
            // Send buffer
            _gl.bindBuffer(_gl.ARRAY_BUFFER, glBuffer);
            switch (type) {
                case AttributeType.POINTER:
                    _gl.vertexAttribPointer(location, size, glBufferType, normalized, 0, 0);
                    break;
                case AttributeType.IPOINTER:
                    _gl.vertexAttribIPointer(location, size, glBufferType, 0, 0);
                    break;
                default: never(type);
            }
            if (divisor) {
                _gl.vertexAttribDivisor(location, divisor);
            }
        });
        if (elementBuffer) {
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, elementBuffer.glBuffer);
        }
        _stackVertexArray.pop();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
        if (elementBuffer) {
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
        }
        this.glVertexArray = vao;
    }
    hasAttribs() {
        // IF we have either attributes or elements, this geometry can not
        // longer be considered empty.
        return !this.elementBuffer && !this.attributes.length;
    }
}
// TODO: this could use some further refactoring. Currently its just former
// public API made private.
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
    static create(dev, location, props) {
        if (Array.isArray(props)) {
            if (isArray2(props)) {
                const s = shape2(props);
                const r = ravel2(props, s);
                return new AttributeDescriptor(location, AttributeType.POINTER, VertexBuffer.withTypedArray(dev, DataType.FLOAT, r), s[0], s[1], false, 0);
            }
            return new AttributeDescriptor(location, AttributeType.POINTER, VertexBuffer.withTypedArray(dev, DataType.FLOAT, props), props.length, 1, false, 0);
        }
        return new AttributeDescriptor(location, props.type, Array.isArray(props.buffer)
            ? VertexBuffer.withTypedArray(dev, DataType.FLOAT, props.buffer)
            : props.buffer, props.count, props.size, props.type === AttributeType.POINTER
            ? (props.normalized || false)
            : false, props.divisor || 0);
    }
}

var TextureWrap;
(function (TextureWrap) {
    TextureWrap[TextureWrap["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    TextureWrap[TextureWrap["REPEAT"] = 10497] = "REPEAT";
    TextureWrap[TextureWrap["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(TextureWrap || (TextureWrap = {}));
var TextureFilter;
(function (TextureFilter) {
    TextureFilter[TextureFilter["NEAREST"] = 9728] = "NEAREST";
    TextureFilter[TextureFilter["LINEAR"] = 9729] = "LINEAR";
    TextureFilter[TextureFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    TextureFilter[TextureFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    TextureFilter[TextureFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    TextureFilter[TextureFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(TextureFilter || (TextureFilter = {}));
var TextureInternalFormat;
(function (TextureInternalFormat) {
    // RED
    TextureInternalFormat[TextureInternalFormat["R8"] = 33321] = "R8";
    TextureInternalFormat[TextureInternalFormat["R8_SNORM"] = 36756] = "R8_SNORM";
    TextureInternalFormat[TextureInternalFormat["R8UI"] = 33330] = "R8UI";
    TextureInternalFormat[TextureInternalFormat["R8I"] = 33329] = "R8I";
    TextureInternalFormat[TextureInternalFormat["R16UI"] = 33332] = "R16UI";
    TextureInternalFormat[TextureInternalFormat["R16I"] = 33331] = "R16I";
    TextureInternalFormat[TextureInternalFormat["R32UI"] = 33334] = "R32UI";
    TextureInternalFormat[TextureInternalFormat["R32I"] = 33333] = "R32I";
    TextureInternalFormat[TextureInternalFormat["R16F"] = 33325] = "R16F";
    TextureInternalFormat[TextureInternalFormat["R32F"] = 33326] = "R32F";
    // RG
    TextureInternalFormat[TextureInternalFormat["RG8"] = 33323] = "RG8";
    TextureInternalFormat[TextureInternalFormat["RG8_SNORM"] = 36757] = "RG8_SNORM";
    TextureInternalFormat[TextureInternalFormat["RG8UI"] = 33336] = "RG8UI";
    TextureInternalFormat[TextureInternalFormat["RG8I"] = 33335] = "RG8I";
    TextureInternalFormat[TextureInternalFormat["RG16UI"] = 33338] = "RG16UI";
    TextureInternalFormat[TextureInternalFormat["RG16I"] = 33337] = "RG16I";
    TextureInternalFormat[TextureInternalFormat["RG32UI"] = 33340] = "RG32UI";
    TextureInternalFormat[TextureInternalFormat["RG32I"] = 33339] = "RG32I";
    TextureInternalFormat[TextureInternalFormat["RG16F"] = 33327] = "RG16F";
    TextureInternalFormat[TextureInternalFormat["RG32F"] = 33328] = "RG32F";
    // RGB
    TextureInternalFormat[TextureInternalFormat["RGB8"] = 32849] = "RGB8";
    TextureInternalFormat[TextureInternalFormat["RGB8_SNORM"] = 36758] = "RGB8_SNORM";
    TextureInternalFormat[TextureInternalFormat["RGB8UI"] = 36221] = "RGB8UI";
    TextureInternalFormat[TextureInternalFormat["RGB8I"] = 36239] = "RGB8I";
    TextureInternalFormat[TextureInternalFormat["RGB16UI"] = 36215] = "RGB16UI";
    TextureInternalFormat[TextureInternalFormat["RGB16I"] = 36233] = "RGB16I";
    TextureInternalFormat[TextureInternalFormat["RGB32UI"] = 36209] = "RGB32UI";
    TextureInternalFormat[TextureInternalFormat["RGB32I"] = 36227] = "RGB32I";
    TextureInternalFormat[TextureInternalFormat["RGB16F"] = 34843] = "RGB16F";
    TextureInternalFormat[TextureInternalFormat["RGB32F"] = 34837] = "RGB32F";
    // RGBA
    TextureInternalFormat[TextureInternalFormat["RGBA8"] = 32856] = "RGBA8";
    TextureInternalFormat[TextureInternalFormat["RGBA8_SNORM"] = 36759] = "RGBA8_SNORM";
    TextureInternalFormat[TextureInternalFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    TextureInternalFormat[TextureInternalFormat["RGBA8I"] = 36238] = "RGBA8I";
    TextureInternalFormat[TextureInternalFormat["RGBA16UI"] = 36214] = "RGBA16UI";
    TextureInternalFormat[TextureInternalFormat["RGBA16I"] = 36232] = "RGBA16I";
    TextureInternalFormat[TextureInternalFormat["RGBA32UI"] = 36208] = "RGBA32UI";
    TextureInternalFormat[TextureInternalFormat["RGBA32I"] = 36226] = "RGBA32I";
    TextureInternalFormat[TextureInternalFormat["RGBA16F"] = 34842] = "RGBA16F";
    TextureInternalFormat[TextureInternalFormat["RGBA32F"] = 34836] = "RGBA32F";
    // TODO: support exotic formats
    // DEPTH
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    TextureInternalFormat[TextureInternalFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
    // DEPTH STENCIL
    TextureInternalFormat[TextureInternalFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    TextureInternalFormat[TextureInternalFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(TextureInternalFormat || (TextureInternalFormat = {}));
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
/**
 * Textures are images of 2D data, where each texel can contain multiple
 * information channels of a certain type.
 */
class Texture {
    constructor(gl, width, height, format, wrapS, wrapT, minFilter, magFilter) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.format = format;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.glTexture = null;
        this.init();
    }
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     */
    static create(dev, width, height, internalFormat, { min = TextureFilter.NEAREST, mag = TextureFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = {}) {
        return new Texture(dev._gl, width, height, internalFormat, wrapS, wrapT, min, mag);
    }
    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    static withImage(dev, image, options) {
        return Texture.withTypedArray(dev, image.width, image.height, TextureInternalFormat.RGBA8, image.data, TextureFormat.RGBA, DataType.UNSIGNED_BYTE, options);
    }
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    static withTypedArray(dev, width, height, internalFormat, data, dataFormat, dataType, options = {}) {
        const { min = TextureFilter.NEAREST, mag = TextureFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = options;
        return new Texture(dev._gl, width, height, internalFormat, wrapS, wrapT, min, mag).store(data, dataFormat, dataType, options);
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
        // Chrome does not handle Uint8ClampedArray well
        data instanceof Uint8ClampedArray ? new Uint8Array(data) : data);
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
        const { gl, width, height, format, wrapS, wrapT, minFilter, magFilter, } = this;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texStorage2D(gl.TEXTURE_2D, 1, format, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.glTexture = texture;
    }
}

/**
 * Framebuffers store the list of attachments to write to during a draw
 * operation. They can be a draw target via `framebuffer.target()`
 */
class Framebuffer {
    /**
     * Create a framebuffer containg one or more color buffers and a
     * depth or depth-stencil buffer with given width and height.
     *
     * Does not take ownership of provided attachments, only references them.
     * It is still an error to use the attachments while they are written to
     * via the framebuffer, however.
     */
    static create(dev, width, height, color, depthStencil) {
        const colors = Array.isArray(color) ? color : [color];
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
        return new Framebuffer(dev, width, height, colors, depthStencil);
    }
    constructor(dev, width, height, colors, depthStencil) {
        this.dev = dev;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.depthStencil = depthStencil;
        this.glColorAttachments = colors
            .map((_, i) => dev._gl.COLOR_ATTACHMENT0 + i);
        this.glFramebuffer = null;
        this.framebufferTarget = null;
        this.init();
    }
    /**
     * Reinitialize invalid framebuffer, eg. after context is lost.
     */
    restore() {
        const { dev: { _gl }, glFramebuffer, colors, depthStencil, } = this;
        colors.forEach((buffer) => buffer.restore());
        if (depthStencil) {
            depthStencil.restore();
        }
        if (!_gl.isFramebuffer(glFramebuffer)) {
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
        const { width, height, dev, dev: { _gl, _stackDrawFramebuffer }, glColorAttachments, colors, depthStencil, } = this;
        const fbo = _gl.createFramebuffer();
        _stackDrawFramebuffer.push(fbo);
        colors.forEach((buffer, i) => {
            _gl.framebufferTexture2D(_gl.DRAW_FRAMEBUFFER, _gl.COLOR_ATTACHMENT0 + i, _gl.TEXTURE_2D, buffer.glTexture, 0);
        });
        if (depthStencil) {
            switch (depthStencil.format) {
                case TextureInternalFormat.DEPTH24_STENCIL8:
                case TextureInternalFormat.DEPTH32F_STENCIL8:
                    _gl.framebufferTexture2D(_gl.DRAW_FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.TEXTURE_2D, depthStencil.glTexture, 0);
                    break;
                case TextureInternalFormat.DEPTH_COMPONENT16:
                case TextureInternalFormat.DEPTH_COMPONENT24:
                case TextureInternalFormat.DEPTH_COMPONENT32F:
                    _gl.framebufferTexture2D(_gl.DRAW_FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, depthStencil.glTexture, 0);
                    break;
                default: never(depthStencil, (p) => {
                    return `Unsupported attachment: ${p}`;
                });
            }
        }
        const status = _gl.checkFramebufferStatus(_gl.DRAW_FRAMEBUFFER);
        _stackDrawFramebuffer.pop();
        if (status !== _gl.FRAMEBUFFER_COMPLETE) {
            _gl.deleteFramebuffer(fbo);
            switch (status) {
                case _gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                case _gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                case _gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                case _gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw new Error("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                case _gl.FRAMEBUFFER_UNSUPPORTED:
                    throw new Error("FRAMEBUFFER_UNSUPPORTED");
                default: throw new Error("Framebuffer incomplete");
            }
        }
        this.glFramebuffer = fbo;
        if (fbo) {
            this.framebufferTarget = new Target(dev, glColorAttachments, fbo, width, height);
        }
    }
}

export { BufferBits, BufferUsage, DataType, Primitive, Device, Extension, Command, DepthFunc, StencilFunc, StencilOp, BlendFunc, BlendEquation, VertexBuffer, ElementBuffer, Attributes, AttributeType, Texture, TextureFilter, TextureWrap, TextureInternalFormat, TextureFormat, Framebuffer };
//# sourceMappingURL=webglutenfree.es.js.map
