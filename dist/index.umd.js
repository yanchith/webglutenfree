(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.rend = {})));
}(this, (function (exports) { 'use strict';

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
            case 0 /* Pointer */:
                gl.vertexAttribPointer(location, size, bufferType, normalized, 0, 0);
                break;
            case 1 /* IPointer */:
                gl.vertexAttribIPointer(location, size, bufferType, 0, 0);
                break;
            default: never(type);
        }
        if (divisor) {
            gl.vertexAttribDivisor(location, divisor);
        }
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
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
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, data);
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
function createFramebuffer(gl, textures) {
    const fbo = gl.createFramebuffer();
    if (!fbo) {
        throw new Error("Could not create framebuffer");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    textures.forEach((texture, i) => {
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

/**
 * Chacks whether  array is at least 2d, mostly useful because of return type
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

class VertexBuffer {
    constructor(gl, type, glType, data) {
        this.gl = gl;
        this.type = type;
        this.glType = glType;
        this.glBuffer = createArrayBuffer(gl, data);
    }
    static fromProps(gl, props) {
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
    static fromInt8Array(gl, data) {
        return new VertexBuffer(gl, "i8", gl.BYTE, data instanceof Int8Array ? data : new Int8Array(data));
    }
    static fromInt16Array(gl, data) {
        return new VertexBuffer(gl, "i16", gl.SHORT, data instanceof Int16Array ? data : new Int16Array(data));
    }
    static fromInt32Array(gl, data) {
        return new VertexBuffer(gl, "i32", gl.INT, data instanceof Int32Array ? data : new Int32Array(data));
    }
    static fromUint8Array(gl, data) {
        return new VertexBuffer(gl, "u8", gl.UNSIGNED_BYTE, 
        // Note: we also have to convert Uint8ClampedArray to Uint8Array
        // because of webgl bug
        // https://github.com/KhronosGroup/WebGL/issues/1533
        data instanceof Uint8Array ? data : new Uint8Array(data));
    }
    static fromUint16Array(gl, data) {
        return new VertexBuffer(gl, "u16", gl.UNSIGNED_SHORT, data instanceof Uint16Array ? data : new Uint16Array(data));
    }
    static fromUint32Array(gl, data) {
        return new VertexBuffer(gl, "u32", gl.UNSIGNED_INT, data instanceof Uint32Array ? data : new Uint32Array(data));
    }
    static fromFloat32Array(gl, data) {
        return new VertexBuffer(gl, "f32", gl.FLOAT, data instanceof Float32Array ? data : new Float32Array(data));
    }
}

class Attribute {
    static fromProps(gl, props) {
        if (Array.isArray(props)) {
            return Attribute.fromArray(gl, props);
        }
        switch (props.type) {
            case "pointer": return Attribute.fromPointer(gl, props.value, props.count, props.size, props.normalized, props.divisor);
            case "ipointer": return Attribute.fromIPointer(gl, props.value, props.count, props.size, props.divisor);
            default: return never(props);
        }
    }
    static fromArray(gl, arr) {
        if (is2DArray(arr)) {
            const r = ravel(arr);
            return Attribute.fromPointer(gl, VertexBuffer.fromFloat32Array(gl, r.data), r.shape[0], r.shape[1]);
        }
        return Attribute.fromPointer(gl, VertexBuffer.fromFloat32Array(gl, arr), arr.length, 1);
    }
    static fromPointer(gl, buffer, count, size, normalized = false, divisor = 0) {
        return new Attribute("pointer", buffer instanceof VertexBuffer
            ? buffer
            // Note: typescript is not smart enough to infer what we know
            : VertexBuffer.fromProps(gl, buffer), count, size, normalized, divisor);
    }
    static fromIPointer(gl, buffer, count, size, divisor = 0) {
        return new Attribute("ipointer", buffer instanceof VertexBuffer
            ? buffer
            // Note: typescript is not smart enough to infer what we know
            : VertexBuffer.fromProps(gl, buffer), count, size, false, divisor);
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

class Elements {
    static fromProps(gl, props) {
        if (Array.isArray(props)) {
            return Elements.fromArray(gl, props);
        }
        return Elements.fromUint32Array(gl, props.data, props.primitive);
    }
    static fromArray(gl, arr) {
        const data = ravel(arr).data;
        return new Elements(gl, new Uint32Array(data), "triangles");
    }
    static fromUint32Array(gl, buffer, primitive) {
        return new Elements(gl, Array.isArray(buffer) ? new Uint32Array(buffer) : buffer, primitive);
    }
    constructor(gl, buffer, primitive) {
        this.glBuffer = createElementArrayBuffer(gl, buffer);
        this.count = buffer.length;
        this.primitive = primitive;
    }
}

const INT_PATTERN$1 = /^0|[1-9]\d*$/;
class VertexArray {
    static fromProps(gl, { attributes, elements }) {
        // Setup attributes
        const attribs = [];
        const attribLocations = [];
        Object.entries(attributes).forEach(([locationStr, definition]) => {
            if (!INT_PATTERN$1.test(locationStr)) {
                throw new Error("Location is not a number. Use RenderPass#createVertexArray to resolve names.");
            }
            const location = parseInt(locationStr, 10);
            attribLocations.push(location);
            attribs.push(definition instanceof Attribute
                ? definition
                : Attribute.fromProps(gl, definition));
        });
        // Setup elements
        const elems = elements instanceof Elements
            ? elements
            : Elements.fromProps(gl, elements);
        // Create vertex array
        const vao = createVertexArray(gl, attribs.map((attrib, i) => ({
            type: attrib.type === "ipointer"
                ? 1 /* IPointer */
                : 0 /* Pointer */,
            buffer: attrib.buffer.glBuffer,
            bufferType: attrib.buffer.glType,
            size: attrib.size,
            location: attribLocations[i],
            normalized: attrib.normalized,
            divisor: attrib.divisor,
        })), elems.glBuffer);
        // Compute max safe instance count
        const instancedBuffers = attribs
            .filter(buffer => !!buffer.divisor);
        const instanceCount = instancedBuffers.length
            ? instancedBuffers
                .map(b => b.count * b.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
        // Create VAO
        return new VertexArray(vao, elems.count, elems.primitive, instanceCount);
    }
    constructor(glVao, count, primitive, instanceCount) {
        this.glVao = glVao;
        this.count = count;
        this.primitive = primitive;
        this.instanceCount = instanceCount;
    }
}

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
class RenderPass {
    constructor(gl, program, uniformInfo) {
        this.gl = gl;
        this.glProgram = program;
        this.uniformInfo = uniformInfo;
    }
    static fromProps(gl, { uniforms, vert, frag }) {
        const vertShader = createShader(gl, gl.VERTEX_SHADER, vert);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
        const program = createProgram(gl, vertShader, fragShader);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        const uniformInfo = Object.entries(uniforms)
            .map(([identifier, uniform]) => {
            const location = gl.getUniformLocation(program, identifier);
            if (!location) {
                throw new Error(`No location for uniform: ${identifier}`);
            }
            return new UniformInfo(identifier, location, uniform);
        });
        return new RenderPass(gl, program, uniformInfo);
    }
    render(props, vao, count, instanceCount) {
        const gl = this.gl;
        const elemCount = typeof count === "undefined"
            ? vao.count
            : Math.min(vao.count, count);
        const instCount = typeof instanceCount === "undefined"
            ? vao.instanceCount
            : Math.min(vao.instanceCount, instanceCount);
        gl.useProgram(this.glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVao);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.draw(elemCount, instCount);
        gl.bindVertexArray(null);
    }
    renderToFramebuffer(props, vao, framebuffer, count, instanceCount) {
        const gl = this.gl;
        const elemCount = typeof count === "undefined"
            ? vao.count
            : Math.min(vao.count, count);
        const instCount = typeof instanceCount === "undefined"
            ? vao.instanceCount
            : Math.min(vao.instanceCount, instanceCount);
        gl.useProgram(this.glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVao);
        framebuffer.bind();
        gl.drawBuffers(framebuffer.colorAttachments);
        gl.viewport(0, 0, framebuffer.width, framebuffer.height);
        this.draw(elemCount, instCount);
        framebuffer.unbind();
        gl.bindVertexArray(null);
    }
    createVertexArray({ attributes, elements }) {
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
        return VertexArray.fromProps(gl, {
            attributes: locatedAttributes,
            elements,
        });
    }
    draw(elemCount, instCount) {
        const gl = this.gl;
        if (instCount) {
            gl.drawElementsInstanced(gl.TRIANGLES, elemCount, gl.UNSIGNED_INT, 0, instCount);
        }
        else {
            gl.drawElements(gl.TRIANGLES, elemCount, gl.UNSIGNED_INT, 0);
        }
    }
    updateUniforms(props) {
        const gl = this.gl;
        let textureUnitOffset = 0;
        this.uniformInfo.forEach(({ identifier: ident, location: loc, definition: def, }) => {
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
    return typeof value === "function"
        ? value(props)
        : value;
}
class UniformInfo {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}

class Texture {
    static fromImage(gl, image, options) {
        return Texture.RGBA8FromRGBAUint8Array(gl, image.data, image.width, image.height, options);
    }
    static RGBA8FromRGBAUint8Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Uint8Array
            ? data
            // Note: we also have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : new Uint8Array(data), width, height, 30 /* RGBA8 */, 3 /* RGBA */, 0 /* UNSIGNED_BYTE */, options);
    }
    static RG16FFromRGFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, 18 /* RG16F */, 1 /* RG */, 6 /* FLOAT */, options);
    }
    static RGB16FFromRGBFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, 28 /* RGB16F */, 2 /* RGB */, 6 /* FLOAT */, options);
    }
    static RGBA16FFromRGBAFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, 38 /* RGBA16F */, 3 /* RGBA */, 6 /* FLOAT */, options);
    }
    static RGB32FFromRGBFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, 29 /* RGB32F */, 2 /* RGB */, 6 /* FLOAT */, options);
    }
    static RGBA32FFromRGBAFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, 39 /* RGBA32F */, 3 /* RGBA */, 6 /* FLOAT */, options);
    }
    static fromArrayBufferView(gl, data, width, height, internalFormat, format, type, options) {
        return new Texture(gl, data, width, height, internalFormat, format, type, options);
    }
    constructor(gl, data, width, height, internalFormat, format, type, { minFilter = 0 /* Nearest */, magFilter = 0 /* Nearest */, wrapS = 0 /* ClampToEdge */, wrapT = 0 /* ClampToEdge */, mipmap = false, } = {}) {
        this.glTexture = createTexture(gl, data, width, height, mapGlInternalFormat(gl, internalFormat), mapGlFormat(gl, format), mapGlType(gl, type), mapGlWrap(gl, wrapS), mapGlWrap(gl, wrapT), mapGlFilter(gl, minFilter), mapGlFilter(gl, magFilter), mipmap);
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat;
    }
}
function mapGlWrap(gl, wrap) {
    switch (wrap) {
        case 0 /* ClampToEdge */: return gl.CLAMP_TO_EDGE;
        case 1 /* Repeat */: return gl.REPEAT;
        case 2 /* MirroredRepeat */: return gl.MIRRORED_REPEAT;
        default: return never(wrap);
    }
}
function mapGlFilter(gl, filter) {
    switch (filter) {
        case 0 /* Nearest */: return gl.NEAREST;
        case 1 /* Linear */: return gl.LINEAR;
        case 2 /* NearestMipmapNearest */: return gl.NEAREST_MIPMAP_NEAREST;
        case 3 /* LinearMipmapNearest */: return gl.LINEAR_MIPMAP_NEAREST;
        case 4 /* NearestMipmapLinear */: return gl.NEAREST_MIPMAP_LINEAR;
        case 5 /* LinearMipmapLinear */: return gl.LINEAR_MIPMAP_LINEAR;
        default: return never(filter);
    }
}
function mapGlInternalFormat(gl, internalFormat) {
    switch (internalFormat) {
        // R
        case 0 /* R8 */: return gl.R8;
        case 1 /* R8_SNORM */: return gl.R8_SNORM;
        case 2 /* R8UI */: return gl.R8UI;
        case 3 /* R8I */: return gl.R8I;
        case 4 /* R16UI */: return gl.R16UI;
        case 5 /* R16I */: return gl.R16I;
        case 6 /* R32UI */: return gl.R32UI;
        case 7 /* R32I */: return gl.R32I;
        case 8 /* R16F */: return gl.R16I;
        case 9 /* R32F */: return gl.R32F;
        // RG
        case 10 /* RG8 */: return gl.RG8;
        case 11 /* RG8_SNORM */: return gl.RG8_SNORM;
        case 12 /* RG8UI */: return gl.RG8UI;
        case 13 /* RG8I */: return gl.RG8I;
        case 14 /* RG16UI */: return gl.RG16UI;
        case 15 /* RG16I */: return gl.RG16I;
        case 16 /* RG32UI */: return gl.RG32UI;
        case 17 /* RG32I */: return gl.RG32I;
        case 18 /* RG16F */: return gl.RG16F;
        case 19 /* RG32F */: return gl.RG32F;
        // RGB
        case 20 /* RGB8 */: return gl.RGB8;
        case 21 /* RGB8_SNORM */: return gl.RGB8_SNORM;
        case 22 /* RGB8UI */: return gl.RGB8UI;
        case 23 /* RGB8I */: return gl.RGB8I;
        case 24 /* RGB16UI */: return gl.RGB16UI;
        case 25 /* RGB16I */: return gl.RGB16I;
        case 26 /* RGB32UI */: return gl.RGB32UI;
        case 27 /* RGB32I */: return gl.RGB32I;
        case 28 /* RGB16F */: return gl.RGB16F;
        case 29 /* RGB32F */: return gl.RGB32F;
        // RGBA
        case 30 /* RGBA8 */: return gl.RGBA8;
        case 31 /* RGBA8_SNORM */: return gl.RGBA8_SNORM;
        case 32 /* RGBA8UI */: return gl.RGBA8UI;
        case 33 /* RGBA8I */: return gl.RGBA8I;
        case 34 /* RGBA16UI */: return gl.RGBA16UI;
        case 35 /* RGBA16I */: return gl.RGBA16I;
        case 36 /* RGBA32UI */: return gl.RGBA32UI;
        case 37 /* RGBA32I */: return gl.RGBA32I;
        case 38 /* RGBA16F */: return gl.RGBA16F;
        case 39 /* RGBA32F */: return gl.RGBA32F;
        default: return never(internalFormat);
    }
}
function mapGlFormat(gl, format) {
    switch (format) {
        case 0 /* RED */: return gl.RED;
        case 1 /* RG */: return gl.RG;
        case 2 /* RGB */: return gl.RGB;
        case 3 /* RGBA */: return gl.RGBA;
        case 4 /* RED_INTEGER */: return gl.RED_INTEGER;
        case 5 /* RG_INTEGER */: return gl.RG_INTEGER;
        case 6 /* RGB_INTEGER */: return gl.RGB_INTEGER;
        case 7 /* RGBA_INTEGER */: return gl.RGBA_INTEGER;
        default: return never(format);
    }
}
function mapGlType(gl, type) {
    switch (type) {
        case 0 /* UNSIGNED_BYTE */: return gl.UNSIGNED_BYTE;
        case 1 /* UNSIGNED_SHORT */: return gl.UNSIGNED_SHORT;
        case 2 /* UNSIGNED_INT */: return gl.UNSIGNED_INT;
        case 3 /* BYTE */: return gl.BYTE;
        case 4 /* SHORT */: return gl.SHORT;
        case 5 /* INT */: return gl.INT;
        case 6 /* FLOAT */: return gl.FLOAT;
    }
}

class Framebuffer {
    constructor(gl, fbo, colorAttachments, width, height) {
        this.gl = gl;
        this.fbo = fbo;
        this.colorAttachments = colorAttachments;
        this.width = width;
        this.height = height;
    }
    static fromTextures(gl, textures) {
        const fbo = createFramebuffer(gl, textures.map(t => t.glTexture));
        const attachment = gl.COLOR_ATTACHMENT0;
        return new Framebuffer(gl, fbo, textures.map((_, i) => attachment + i), textures[0].width, textures[0].height);
    }
    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    }
    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}

exports.RenderPass = RenderPass;
exports.VertexBuffer = VertexBuffer;
exports.Elements = Elements;
exports.VertexArray = VertexArray;
exports.Texture = Texture;
exports.Framebuffer = Framebuffer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
