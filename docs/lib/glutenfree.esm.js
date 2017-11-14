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

class ElementBuffer {
    static fromProps(gl, props) {
        if (Array.isArray(props)) {
            return ElementBuffer.fromArray(gl, props);
        }
        return ElementBuffer.fromUint32Array(gl, props.data);
    }
    static fromArray(gl, arr) {
        const data = ravel(arr).data;
        return new ElementBuffer(gl, new Uint32Array(data));
    }
    static fromUint32Array(gl, buffer) {
        return new ElementBuffer(gl, Array.isArray(buffer) ? new Uint32Array(buffer) : buffer);
    }
    constructor(gl, buffer) {
        this.glBuffer = createElementArrayBuffer(gl, buffer);
        this.count = buffer.length;
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
            attribs.push(AttributeInfo.create(gl, definition));
        });
        // Setup elements
        let elems;
        if (elements) {
            elems = elements instanceof ElementBuffer
                ? elements
                : ElementBuffer.fromProps(gl, elements);
        }
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
        })), elems ? elems.glBuffer : undefined);
        // Compute max safe instance count
        const instancedBuffers = attribs
            .filter(buffer => !!buffer.divisor);
        const instanceCount = instancedBuffers.length
            ? instancedBuffers
                .map(b => b.count * b.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
        // Create VAO
        return new VertexArray(vao, !!elems, elems ? elems.count : attribs[0].count, instanceCount);
    }
}
// TODO: this could use some further refactoring. Currently its just former
// public API made private.
class AttributeInfo {
    static create(gl, props) {
        if (Array.isArray(props)) {
            if (is2DArray(props)) {
                const r = ravel(props);
                return new AttributeInfo("pointer", VertexBuffer.fromFloat32Array(gl, r.data), r.shape[0], r.shape[1], false, 0);
            }
            return new AttributeInfo("pointer", VertexBuffer.fromFloat32Array(gl, props), props.length, 1, false, 0);
        }
        switch (props.type) {
            case "pointer": return new AttributeInfo(props.type, props.value instanceof VertexBuffer
                ? props.value
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.fromProps(gl, props.value), props.count, props.size, props.normalized || false, props.divisor || 0);
            case "ipointer": return new AttributeInfo(props.type, props.value instanceof VertexBuffer
                ? props.value
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.fromProps(gl, props.value), props.count, props.size, false, props.divisor || 0);
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

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;
class RenderPass {
    constructor(gl, glProgram, glPrimitive, uniformInfo, clearInfo) {
        this.gl = gl;
        this.glProgram = glProgram;
        this.glPrimitive = glPrimitive;
        this.uniformInfo = uniformInfo;
        this.clearInfo = clearInfo;
    }
    static fromProps(gl, { vert, frag, uniforms = {}, primitive = "triangles" /* Triangles */, clear = {}, }) {
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
        const clearInfo = new ClearInfo(clear.color, clear.depth, clear.stencil);
        return new RenderPass(gl, program, mapGlPrimitive(gl, primitive), uniformInfo, clearInfo);
    }
    render(vao, props) {
        const { gl, glProgram } = this;
        gl.useProgram(glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVertexArrayObject);
        this.clear();
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.draw(vao.hasElements, vao.count, vao.instanceCount);
        gl.bindVertexArray(null);
    }
    renderToFramebuffer(framebuffer, vao, props) {
        const { gl, glProgram } = this;
        gl.useProgram(glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVertexArrayObject);
        framebuffer.bind();
        gl.drawBuffers(framebuffer.colorAttachments);
        this.clear();
        gl.viewport(0, 0, framebuffer.width, framebuffer.height);
        this.draw(vao.hasElements, vao.count, vao.instanceCount);
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
    clear() {
        const { gl, clearInfo } = this;
        if (clearInfo) {
            let clearBits = 0 | 0;
            if (typeof clearInfo.color !== "undefined") {
                const [r, g, b, a] = clearInfo.color;
                gl.clearColor(r, g, b, a);
                clearBits |= gl.COLOR_BUFFER_BIT;
            }
            if (typeof clearInfo.depth !== "undefined") {
                gl.clearDepth(clearInfo.depth);
                clearBits |= gl.DEPTH_BUFFER_BIT;
            }
            if (typeof clearInfo.stencil !== "undefined") {
                gl.clearStencil(clearInfo.stencil);
                clearBits |= gl.STENCIL_BUFFER_BIT;
            }
            if (clearBits) {
                gl.clear(clearBits);
            }
        }
    }
    draw(hasElements, count, instCount) {
        const { gl, glPrimitive } = this;
        if (hasElements) {
            if (instCount) {
                gl.drawElementsInstanced(glPrimitive, count, gl.UNSIGNED_INT, // We only support u32 indices
                0, instCount);
            }
            else {
                gl.drawElements(glPrimitive, count, gl.UNSIGNED_INT, // We only support u32 indices
                0);
            }
        }
        else {
            if (instCount) {
                gl.drawArraysInstanced(glPrimitive, 0, count, instCount);
            }
            else {
                gl.drawArrays(glPrimitive, 0, count);
            }
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
class ClearInfo {
    constructor(color, depth, stencil) {
        this.color = color;
        this.depth = depth;
        this.stencil = stencil;
    }
}
class UniformInfo {
    constructor(identifier, location, definition) {
        this.identifier = identifier;
        this.location = location;
        this.definition = definition;
    }
}
function mapGlPrimitive(gl, primitive) {
    switch (primitive) {
        case "triangles" /* Triangles */: return gl.TRIANGLES;
        case "triangle-strip" /* TriangleStrip */: return gl.TRIANGLE_STRIP;
        case "triangle-fan" /* TriangleFan */: return gl.TRIANGLE_FAN;
        case "points" /* Points */: return gl.POINTS;
        case "lines" /* Lines */: return gl.LINES;
        case "line-strip" /* LineStrip */: return gl.LINE_STRIP;
        case "line-loop" /* LineLoop */: return gl.LINE_LOOP;
        default: return never(primitive);
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
            : new Uint8Array(data), width, height, "RGBA8" /* RGBA8 */, "RGBA" /* RGBA */, "UNSIGNED_BYTE" /* UNSIGNED_BYTE */, options);
    }
    static RG16FFromRGFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RG16F" /* RG16F */, "RG" /* RG */, "FLOAT" /* FLOAT */, options);
    }
    static RGB16FFromRGBFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGB16F" /* RGB16F */, "RGB" /* RGB */, "FLOAT" /* FLOAT */, options);
    }
    static RGBA16FFromRGBAFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGBA16F" /* RGBA16F */, "RGBA" /* RGBA */, "FLOAT" /* FLOAT */, options);
    }
    static RGB32FFromRGBFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGB32F" /* RGB32F */, "RGB" /* RGB */, "FLOAT" /* FLOAT */, options);
    }
    static RGBA32FFromRGBAFloat32Array(gl, data, width, height, options) {
        return new Texture(gl, !data || data instanceof Float32Array
            ? data
            : new Float32Array(data), width, height, "RGBA32F" /* RGBA32F */, "RGBA" /* RGBA */, "FLOAT" /* FLOAT */, options);
    }
    static fromArrayBufferView(gl, data, width, height, internalFormat, format, type, options) {
        return new Texture(gl, data, width, height, internalFormat, format, type, options);
    }
    constructor(gl, data, width, height, internalFormat, format, type, { min = "nearest" /* Nearest */, mag = "nearest" /* Nearest */, wrapS = "clamp-to-edge" /* ClampToEdge */, wrapT = "clamp-to-edge" /* ClampToEdge */, mipmap = false, } = {}) {
        this.glTexture = createTexture(gl, data, width, height, mapGlInternalFormat(gl, internalFormat), mapGlFormat(gl, format), mapGlType(gl, type), mapGlWrap(gl, wrapS), mapGlWrap(gl, wrapT), mapGlFilter(gl, min), mapGlFilter(gl, mag), mipmap);
        this.width = width;
        this.height = height;
        this.internalFormat = internalFormat;
    }
}
function mapGlWrap(gl, wrap) {
    switch (wrap) {
        case "clamp-to-edge" /* ClampToEdge */: return gl.CLAMP_TO_EDGE;
        case "repeat" /* Repeat */: return gl.REPEAT;
        case "mirrored-repeat" /* MirroredRepeat */: return gl.MIRRORED_REPEAT;
        default: return never(wrap);
    }
}
function mapGlFilter(gl, filter) {
    switch (filter) {
        case "nearest" /* Nearest */: return gl.NEAREST;
        case "linear" /* Linear */: return gl.LINEAR;
        case "nearest-mipmap-nearest" /* NearestMipmapNearest */: return gl.NEAREST_MIPMAP_NEAREST;
        case "linear-mipmap-nearest" /* LinearMipmapNearest */: return gl.LINEAR_MIPMAP_NEAREST;
        case "nearest-mipmap-linear" /* NearestMipmapLinear */: return gl.NEAREST_MIPMAP_LINEAR;
        case "linear-mipmap-linear" /* LinearMipmapLinear */: return gl.LINEAR_MIPMAP_LINEAR;
        default: return never(filter);
    }
}
function mapGlInternalFormat(gl, internalFormat) {
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
function mapGlFormat(gl, format) {
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
function mapGlType(gl, type) {
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
    constructor(gl, glFramebuffer, colorAttachments, width, height) {
        this.gl = gl;
        this.glFramebuffer = glFramebuffer;
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
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFramebuffer);
    }
    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}

export { RenderPass, VertexBuffer, ElementBuffer, VertexArray, Texture, Framebuffer };
//# sourceMappingURL=glutenfree.esm.js.map
