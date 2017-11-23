class Device {
    constructor(gl, extColorBufferFloat, oesTextureFloatLinear) {
        this.gl = gl;
        this.extColorBufferFloat = extColorBufferFloat;
        this.oesTextureFloatLinear = oesTextureFloatLinear;
    }
    static createAndMount(element = document.body, options) {
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.fromCanvas(canvas, options);
    }
    static fromCanvas(canvas, options) {
        // This is here to prevent rollup warning caused by ts __rest helper.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        const antialias = options && typeof options.antialias !== "undefined"
            ? options.antialias
            : true;
        const gl = canvas.getContext("webgl2", { antialias });
        if (!gl) {
            throw new Error("Could not acquire webgl2 context");
        }
        const dpr = window.devicePixelRatio;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        return Device.fromContext(gl, options);
    }
    static fromContext(gl, { enableEXTColorBufferFloat = false, enableOESTextureFloatLinear = false, } = {}) {
        const extColorBufferFloat = enableEXTColorBufferFloat
            ? gl.getExtension("EXT_color_buffer_float")
            : undefined;
        if (enableEXTColorBufferFloat && !extColorBufferFloat) {
            throw new Error("Could not acquire extension: EXT_color_buffer_float");
        }
        const oesTextureFloatLinear = enableOESTextureFloatLinear
            ? gl.getExtension("OES_texture_float_linear")
            : undefined;
        if (enableOESTextureFloatLinear && !oesTextureFloatLinear) {
            throw new Error("Could not acquire extension: OES_texture_float_linear");
        }
        return new Device(gl, extColorBufferFloat, oesTextureFloatLinear);
    }
    get bufferWidth() {
        return this.gl.drawingBufferWidth;
    }
    get bufferHeight() {
        return this.gl.drawingBufferHeight;
    }
    get canvasWidth() {
        return this.gl.canvas.width;
    }
    get canvasHeight() {
        return this.gl.canvas.height;
    }
    updateCanvas() {
        const gl = this.gl;
        const dpr = window.devicePixelRatio;
        const width = gl.canvas.clientWidth * dpr;
        const height = gl.canvas.clientHeight * dpr;
        if (width !== gl.canvas.clientWidth || height !== gl.canvas.clientHeight) {
            gl.canvas.width = width;
            gl.canvas.height = height;
        }
    }
}

function never(x, message) {
    throw new Error(message || "Unexpected object: " + x);
}

/*
███████╗██╗  ██╗ █████╗ ██████╗ ███████╗██████╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗
███████╗███████║███████║██║  ██║█████╗  ██████╔╝
╚════██║██╔══██║██╔══██║██║  ██║██╔══╝  ██╔══██╗
███████║██║  ██║██║  ██║██████╔╝███████╗██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
*/
function createProgram(gl, vertex, fragment) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("Could not create Program");
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }
    const msg = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link shader program: ${msg}`);
}
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Could not create Shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
/*
██████╗ ██╗   ██╗███████╗███████╗███████╗██████╗
██╔══██╗██║   ██║██╔════╝██╔════╝██╔════╝██╔══██╗
██████╔╝██║   ██║█████╗  █████╗  █████╗  ██████╔╝
██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗
██████╔╝╚██████╔╝██║     ██║     ███████╗██║  ██║
╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝
*/
function createArrayBuffer(gl, values) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error("Could not create buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, Array.isArray(values)
        ? new Float32Array(values)
        : values, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}
function createElementArrayBuffer(gl, elements) {
    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error("Could not create buffer");
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Array.isArray(elements)
        ? new Uint32Array(elements)
        : elements, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
}
function createVertexArray(gl, buffers, elementBuffer) {
    const vao = gl.createVertexArray();
    if (!vao) {
        throw new Error("Could not create Vertex Array Object");
    }
    gl.bindVertexArray(vao);
    buffers.forEach(({ type, buffer, bufferType, size, location, normalized = false, divisor, }) => {
        // Enable sending attribute arrays for location
        gl.enableVertexAttribArray(location);
        // Send buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        switch (type) {
            case 0 /* POINTER */:
                gl.vertexAttribPointer(location, size, bufferType, normalized, 0, 0);
                break;
            case 1 /* IPOINTER */:
                gl.vertexAttribIPointer(location, size, bufferType, 0, 0);
                break;
            default: never(type);
        }
        if (divisor) {
            gl.vertexAttribDivisor(location, divisor);
        }
    });
    if (elementBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return vao;
}
/*
████████╗███████╗██╗  ██╗████████╗██╗   ██╗██████╗ ███████╗
╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██║   ██║██╔══██╗██╔════╝
   ██║   █████╗   ╚███╔╝    ██║   ██║   ██║██████╔╝█████╗
   ██║   ██╔══╝   ██╔██╗    ██║   ██║   ██║██╔══██╗██╔══╝
   ██║   ███████╗██╔╝ ██╗   ██║   ╚██████╔╝██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
*/
function createTexture(gl, data, width, height, internalFormat, format, type, wrapS, wrapT, min, mag, mipmap) {
    const texture = gl.createTexture();
    if (!texture) {
        throw new Error("Could not create texture");
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
    if (data) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, data);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
    if (mipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}
/*
███████╗██████╗  █████╗ ███╗   ███╗███████╗
██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
█████╗  ██████╔╝███████║██╔████╔██║█████╗
██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝
██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

██████╗ ██╗   ██╗███████╗███████╗███████╗██████╗
██╔══██╗██║   ██║██╔════╝██╔════╝██╔════╝██╔══██╗
██████╔╝██║   ██║█████╗  █████╗  █████╗  ██████╔╝
██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗
██████╔╝╚██████╔╝██║     ██║     ███████╗██║  ██║
╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝
*/
function createFramebuffer(gl, colorAttachments) {
    const fbo = gl.createFramebuffer();
    if (!fbo) {
        throw new Error("Could not create framebuffer");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    colorAttachments.forEach((texture, i) => {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0);
    });
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }
    gl.deleteFramebuffer(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    throw new Error("Framebuffer not complete");
}

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
class Command {
    constructor(gl, glProgram, glPrimitive, uniformDescriptors, blendDescriptor, framebufferDescriptor, clearDescriptor) {
        this.gl = gl;
        this.glProgram = glProgram;
        this.glPrimitive = glPrimitive;
        this.uniformDescriptors = uniformDescriptors;
        this.blendDescriptor = blendDescriptor;
        this.framebufferDescriptor = framebufferDescriptor;
        this.clearDescriptor = clearDescriptor;
    }
    static create(dev, { vert, frag, uniforms = {}, primitive = "triangles" /* TRIANGLES */, blend = false, framebuffer, clear, }) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const vertShader = createShader(gl, gl.VERTEX_SHADER, vert);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
        const program = createProgram(gl, vertShader, fragShader);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        const uniformDescriptors = Object.entries(uniforms)
            .map(([identifier, uniform]) => {
            const location = gl.getUniformLocation(program, identifier);
            if (!location) {
                throw new Error(`No location for uniform: ${identifier}`);
            }
            return new UniformDescriptor(identifier, location, uniform);
        });
        const blendDescriptor = blend && typeof blend === "object" && blend
            ? new BlendDescriptor(mapGlBlendFunc(gl, blend.src), mapGlBlendFunc(gl, blend.dst), mapGlBlendEquation(gl, blend.equation || "add" /* ADD */), blend.color)
            : blend
                ? new BlendDescriptor(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD)
                : undefined;
        const framebufferDescriptor = framebuffer
            ? new FramebufferDescriptor(framebuffer)
            : undefined;
        const clearDescriptor = clear
            ? new ClearDescriptor(clear.color, clear.depth, clear.stencil)
            : undefined;
        return new Command(gl, program, mapGlPrimitive(gl, primitive), uniformDescriptors, blendDescriptor, framebufferDescriptor, clearDescriptor);
    }
    execute(vao, props) {
        const { gl, glProgram } = this;
        gl.useProgram(glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVertexArrayObject);
        let bufferWidth = gl.drawingBufferWidth;
        let bufferHeight = gl.drawingBufferHeight;
        const framebuffer = this.framebufferDescriptor
            ? access(props, this.framebufferDescriptor.definition)
            : undefined;
        if (framebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.glFramebuffer);
            gl.drawBuffers(framebuffer.glColorAttachments);
            bufferWidth = framebuffer.width;
            bufferHeight = framebuffer.height;
        }
        this.clear();
        this.beginBlend();
        gl.viewport(0, 0, bufferWidth, bufferHeight);
        if (vao.hasElements) {
            this.drawElements(vao.count, vao.instanceCount);
        }
        else {
            this.drawArrays(vao.count, vao.instanceCount);
        }
        this.endBlend();
        if (framebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        gl.bindVertexArray(null);
    }
    locate({ attributes, elements }) {
        const { gl, glProgram } = this;
        const locatedAttributes = Object.entries(attributes)
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
        return { attributes: locatedAttributes, elements };
    }
    beginBlend() {
        const { gl, blendDescriptor } = this;
        if (blendDescriptor) {
            gl.enable(gl.BLEND);
            gl.blendFunc(blendDescriptor.srcFactor, blendDescriptor.destFactor);
            gl.blendEquation(blendDescriptor.equation);
            if (blendDescriptor.color) {
                const [r, g, b, a] = blendDescriptor.color;
                gl.blendColor(r, g, b, a);
            }
        }
    }
    endBlend() {
        const { gl, blendDescriptor } = this;
        if (blendDescriptor) {
            gl.disable(gl.BLEND);
        }
    }
    clear() {
        const { gl, clearDescriptor } = this;
        if (clearDescriptor) {
            let clearBits = 0 | 0;
            if (typeof clearDescriptor.color !== "undefined") {
                const [r, g, b, a] = clearDescriptor.color;
                gl.clearColor(r, g, b, a);
                clearBits |= gl.COLOR_BUFFER_BIT;
            }
            if (typeof clearDescriptor.depth !== "undefined") {
                gl.clearDepth(clearDescriptor.depth);
                clearBits |= gl.DEPTH_BUFFER_BIT;
            }
            if (typeof clearDescriptor.stencil !== "undefined") {
                gl.clearStencil(clearDescriptor.stencil);
                clearBits |= gl.STENCIL_BUFFER_BIT;
            }
            if (clearBits) {
                gl.clear(clearBits);
            }
        }
    }
    drawArrays(count, instCount) {
        const { gl, glPrimitive } = this;
        if (instCount) {
            gl.drawArraysInstanced(glPrimitive, 0, count, instCount);
        }
        else {
            gl.drawArrays(glPrimitive, 0, count);
        }
    }
    drawElements(count, instCount) {
        const { gl, glPrimitive } = this;
        if (instCount) {
            gl.drawElementsInstanced(glPrimitive, count, gl.UNSIGNED_INT, // We only support u32 indices
            0, instCount);
        }
        else {
            gl.drawElements(glPrimitive, count, gl.UNSIGNED_INT, // We only support u32 indices
            0);
        }
    }
    updateUniforms(props) {
        const gl = this.gl;
        let textureUnitOffset = 0;
        this.uniformDescriptors.forEach(({ identifier: ident, location: loc, definition: def, }) => {
            switch (def.type) {
                case "1f":
                    gl.uniform1f(loc, access(props, def.value));
                    break;
                case "1fv":
                    gl.uniform1fv(loc, access(props, def.value));
                    break;
                case "1i":
                    gl.uniform1i(loc, access(props, def.value));
                    break;
                case "1iv":
                    gl.uniform1iv(loc, access(props, def.value));
                    break;
                case "1ui":
                    gl.uniform1ui(loc, access(props, def.value));
                    break;
                case "1uiv":
                    gl.uniform1uiv(loc, access(props, def.value));
                    break;
                case "2f": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2f(loc, x, y);
                    break;
                }
                case "2fv":
                    gl.uniform2fv(loc, access(props, def.value));
                    break;
                case "2i": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2i(loc, x, y);
                    break;
                }
                case "2iv":
                    gl.uniform2iv(loc, access(props, def.value));
                    break;
                case "2ui": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2ui(loc, x, y);
                    break;
                }
                case "2uiv":
                    gl.uniform2uiv(loc, access(props, def.value));
                    break;
                case "3f": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3f(loc, x, y, z);
                    break;
                }
                case "3fv":
                    gl.uniform3fv(loc, access(props, def.value));
                    break;
                case "3i": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3i(loc, x, y, z);
                    break;
                }
                case "3iv":
                    gl.uniform3iv(loc, access(props, def.value));
                    break;
                case "3ui": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3ui(loc, x, y, z);
                    break;
                }
                case "3uiv":
                    gl.uniform3uiv(loc, access(props, def.value));
                    break;
                case "4f": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4f(loc, x, y, z, w);
                    break;
                }
                case "4fv":
                    gl.uniform4fv(loc, access(props, def.value));
                    break;
                case "4i": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4i(loc, x, y, z, w);
                    break;
                }
                case "4iv":
                    gl.uniform4iv(loc, access(props, def.value));
                    break;
                case "4ui": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4ui(loc, x, y, z, w);
                    break;
                }
                case "4uiv":
                    gl.uniform4uiv(loc, access(props, def.value));
                    break;
                case "matrix2fv":
                    gl.uniformMatrix2fv(loc, false, access(props, def.value));
                    break;
                case "matrix3fv":
                    gl.uniformMatrix3fv(loc, false, access(props, def.value));
                    break;
                case "matrix4fv":
                    gl.uniformMatrix4fv(loc, false, access(props, def.value));
                    break;
                case "texture":
                    // TODO: is this the best way? (is it fast? can we cache?)
                    const texture = access(props, def.value);
                    const currentTexture = textureUnitOffset++;
                    gl.activeTexture(gl.TEXTURE0 + currentTexture);
                    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
                    gl.uniform1i(loc, currentTexture);
                    break;
                default:
                    never(def, `Unknown uniform type: (${ident})`);
                    break;
            }
        });
    }
}
function access(props, value) {
    return typeof value === "function" ? value(props) : value;
}
class BlendDescriptor {
    constructor(srcFactor, destFactor, equation, color) {
        this.srcFactor = srcFactor;
        this.destFactor = destFactor;
        this.equation = equation;
        this.color = color;
    }
}
class FramebufferDescriptor {
    constructor(definition) {
        this.definition = definition;
    }
}
class ClearDescriptor {
    constructor(color, depth, stencil) {
        this.color = color;
        this.depth = depth;
        this.stencil = stencil;
    }
}
class UniformDescriptor {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}
function mapGlPrimitive(gl, primitive) {
    switch (primitive) {
        case "triangles" /* TRIANGLES */: return gl.TRIANGLES;
        case "triangle-strip" /* TRIANGLE_STRIP */: return gl.TRIANGLE_STRIP;
        case "triangle-fan" /* TRIANGLE_FAN */: return gl.TRIANGLE_FAN;
        case "points" /* POINTS */: return gl.POINTS;
        case "lines" /* LINES */: return gl.LINES;
        case "line-strip" /* LINE_STRIP */: return gl.LINE_STRIP;
        case "line-loop" /* LINE_LOOP */: return gl.LINE_LOOP;
        default: return never(primitive);
    }
}
function mapGlBlendFunc(gl, func) {
    switch (func) {
        case "zero" /* ZERO */: return gl.ZERO;
        case "one" /* ONE */: return gl.ONE;
        case "src-color" /* SRC_COLOR */: return gl.SRC_COLOR;
        case "src-alpha" /* SRC_ALPHA */: return gl.SRC_ALPHA;
        case "one-minus-src-color" /* ONE_MINUS_SRC_COLOR */: return gl.ONE_MINUS_SRC_COLOR;
        case "one-minus-src-alpha" /* ONE_MINUS_SRC_ALPHA */: return gl.ONE_MINUS_SRC_ALPHA;
        case "dst-color" /* DST_COLOR */: return gl.DST_COLOR;
        case "dst-alpha" /* DST_ALPHA */: return gl.DST_ALPHA;
        case "one-minus-dst-color" /* ONE_MINUS_DST_COLOR */: return gl.ONE_MINUS_DST_COLOR;
        case "one-minus-dst-alpha" /* ONE_MINUS_DST_ALPHA */: return gl.ONE_MINUS_DST_ALPHA;
        case "constant-color" /* CONSTANT_COLOR */: return gl.CONSTANT_COLOR;
        case "constant-alpha" /* CONSTANT_ALPHA */: return gl.CONSTANT_ALPHA;
        case "one-minus-constant-color" /* ONE_MINUS_CONSTANT_COLOR */:
            return gl.ONE_MINUS_CONSTANT_COLOR;
        case "one-minus-constant-alpha" /* ONE_MINUS_CONSTANT_ALPHA */:
            return gl.ONE_MINUS_CONSTANT_ALPHA;
        default: return never(func);
    }
}
function mapGlBlendEquation(gl, equation) {
    switch (equation) {
        case "add" /* ADD */: return gl.FUNC_ADD;
        case "subtract" /* SUBTRACT */: return gl.FUNC_SUBTRACT;
        case "reverse-subtract" /* REVERSE_SUBTRACT */: return gl.FUNC_REVERSE_SUBTRACT;
        case "min" /* MIN */: return gl.MIN;
        case "max" /* MAX */: return gl.MAX;
        default: return never(equation);
    }
}

class VertexBuffer {
    constructor(gl, type, glType, data) {
        this.gl = gl;
        this.type = type;
        this.glType = glType;
        this.glBuffer = createArrayBuffer(gl, data);
    }
    static create(dev, props) {
        const gl = dev instanceof Device ? dev.gl : dev;
        switch (props.type) {
            case "i8": return VertexBuffer.fromInt8Array(gl, props.data);
            case "i16": return VertexBuffer.fromInt16Array(gl, props.data);
            case "i32": return VertexBuffer.fromInt32Array(gl, props.data);
            case "u8": return VertexBuffer.fromUint8Array(gl, props.data);
            case "u16": return VertexBuffer.fromUint16Array(gl, props.data);
            case "u32": return VertexBuffer.fromUint32Array(gl, props.data);
            case "f32": return VertexBuffer.fromFloat32Array(gl, props.data);
            default: return never(props);
        }
    }
    static fromInt8Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "i8", gl.BYTE, data instanceof Int8Array ? data : new Int8Array(data));
    }
    static fromInt16Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "i16", gl.SHORT, data instanceof Int16Array ? data : new Int16Array(data));
    }
    static fromInt32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "i32", gl.INT, data instanceof Int32Array ? data : new Int32Array(data));
    }
    static fromUint8Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "u8", gl.UNSIGNED_BYTE, 
        // Note: we also have to convert Uint8ClampedArray to Uint8Array
        // because of webgl bug
        // https://github.com/KhronosGroup/WebGL/issues/1533
        data instanceof Uint8Array ? data : new Uint8Array(data));
    }
    static fromUint16Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "u16", gl.UNSIGNED_SHORT, data instanceof Uint16Array ? data : new Uint16Array(data));
    }
    static fromUint32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "u32", gl.UNSIGNED_INT, data instanceof Uint32Array ? data : new Uint32Array(data));
    }
    static fromFloat32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, "f32", gl.FLOAT, data instanceof Float32Array ? data : new Float32Array(data));
    }
}

/**
 * Chacks whether array is at least 2d, mostly useful because of return type
 * predicate.
 */
function is2DArray(array) {
    return !!array.length || Array.isArray(array[0]);
}
/**
 * Flatten 2d array and compute its former shape.
 * eg.
 * ravel([
 *      [1, 2, 3],
 *      [4, 5, 6],
 * ])
 * produces {
 *      data: [1, 2, 3, 4, 5, 6],
 *      shape: [2, 3],
 * }
 */
function ravel(unraveled) {
    const outerShape = unraveled.length;
    const innerShape = outerShape ? unraveled[0].length : 0;
    const raveled = new Array(innerShape * outerShape);
    unraveled.forEach((inner, i) => {
        inner.forEach((elem, j) => {
            raveled[innerShape * i + j] = elem;
        });
    });
    return { data: raveled, shape: [outerShape, innerShape] };
}

class ElementBuffer {
    constructor(glBuffer, count) {
        this.glBuffer = glBuffer;
        this.count = count;
    }
    static create(dev, props) {
        return Array.isArray(props)
            ? ElementBuffer.fromArray(dev, props)
            : ElementBuffer.fromUint32Array(dev, props.data);
    }
    static fromArray(dev, data) {
        return ElementBuffer.fromUint32Array(dev, is2DArray(data)
            ? ravel(data).data
            : data);
    }
    static fromUint32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        const buffer = createElementArrayBuffer(gl, arr);
        return new ElementBuffer(buffer, arr.length);
    }
}

const INT_PATTERN$1 = /^0|[1-9]\d*$/;
class VertexArray {
    constructor(glVertexArrayObject, hasElements, count, // Either count of vertex data or of elements
        instanceCount) {
        this.glVertexArrayObject = glVertexArrayObject;
        this.hasElements = hasElements;
        this.count = count;
        this.instanceCount = instanceCount;
    }
    static create(dev, { attributes, elements }) {
        const gl = dev instanceof Device ? dev.gl : dev;
        // Setup attributes
        const attribDescriptors = [];
        const attribLocations = [];
        Object.entries(attributes).forEach(([locationStr, definition]) => {
            if (!INT_PATTERN$1.test(locationStr)) {
                throw new Error("Location not a number. Use Command#locate");
            }
            const location = parseInt(locationStr, 10);
            attribLocations.push(location);
            attribDescriptors.push(AttributeDescriptor.create(gl, definition));
        });
        // Setup elements
        let elems;
        if (elements) {
            elems = elements instanceof ElementBuffer
                ? elements
                : ElementBuffer.create(gl, elements);
        }
        // Create vertex array
        const vao = createVertexArray(gl, attribDescriptors.map((attrib, i) => ({
            type: attrib.type === "ipointer"
                ? 1 /* IPOINTER */
                : 0 /* POINTER */,
            buffer: attrib.buffer.glBuffer,
            bufferType: attrib.buffer.glType,
            size: attrib.size,
            location: attribLocations[i],
            normalized: attrib.normalized,
            divisor: attrib.divisor,
        })), elems ? elems.glBuffer : undefined);
        // Compute max safe instance count
        const instancedBuffers = attribDescriptors
            .filter(buffer => !!buffer.divisor);
        const instanceCount = instancedBuffers.length
            ? instancedBuffers
                .map(b => b.count * b.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
        // Create VAO
        return new VertexArray(vao, !!elems, elems ? elems.count : attribDescriptors[0].count, instanceCount);
    }
}
// TODO: this could use some further refactoring. Currently its just former
// public API made private.
class AttributeDescriptor {
    static create(gl, props) {
        if (Array.isArray(props)) {
            if (is2DArray(props)) {
                const r = ravel(props);
                return new AttributeDescriptor("pointer", VertexBuffer.fromFloat32Array(gl, r.data), r.shape[0], r.shape[1], false, 0);
            }
            return new AttributeDescriptor("pointer", VertexBuffer.fromFloat32Array(gl, props), props.length, 1, false, 0);
        }
        switch (props.type) {
            case "pointer": return new AttributeDescriptor(props.type, props.value instanceof VertexBuffer
                ? props.value
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.create(gl, props.value), props.count, props.size, props.normalized || false, props.divisor || 0);
            case "ipointer": return new AttributeDescriptor(props.type, props.value instanceof VertexBuffer
                ? props.value
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.create(gl, props.value), props.count, props.size, false, props.divisor || 0);
            default: return never(props);
        }
    }
    constructor(type, buffer, count, size, normalized, divisor) {
        this.type = type;
        this.buffer = buffer;
        this.count = count;
        this.size = size;
        this.normalized = normalized;
        this.divisor = divisor;
    }
}

class Texture {
    constructor(glTexture, width, height) {
        this.glTexture = glTexture;
        this.width = width;
        this.height = height;
    }
    static fromImage(dev, image, options) {
        return Texture.fromRGBA8(dev, image.data, image.width, image.height, options);
    }
    static fromRGBA8(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Uint8Array
            ? data
            // Note: we also have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : new Uint8Array(data), width, height, "RGBA8" /* RGBA8 */, "RGBA" /* RGBA */, "UNSIGNED_BYTE" /* UNSIGNED_BYTE */, options);
    }
    static fromRG16F(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RG16F" /* RG16F */, "RG" /* RG */, "FLOAT" /* FLOAT */, options);
    }
    static fromRGB16F(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGB16F" /* RGB16F */, "RGB" /* RGB */, "FLOAT" /* FLOAT */, options);
    }
    static fromRGBA16F(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGBA16F" /* RGBA16F */, "RGBA" /* RGBA */, "FLOAT" /* FLOAT */, options);
    }
    static fromRGB32F(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGB32F" /* RGB32F */, "RGB" /* RGB */, "FLOAT" /* FLOAT */, options);
    }
    static fromRGBA32F(dev, data, width, height, options) {
        return Texture.fromArrayBufferView(dev, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGBA32F" /* RGBA32F */, "RGBA" /* RGBA */, "FLOAT" /* FLOAT */, options);
    }
    static fromArrayBufferView(dev, data, width, height, internalFormat, format, type, { min = "nearest" /* NEAREST */, mag = "nearest" /* NEAREST */, wrapS = "clamp-to-edge" /* CLAMP_TO_EDGE */, wrapT = "clamp-to-edge" /* CLAMP_TO_EDGE */, mipmap = false, } = {}) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new Texture(createTexture(gl, data, width, height, mapGlTextureInternalFormat(gl, internalFormat), mapGlTextureFormat(gl, format), mapGlTextureType(gl, type), mapGlTextureWrap(gl, wrapS), mapGlTextureWrap(gl, wrapT), mapGlTextureFilter(gl, min), mapGlTextureFilter(gl, mag), mipmap), width, height);
    }
}
function mapGlTextureWrap(gl, wrap) {
    switch (wrap) {
        case "clamp-to-edge" /* CLAMP_TO_EDGE */: return gl.CLAMP_TO_EDGE;
        case "repeat" /* REPEAT */: return gl.REPEAT;
        case "mirrored-repeat" /* MIRRORED_REPEAT */: return gl.MIRRORED_REPEAT;
        default: return never(wrap);
    }
}
function mapGlTextureFilter(gl, filter) {
    switch (filter) {
        case "nearest" /* NEAREST */: return gl.NEAREST;
        case "linear" /* LINEAR */: return gl.LINEAR;
        case "nearest-mipmap-nearest" /* NEAREST_MIPMAP_NEAREST */:
            return gl.NEAREST_MIPMAP_NEAREST;
        case "linear-mipmap-nearest" /* LINEAR_MIPMAP_NEAREST */:
            return gl.LINEAR_MIPMAP_NEAREST;
        case "nearest-mipmap-linear" /* NEAREST_MIPMAP_LINEAR */:
            return gl.NEAREST_MIPMAP_LINEAR;
        case "linear-mipmap-linear" /* LINEAR_MIPMAP_LINEAR */:
            return gl.LINEAR_MIPMAP_LINEAR;
        default: return never(filter);
    }
}
function mapGlTextureInternalFormat(gl, internalFormat) {
    switch (internalFormat) {
        // R
        case "R8" /* R8 */: return gl.R8;
        case "R8_SNORM" /* R8_SNORM */: return gl.R8_SNORM;
        case "R8UI" /* R8UI */: return gl.R8UI;
        case "R8I" /* R8I */: return gl.R8I;
        case "R16UI" /* R16UI */: return gl.R16UI;
        case "R16I" /* R16I */: return gl.R16I;
        case "R32UI" /* R32UI */: return gl.R32UI;
        case "R32I" /* R32I */: return gl.R32I;
        case "R16F" /* R16F */: return gl.R16I;
        case "R32F" /* R32F */: return gl.R32F;
        // RG
        case "RG8" /* RG8 */: return gl.RG8;
        case "RG8_SNORM" /* RG8_SNORM */: return gl.RG8_SNORM;
        case "RG8UI" /* RG8UI */: return gl.RG8UI;
        case "RG8I" /* RG8I */: return gl.RG8I;
        case "RG16UI" /* RG16UI */: return gl.RG16UI;
        case "RG16I" /* RG16I */: return gl.RG16I;
        case "RG32UI" /* RG32UI */: return gl.RG32UI;
        case "RG32I" /* RG32I */: return gl.RG32I;
        case "RG16F" /* RG16F */: return gl.RG16F;
        case "RG32F" /* RG32F */: return gl.RG32F;
        // RGB
        case "RGB8" /* RGB8 */: return gl.RGB8;
        case "RGB8_SNORM" /* RGB8_SNORM */: return gl.RGB8_SNORM;
        case "RGB8UI" /* RGB8UI */: return gl.RGB8UI;
        case "RGB8I" /* RGB8I */: return gl.RGB8I;
        case "RGB16UI" /* RGB16UI */: return gl.RGB16UI;
        case "RGB16I" /* RGB16I */: return gl.RGB16I;
        case "RGB32UI" /* RGB32UI */: return gl.RGB32UI;
        case "RGB32I" /* RGB32I */: return gl.RGB32I;
        case "RGB16F" /* RGB16F */: return gl.RGB16F;
        case "RGB32F" /* RGB32F */: return gl.RGB32F;
        // RGBA
        case "RGBA8" /* RGBA8 */: return gl.RGBA8;
        case "RGBA8_SNORM" /* RGBA8_SNORM */: return gl.RGBA8_SNORM;
        case "RGBA8UI" /* RGBA8UI */: return gl.RGBA8UI;
        case "RGBA8I" /* RGBA8I */: return gl.RGBA8I;
        case "RGBA16UI" /* RGBA16UI */: return gl.RGBA16UI;
        case "RGBA16I" /* RGBA16I */: return gl.RGBA16I;
        case "RGBA32UI" /* RGBA32UI */: return gl.RGBA32UI;
        case "RGBA32I" /* RGBA32I */: return gl.RGBA32I;
        case "RGBA16F" /* RGBA16F */: return gl.RGBA16F;
        case "RGBA32F" /* RGBA32F */: return gl.RGBA32F;
        default: return never(internalFormat);
    }
}
function mapGlTextureFormat(gl, format) {
    switch (format) {
        case "RED" /* RED */: return gl.RED;
        case "RG" /* RG */: return gl.RG;
        case "RGB" /* RGB */: return gl.RGB;
        case "RGBA" /* RGBA */: return gl.RGBA;
        case "RED_INTEGER" /* RED_INTEGER */: return gl.RED_INTEGER;
        case "RG_INTEGER" /* RG_INTEGER */: return gl.RG_INTEGER;
        case "RGB_INTEGER" /* RGB_INTEGER */: return gl.RGB_INTEGER;
        case "RGBA_INTEGER" /* RGBA_INTEGER */: return gl.RGBA_INTEGER;
        default: return never(format);
    }
}
function mapGlTextureType(gl, type) {
    switch (type) {
        case "UNSIGNED_BYTE" /* UNSIGNED_BYTE */: return gl.UNSIGNED_BYTE;
        case "UNSIGNED_SHORT" /* UNSIGNED_SHORT */: return gl.UNSIGNED_SHORT;
        case "UNSIGNED_INT" /* UNSIGNED_INT */: return gl.UNSIGNED_INT;
        case "BYTE" /* BYTE */: return gl.BYTE;
        case "SHORT" /* SHORT */: return gl.SHORT;
        case "INT" /* INT */: return gl.INT;
        case "FLOAT" /* FLOAT */: return gl.FLOAT;
    }
}

class Framebuffer {
    constructor(glFramebuffer, glColorAttachments, width, height) {
        this.glFramebuffer = glFramebuffer;
        this.glColorAttachments = glColorAttachments;
        this.width = width;
        this.height = height;
    }
    static create(dev, textures) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const fbo = createFramebuffer(gl, textures.map(t => t.glTexture));
        const [width, height] = textures.reduce((accum, curr) => {
            const [w, h] = accum;
            return [Math.min(w, curr.width), Math.min(h, curr.height)];
        }, [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
        return new Framebuffer(fbo, textures.map((_, i) => gl.COLOR_ATTACHMENT0 + i), width, height);
    }
}

export { Device, Command, VertexBuffer, ElementBuffer, VertexArray, Texture, Framebuffer };
//# sourceMappingURL=glutenfree.js.map
