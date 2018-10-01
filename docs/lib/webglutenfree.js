/**
 * Shim NODE_ENV in node's `process.env`. Our production build replaces
 * all usages making the shim eligible for DCE. Downstream source users can use
 * replacers or envifiers achieve the same.
 */

function isTrue(got, fmt) {
    {
        if (got !== true) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not true`;
            throw new Error(msg);
        }
    }
}
function isFalse(got, fmt) {
    {
        if (got !== false) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not false`;
            throw new Error(msg);
        }
    }
}
function nonNull(got, fmt) {
    {
        if (typeof got === "undefined" || typeof got === "object" && !got) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
            throw new Error(msg);
        }
    }
}
function nonEmpty(got, fmt) {
    {
        if (!got.length) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array value empty`;
            throw new Error(msg);
        }
    }
}
function equal(got, expected, fmt) {
    {
        if (got !== expected) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not equal to ${expected}`;
            throw new Error(msg);
        }
    }
}
function oneOf(got, expected, fmt) {
    {
        if (!expected.includes(got)) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not in ${expected}`;
            throw new Error(msg);
        }
    }
}
function gt(got, low, fmt) {
    {
        if (got <= low) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not GT than expected ${low}`;
            throw new Error(msg);
        }
    }
}
function rangeInclusive(got, low, high, fmt) {
    {
        if (got < low || got > high) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
}
function unreachable(got, fmt) {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
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
var InternalFormat;
(function (InternalFormat) {
    // RED
    InternalFormat[InternalFormat["R8"] = 33321] = "R8";
    InternalFormat[InternalFormat["R8_SNORM"] = 36756] = "R8_SNORM";
    InternalFormat[InternalFormat["R8UI"] = 33330] = "R8UI";
    InternalFormat[InternalFormat["R8I"] = 33329] = "R8I";
    InternalFormat[InternalFormat["R16UI"] = 33332] = "R16UI";
    InternalFormat[InternalFormat["R16I"] = 33331] = "R16I";
    InternalFormat[InternalFormat["R32UI"] = 33334] = "R32UI";
    InternalFormat[InternalFormat["R32I"] = 33333] = "R32I";
    InternalFormat[InternalFormat["R16F"] = 33325] = "R16F";
    InternalFormat[InternalFormat["R32F"] = 33326] = "R32F";
    // RG
    InternalFormat[InternalFormat["RG8"] = 33323] = "RG8";
    InternalFormat[InternalFormat["RG8_SNORM"] = 36757] = "RG8_SNORM";
    InternalFormat[InternalFormat["RG8UI"] = 33336] = "RG8UI";
    InternalFormat[InternalFormat["RG8I"] = 33335] = "RG8I";
    InternalFormat[InternalFormat["RG16UI"] = 33338] = "RG16UI";
    InternalFormat[InternalFormat["RG16I"] = 33337] = "RG16I";
    InternalFormat[InternalFormat["RG32UI"] = 33340] = "RG32UI";
    InternalFormat[InternalFormat["RG32I"] = 33339] = "RG32I";
    InternalFormat[InternalFormat["RG16F"] = 33327] = "RG16F";
    InternalFormat[InternalFormat["RG32F"] = 33328] = "RG32F";
    // RGB
    InternalFormat[InternalFormat["RGB8"] = 32849] = "RGB8";
    InternalFormat[InternalFormat["RGB8_SNORM"] = 36758] = "RGB8_SNORM";
    InternalFormat[InternalFormat["RGB8UI"] = 36221] = "RGB8UI";
    InternalFormat[InternalFormat["RGB8I"] = 36239] = "RGB8I";
    InternalFormat[InternalFormat["RGB16UI"] = 36215] = "RGB16UI";
    InternalFormat[InternalFormat["RGB16I"] = 36233] = "RGB16I";
    InternalFormat[InternalFormat["RGB32UI"] = 36209] = "RGB32UI";
    InternalFormat[InternalFormat["RGB32I"] = 36227] = "RGB32I";
    InternalFormat[InternalFormat["RGB16F"] = 34843] = "RGB16F";
    InternalFormat[InternalFormat["RGB32F"] = 34837] = "RGB32F";
    // RGBA
    InternalFormat[InternalFormat["RGBA8"] = 32856] = "RGBA8";
    InternalFormat[InternalFormat["RGBA8_SNORM"] = 36759] = "RGBA8_SNORM";
    InternalFormat[InternalFormat["RGBA8UI"] = 36220] = "RGBA8UI";
    InternalFormat[InternalFormat["RGBA8I"] = 36238] = "RGBA8I";
    InternalFormat[InternalFormat["RGBA16UI"] = 36214] = "RGBA16UI";
    InternalFormat[InternalFormat["RGBA16I"] = 36232] = "RGBA16I";
    InternalFormat[InternalFormat["RGBA32UI"] = 36208] = "RGBA32UI";
    InternalFormat[InternalFormat["RGBA32I"] = 36226] = "RGBA32I";
    InternalFormat[InternalFormat["RGBA16F"] = 34842] = "RGBA16F";
    InternalFormat[InternalFormat["RGBA32F"] = 34836] = "RGBA32F";
    // TODO: support exotic formats
    // DEPTH
    InternalFormat[InternalFormat["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
    InternalFormat[InternalFormat["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
    InternalFormat[InternalFormat["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
    // DEPTH STENCIL
    InternalFormat[InternalFormat["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
    InternalFormat[InternalFormat["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(InternalFormat || (InternalFormat = {}));
var Format;
(function (Format) {
    Format[Format["RED"] = 6403] = "RED";
    Format[Format["RG"] = 33319] = "RG";
    Format[Format["RGB"] = 6407] = "RGB";
    Format[Format["RGBA"] = 6408] = "RGBA";
    Format[Format["RED_INTEGER"] = 36244] = "RED_INTEGER";
    Format[Format["RG_INTEGER"] = 33320] = "RG_INTEGER";
    Format[Format["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
    Format[Format["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
    // TODO: support exotic formats
    Format[Format["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    Format[Format["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(Format || (Format = {}));
var Filter;
(function (Filter) {
    Filter[Filter["NEAREST"] = 9728] = "NEAREST";
    Filter[Filter["LINEAR"] = 9729] = "LINEAR";
    Filter[Filter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    Filter[Filter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    Filter[Filter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    Filter[Filter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(Filter || (Filter = {}));
var Wrap;
(function (Wrap) {
    Wrap[Wrap["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    Wrap[Wrap["REPEAT"] = 10497] = "REPEAT";
    Wrap[Wrap["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(Wrap || (Wrap = {}));
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
        default: return unreachable(type);
    }
}

const FUNCTIONS = [
    "activeTexture",
    "attachShader",
    "bindAttribLocation",
    "bindBuffer",
    "bindFramebuffer",
    "bindRenderbuffer",
    "bindTexture",
    "bindVertexArray",
    "blendColor",
    "blendEquation",
    "blendEquationSeparate",
    "blendFunc",
    "blendFuncSeparate",
    "bufferData",
    "bufferSubData",
    "checkFramebufferStatus",
    "clear",
    "clearColor",
    "clearDepth",
    "clearStencil",
    "colorMask",
    "compileShader",
    "compressedTexImage2D",
    "compressedTexSubImage2D",
    "copyTexImage2D",
    "copyTexSubImage2D",
    "createBuffer",
    "createFramebuffer",
    "createProgram",
    "createRenderbuffer",
    "createShader",
    "createTexture",
    "createVertexArray",
    "cullFace",
    "deleteBuffer",
    "deleteFramebuffer",
    "deleteProgram",
    "deleteRenderbuffer",
    "deleteShader",
    "deleteTexture",
    "depthFunc",
    "depthMask",
    "depthRange",
    "detachShader",
    "disable",
    "disableVertexAttribArray",
    "drawArrays",
    "drawBuffers",
    "drawElements",
    "enable",
    "enableVertexAttribArray",
    "finish",
    "flush",
    "framebufferRenderbuffer",
    "framebufferTexture2D",
    "frontFace",
    "generateMipmap",
    "getActiveAttrib",
    "getActiveUniform",
    "getAttachedShaders",
    "getAttribLocation",
    "getBufferParameter",
    "getContextAttributes",
    "getError",
    "getExtension",
    "getFramebufferAttachmentParameter",
    "getParameter",
    "getProgramParameter",
    "getProgramInfoLog",
    "getRenderbufferParameter",
    "getShaderParameter",
    "getShaderInfoLog",
    "getShaderPrecisionFormat",
    "getShaderSource",
    "getSupportedExtensions",
    "getTexParameter",
    "getUniform",
    "getUniformLocation",
    "getVertexAttrib",
    "getVertexAttribOffset",
    "hint",
    "isBuffer",
    "isContextLost",
    "isEnabled",
    "isFramebuffer",
    "isProgram",
    "isRenderbuffer",
    "isShader",
    "isTexture",
    "lineWidth",
    "linkProgram",
    "pixelStorei",
    "polygonOffset",
    "readPixels",
    "renderbufferStorage",
    "sampleCoverage",
    "scissor",
    "shaderSource",
    "stencilFunc",
    "stencilFuncSeparate",
    "stencilMask",
    "stencilMaskSeparate",
    "stencilOp",
    "stencilOpSeparate",
    "texParameterf",
    "texParameteri",
    "texImage2D",
    "texSubImage2D",
    "uniform1f",
    "uniform1fv",
    "uniform1i",
    "uniform1iv",
    "uniform2f",
    "uniform2fv",
    "uniform2i",
    "uniform2iv",
    "uniform3f",
    "uniform3fv",
    "uniform3i",
    "uniform3iv",
    "uniform4f",
    "uniform4fv",
    "uniform4i",
    "uniform4iv",
    "uniformMatrix2fv",
    "uniformMatrix3fv",
    "uniformMatrix4fv",
    "useProgram",
    "validateProgram",
    "vertexAttrib1f",
    "vertexAttrib1fv",
    "vertexAttrib2f",
    "vertexAttrib2fv",
    "vertexAttrib3f",
    "vertexAttrib3fv",
    "vertexAttrib4f",
    "vertexAttrib4fv",
    "vertexAttribPointer",
    "viewport",
];
const ENUMS = {
    DEPTH_BUFFER_BIT: 256,
    STENCIL_BUFFER_BIT: 1024,
    COLOR_BUFFER_BIT: 16384,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 768,
    ONE_MINUS_SRC_COLOR: 769,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
    DST_ALPHA: 772,
    ONE_MINUS_DST_ALPHA: 773,
    DST_COLOR: 774,
    ONE_MINUS_DST_COLOR: 775,
    SRC_ALPHA_SATURATE: 776,
    FUNC_ADD: 32774,
    BLEND_EQUATION: 32777,
    BLEND_EQUATION_RGB: 32777,
    BLEND_EQUATION_ALPHA: 34877,
    FUNC_SUBTRACT: 32778,
    FUNC_REVERSE_SUBTRACT: 32779,
    BLEND_DST_RGB: 32968,
    BLEND_SRC_RGB: 32969,
    BLEND_DST_ALPHA: 32970,
    BLEND_SRC_ALPHA: 32971,
    CONSTANT_COLOR: 32769,
    ONE_MINUS_CONSTANT_COLOR: 32770,
    CONSTANT_ALPHA: 32771,
    ONE_MINUS_CONSTANT_ALPHA: 32772,
    BLEND_COLOR: 32773,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    ARRAY_BUFFER_BINDING: 34964,
    ELEMENT_ARRAY_BUFFER_BINDING: 34965,
    STREAM_DRAW: 35040,
    STATIC_DRAW: 35044,
    DYNAMIC_DRAW: 35048,
    BUFFER_SIZE: 34660,
    BUFFER_USAGE: 34661,
    CURRENT_VERTEX_ATTRIB: 34342,
    FRONT: 1028,
    BACK: 1029,
    FRONT_AND_BACK: 1032,
    TEXTURE_2D: 3553,
    CULL_FACE: 2884,
    BLEND: 3042,
    DITHER: 3024,
    STENCIL_TEST: 2960,
    DEPTH_TEST: 2929,
    SCISSOR_TEST: 3089,
    POLYGON_OFFSET_FILL: 32823,
    SAMPLE_ALPHA_TO_COVERAGE: 32926,
    SAMPLE_COVERAGE: 32928,
    NO_ERROR: 0,
    INVALID_ENUM: 1280,
    INVALID_VALUE: 1281,
    INVALID_OPERATION: 1282,
    OUT_OF_MEMORY: 1285,
    CW: 2304,
    CCW: 2305,
    LINE_WIDTH: 2849,
    ALIASED_POINT_SIZE_RANGE: 33901,
    ALIASED_LINE_WIDTH_RANGE: 33902,
    CULL_FACE_MODE: 2885,
    FRONT_FACE: 2886,
    DEPTH_RANGE: 2928,
    DEPTH_WRITEMASK: 2930,
    DEPTH_CLEAR_VALUE: 2931,
    DEPTH_FUNC: 2932,
    STENCIL_CLEAR_VALUE: 2961,
    STENCIL_FUNC: 2962,
    STENCIL_FAIL: 2964,
    STENCIL_PASS_DEPTH_FAIL: 2965,
    STENCIL_PASS_DEPTH_PASS: 2966,
    STENCIL_REF: 2967,
    STENCIL_VALUE_MASK: 2963,
    STENCIL_WRITEMASK: 2968,
    STENCIL_BACK_FUNC: 34816,
    STENCIL_BACK_FAIL: 34817,
    STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
    STENCIL_BACK_PASS_DEPTH_PASS: 34819,
    STENCIL_BACK_REF: 36003,
    STENCIL_BACK_VALUE_MASK: 36004,
    STENCIL_BACK_WRITEMASK: 36005,
    VIEWPORT: 2978,
    SCISSOR_BOX: 3088,
    COLOR_CLEAR_VALUE: 3106,
    COLOR_WRITEMASK: 3107,
    UNPACK_ALIGNMENT: 3317,
    PACK_ALIGNMENT: 3333,
    MAX_TEXTURE_SIZE: 3379,
    MAX_VIEWPORT_DIMS: 3386,
    SUBPIXEL_BITS: 3408,
    RED_BITS: 3410,
    GREEN_BITS: 3411,
    BLUE_BITS: 3412,
    ALPHA_BITS: 3413,
    DEPTH_BITS: 3414,
    STENCIL_BITS: 3415,
    POLYGON_OFFSET_UNITS: 10752,
    POLYGON_OFFSET_FACTOR: 32824,
    TEXTURE_BINDING_2D: 32873,
    SAMPLE_BUFFERS: 32936,
    SAMPLES: 32937,
    SAMPLE_COVERAGE_VALUE: 32938,
    SAMPLE_COVERAGE_INVERT: 32939,
    COMPRESSED_TEXTURE_FORMATS: 34467,
    DONT_CARE: 4352,
    FASTEST: 4353,
    NICEST: 4354,
    GENERATE_MIPMAP_HINT: 33170,
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    INT: 5124,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    DEPTH_COMPONENT: 6402,
    ALPHA: 6406,
    RGB: 6407,
    RGBA: 6408,
    LUMINANCE: 6409,
    LUMINANCE_ALPHA: 6410,
    UNSIGNED_SHORT_4_4_4_4: 32819,
    UNSIGNED_SHORT_5_5_5_1: 32820,
    UNSIGNED_SHORT_5_6_5: 33635,
    FRAGMENT_SHADER: 35632,
    VERTEX_SHADER: 35633,
    MAX_VERTEX_ATTRIBS: 34921,
    MAX_VERTEX_UNIFORM_VECTORS: 36347,
    MAX_VARYING_VECTORS: 36348,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
    MAX_TEXTURE_IMAGE_UNITS: 34930,
    MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
    SHADER_TYPE: 35663,
    DELETE_STATUS: 35712,
    LINK_STATUS: 35714,
    VALIDATE_STATUS: 35715,
    ATTACHED_SHADERS: 35717,
    ACTIVE_UNIFORMS: 35718,
    ACTIVE_ATTRIBUTES: 35721,
    SHADING_LANGUAGE_VERSION: 35724,
    CURRENT_PROGRAM: 35725,
    NEVER: 512,
    LESS: 513,
    EQUAL: 514,
    LEQUAL: 515,
    GREATER: 516,
    NOTEQUAL: 517,
    GEQUAL: 518,
    ALWAYS: 519,
    KEEP: 7680,
    REPLACE: 7681,
    INCR: 7682,
    DECR: 7683,
    INVERT: 5386,
    INCR_WRAP: 34055,
    DECR_WRAP: 34056,
    VENDOR: 7936,
    RENDERER: 7937,
    VERSION: 7938,
    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987,
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE: 5890,
    TEXTURE_CUBE_MAP: 34067,
    TEXTURE_BINDING_CUBE_MAP: 34068,
    TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
    MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
    TEXTURE0: 33984,
    TEXTURE1: 33985,
    TEXTURE2: 33986,
    TEXTURE3: 33987,
    TEXTURE4: 33988,
    TEXTURE5: 33989,
    TEXTURE6: 33990,
    TEXTURE7: 33991,
    TEXTURE8: 33992,
    TEXTURE9: 33993,
    TEXTURE10: 33994,
    TEXTURE11: 33995,
    TEXTURE12: 33996,
    TEXTURE13: 33997,
    TEXTURE14: 33998,
    TEXTURE15: 33999,
    TEXTURE16: 34000,
    TEXTURE17: 34001,
    TEXTURE18: 34002,
    TEXTURE19: 34003,
    TEXTURE20: 34004,
    TEXTURE21: 34005,
    TEXTURE22: 34006,
    TEXTURE23: 34007,
    TEXTURE24: 34008,
    TEXTURE25: 34009,
    TEXTURE26: 34010,
    TEXTURE27: 34011,
    TEXTURE28: 34012,
    TEXTURE29: 34013,
    TEXTURE30: 34014,
    TEXTURE31: 34015,
    ACTIVE_TEXTURE: 34016,
    REPEAT: 10497,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    INT_VEC2: 35667,
    INT_VEC3: 35668,
    INT_VEC4: 35669,
    BOOL: 35670,
    BOOL_VEC2: 35671,
    BOOL_VEC3: 35672,
    BOOL_VEC4: 35673,
    FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    SAMPLER_2D: 35678,
    SAMPLER_CUBE: 35680,
    VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
    VERTEX_ATTRIB_ARRAY_SIZE: 34339,
    VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
    VERTEX_ATTRIB_ARRAY_TYPE: 34341,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
    VERTEX_ATTRIB_ARRAY_POINTER: 34373,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
    IMPLEMENTATION_COLOR_READ_TYPE: 35738,
    IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
    COMPILE_STATUS: 35713,
    LOW_FLOAT: 36336,
    MEDIUM_FLOAT: 36337,
    HIGH_FLOAT: 36338,
    LOW_INT: 36339,
    MEDIUM_INT: 36340,
    HIGH_INT: 36341,
    FRAMEBUFFER: 36160,
    RENDERBUFFER: 36161,
    RGBA4: 32854,
    RGB5_A1: 32855,
    RGB565: 36194,
    DEPTH_COMPONENT16: 33189,
    STENCIL_INDEX: 6401,
    STENCIL_INDEX8: 36168,
    DEPTH_STENCIL: 34041,
    RENDERBUFFER_WIDTH: 36162,
    RENDERBUFFER_HEIGHT: 36163,
    RENDERBUFFER_INTERNAL_FORMAT: 36164,
    RENDERBUFFER_RED_SIZE: 36176,
    RENDERBUFFER_GREEN_SIZE: 36177,
    RENDERBUFFER_BLUE_SIZE: 36178,
    RENDERBUFFER_ALPHA_SIZE: 36179,
    RENDERBUFFER_DEPTH_SIZE: 36180,
    RENDERBUFFER_STENCIL_SIZE: 36181,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
    COLOR_ATTACHMENT0: 36064,
    DEPTH_ATTACHMENT: 36096,
    STENCIL_ATTACHMENT: 36128,
    DEPTH_STENCIL_ATTACHMENT: 33306,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 36053,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
    FRAMEBUFFER_UNSUPPORTED: 36061,
    FRAMEBUFFER_BINDING: 36006,
    RENDERBUFFER_BINDING: 36007,
    MAX_RENDERBUFFER_SIZE: 34024,
    INVALID_FRAMEBUFFER_OPERATION: 1286,
    UNPACK_FLIP_Y_WEBGL: 37440,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
    CONTEXT_LOST_WEBGL: 37442,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
    BROWSER_DEFAULT_WEBGL: 37444,
};
class WebGL2RenderingContextMock {
    constructor(canvas) {
        this.canvas = canvas;
        this.drawingBufferWidth = canvas.width;
        this.drawingBufferHeight = canvas.height;
    }
    getExtension(_) {
        return null;
    }
}
// mock FUNCTIONS
FUNCTIONS.forEach((fn) => {
    WebGL2RenderingContextMock.prototype[fn] = () => ({});
});
// mock ENUMS
Object.keys(ENUMS).forEach((key) => {
    WebGL2RenderingContextMock.prototype[key] = ENUMS[key];
});

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
/**
 * Tracks binding of `Command`s for each `Device`. Each `Device` must have at
 * most one `Command` bound at any time. Nested command binding is not supported
 * even though it is not prohibited by the shape of the API:
 *
 * // This produces a runtime error
 * dev.target((rt) => {
 *     rt.batch(cmd, (draw) => {
 *         rt.draw(cmd, attrs, props);
 *     });
 * });
 *
 * WeakSet is used instead of `private static` variables, as there can be
 * multiple `Device`s owning the commands.
 */
const COMMAND_BINDINGS = new WeakSet();
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
        this.depthTestDescr = depthDescr || null;
        this.stencilTestDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;
        this.glProgram = null;
        this.init();
    }
    static create(dev, vert, frag, { textures = {}, uniforms = {}, depth, stencil, blend, } = {}) {
        nonNull(vert, fmtParamNonNull("vert"));
        nonNull(frag, fmtParamNonNull("frag"));
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
        const { dev, dev: { _gl: gl }, vsSource, fsSource, textures, uniforms, } = this;
        // We would overwrite the currently bound program unless we checked
        if (COMMAND_BINDINGS.has(dev)) {
            throw new Error("A command for this device is already bound");
        }
        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        // Validation time! (only for nonproduction envs)
        {
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
class DepthTestDescriptor {
    constructor(func, mask, rangeStart, rangeEnd) {
        this.func = func;
        this.mask = mask;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
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
    nonNull(depth.func, fmtParamNonNull("depth.func"));
    return new DepthTestDescriptor(depth.func || DepthFunc.LESS, typeof depth.mask === "boolean" ? depth.mask : true, depth.range ? depth.range[0] : 0, depth.range ? depth.range[1] : 1);
}
function parseStencil(stencil) {
    if (!stencil) {
        return undefined;
    }
    nonNull(stencil.func, fmtParamNonNull("stencil.func"));
    // TODO: complete stencil validation... validation framework?
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
function fmtParamNonNull(name) {
    return () => `Missing parameter ${name}`;
}
function fmtTyMismatch(name) {
    return () => `Type mismatch for uniform field ${name}`;
}

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
const TARGET_BINDINGS = new WeakSet();
const GL_NONE = 0;
const DRAW_BUFFERS_NONE = [GL_NONE];
/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
class Target {
    constructor(dev, glDrawBuffers, glFramebuffer, surfaceWidth, surfaceHeight) {
        this.dev = dev;
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
        const { dev, dev: { _gl: gl }, glFramebuffer, glDrawBuffers, } = this;
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
    clear(bits, { r = 0, g = 0, b = 0, a = 1, depth = 1, stencil = 0, scissorX = 0, scissorY = 0, scissorWidth = this.surfaceWidth === void 0
        ? this.dev._gl.drawingBufferWidth
        : this.surfaceWidth, scissorHeight = this.surfaceHeight === void 0
        ? this.dev._gl.drawingBufferHeight
        : this.surfaceHeight, } = {}) {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform clear");
        }
        gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
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
    }
    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(source, bits, { srcX = 0, srcY = 0, srcWidth = source.width, srcHeight = source.height, dstX = 0, dstY = 0, dstWidth = this.surfaceWidth === void 0
        ? this.dev._gl.drawingBufferWidth
        : this.surfaceWidth, dstHeight = this.surfaceHeight === void 0
        ? this.dev._gl.drawingBufferHeight
        : this.surfaceHeight, filter = Filter.NEAREST, scissorX = dstX, scissorY = dstY, scissorWidth = dstWidth, scissorHeight = dstHeight, } = {}) {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform blit");
        }
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
        ? this.dev._gl.drawingBufferWidth
        : this.surfaceWidth, viewportHeight = this.surfaceHeight === void 0
        ? this.dev._gl.drawingBufferHeight
        : this.surfaceHeight, scissorX = viewportX, scissorY = viewportY, scissorWidth = viewportWidth, scissorHeight = viewportHeight, } = {}) {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform draw");
        }
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
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
    batch(cmd, cb, { viewportX = 0, viewportY = 0, viewportWidth = this.surfaceWidth === void 0
        ? this.dev._gl.drawingBufferWidth
        : this.surfaceWidth, viewportHeight = this.surfaceHeight === void 0
        ? this.dev._gl.drawingBufferHeight
        : this.surfaceHeight, scissorX = viewportX, scissorY = viewportY, scissorWidth = viewportWidth, scissorHeight = viewportHeight, } = {}) {
        const { dev, dev: { _gl: gl } } = this;
        if (!TARGET_BINDINGS.has(dev)) {
            throw new Error("A target must be bound to perform batch");
        }
        const { glProgram, depthTestDescr, stencilTestDescr, blendDescr, textureAccessors, uniformDescrs, } = cmd;
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
        cb((attrs, props) => {
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
        gl.useProgram(null);
        this.blend(null);
        this.stencilTest(null);
        this.depthTest(null);
        COMMAND_BINDINGS.delete(dev);
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
                    unreachable(def, () => `Unknown uniform: ${ident}`);
                    break;
            }
        });
    }
    depthTest(desc) {
        const gl = this.dev._gl;
        if (desc) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(desc.func);
            gl.depthMask(desc.mask);
            gl.depthRange(desc.rangeStart, desc.rangeEnd);
        }
        else {
            gl.disable(gl.DEPTH_TEST);
        }
    }
    stencilTest(desc) {
        const gl = this.dev._gl;
        if (desc) {
            const { fFn, bFn, fFnRef, bFnRef, fFnMask, bFnMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass, } = desc;
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
    blend(desc) {
        const gl = this.dev._gl;
        if (desc) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(desc.srcRGB, desc.dstRGB, desc.srcAlpha, desc.dstAlpha);
            gl.blendEquationSeparate(desc.eqnRGB, desc.eqnAlpha);
            if (desc.color) {
                const [r, g, b, a] = desc.color;
                gl.blendColor(r, g, b, a);
            }
        }
        else {
            gl.disable(gl.BLEND);
        }
    }
}
function access(props, index, value) { return typeof value === "function" ? value(props, index) : value; }

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
     * context, but concurrent usage of it voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static withContext(gl, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, } = {}) {
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
    /**
     * Create a mock device for tests, without canvas or WebGL context.
     */
    static mock() {
        {
            const gl = new WebGL2RenderingContextMock({
                width: 800,
                height: 600,
                clientWidth: 800,
                clientHeight: 600,
            });
            // Make sure the implementation does not ask things of window by
            // providing explicit values for dpr and viewport dimensions
            // TODO: should we mock window and pass it as a parameter?
            return new Device(gl, 1, 800, 600);
        }
        throw new Error("Mocking is not supported in production builds");
    }
    constructor(gl, explicitPixelRatio, explicitViewportWidth, explicitViewportHeight) {
        this._gl = gl;
        this._canvas = gl.canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewportWidth = explicitViewportWidth;
        this.explicitViewportHeight = explicitViewportHeight;
        this.update();
        this.backbufferTarget = new Target(this, [gl.BACK], null, gl.drawingBufferWidth, gl.drawingBufferHeight);
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
}
function createDebugFunc(gl, key) {
    return function debugWrapper() {
        console.debug(`DEBUG ${key} ${Array.from(arguments)}`);
        return gl[key].apply(gl, arguments);
    };
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
            // WebGL bug causes Uint8ClampedArray to be read incorrectly
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
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
function createBuffer(type, arr) {
    switch (type) {
        case DataType.BYTE: return new Int8Array(arr);
        case DataType.SHORT: return new Int16Array(arr);
        case DataType.INT: return new Int32Array(arr);
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        case DataType.FLOAT: return new Float32Array(arr);
        default: return unreachable(type, (p) => {
            return `Invalid buffer type: ${p}`;
        });
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
    // Do some asserts if not production
    {
        array.forEach((sub) => {
            const isSubArray = Array.isArray(sub);
            if (length2 !== -1) {
                isTrue(isSubArray);
                equal(sub.length, length2);
            }
            else {
                isFalse(isSubArray);
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
        if (is2(data)) {
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
            // WebGL bug causes Uint8ClampedArray to be read incorrectly
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
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
function createBuffer$1(type, arr) {
    switch (type) {
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        default: return unreachable(type, (p) => {
            return `invalid buffer type: ${p}`;
        });
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
        if (this.hasAttribs() && !_gl.isVertexArray(glVertexArray)) {
            this.init();
        }
    }
    init() {
        // Do not create the gl vao if there are no buffers to bind
        if (!this.hasAttribs()) {
            return;
        }
        const { dev: { _gl: gl }, attributes, elementBuffer } = this;
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
            if (is2(props)) {
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
    static create(dev, width, height, internalFormat, { min = Filter.NEAREST, mag = Filter.NEAREST, wrapS = Wrap.CLAMP_TO_EDGE, wrapT = Wrap.CLAMP_TO_EDGE, } = {}) {
        return new Texture(dev._gl, width, height, internalFormat, wrapS, wrapT, min, mag);
    }
    /**
     * Create a new texture with width and height equal to the given image, and
     * store the image in the texture.
     */
    static withImage(dev, image, options) {
        return Texture.withTypedArray(dev, image.width, image.height, InternalFormat.RGBA8, image.data, Format.RGBA, DataType.UNSIGNED_BYTE, options);
    }
    /**
     * Create a new texture with given width, height, and internal format.
     * The internal format determines, what kind of data is possible to store.
     * Store data of given format and type contained in a typed array to the
     * texture.
     */
    static withTypedArray(dev, width, height, internalFormat, data, dataFormat, dataType, options = {}) {
        const { min = Filter.NEAREST, mag = Filter.NEAREST, wrapS = Wrap.CLAMP_TO_EDGE, wrapT = Wrap.CLAMP_TO_EDGE, } = options;
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
        const { width, height, dev, dev: { _gl: gl }, glColorAttachments, colors, depthStencil, } = this;
        // This would overwrite a the currently bound `Target`s FBO
        if (TARGET_BINDINGS.has(dev)) {
            throw new Error("Cannot bind framebuffers while a Target is bound");
        }
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
        colors.forEach((buffer, i) => {
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, buffer.glTexture, 0);
        });
        if (depthStencil) {
            switch (depthStencil.format) {
                case InternalFormat.DEPTH24_STENCIL8:
                case InternalFormat.DEPTH32F_STENCIL8:
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthStencil.glTexture, 0);
                    break;
                case InternalFormat.DEPTH_COMPONENT16:
                case InternalFormat.DEPTH_COMPONENT24:
                case InternalFormat.DEPTH_COMPONENT32F:
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
            this.framebufferTarget = new Target(dev, glColorAttachments, fbo, width, height);
        }
    }
}

export { BufferBits, BufferUsage, DataType, InternalFormat, Format, Filter, Wrap, Primitive, Device, Extension, Command, DepthFunc, StencilFunc, StencilOp, BlendFunc, BlendEquation, VertexBuffer, ElementBuffer, Attributes, AttributeType, Texture, Framebuffer };
//# sourceMappingURL=webglutenfree.js.map
