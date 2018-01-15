/**
 * Available extensions.
 */
var Extension;
(function (Extension) {
    Extension["EXTColorBufferFloat"] = "EXT_color_buffer_float";
    Extension["OESTextureFloatLinear"] = "OES_texture_float_linear";
})(Extension || (Extension = {}));
class Device {
    constructor(gl, canvas, explicitPixelRatio, explicitViewport) {
        this.gl = gl;
        this.canvas = canvas;
        this.explicitPixelRatio = explicitPixelRatio;
        this.explicitViewport = explicitViewport;
    }
    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static mount(element = document.body, options) {
        if (element instanceof HTMLCanvasElement) {
            return Device.fromCanvas(element, options);
        }
        const canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return Device.fromCanvas(canvas, options);
    }
    /**
     * Create a new device (containing a gl context) from existing canvas.
     */
    static fromCanvas(canvas, options = {}) {
        const { antialias = true, alpha = true, depth = true, stencil = true, preserveDrawingBuffer = false, } = options.context || {};
        const gl = canvas.getContext("webgl2", {
            antialias,
            alpha,
            depth,
            stencil,
            preserveDrawingBuffer,
        });
        if (!gl) {
            throw new Error("Could not get webgl2 context");
        }
        return Device.fromContext(gl, options);
    }
    /**
     * Create a new device from existing gl context.
     */
    static fromContext(gl, { pixelRatio, viewport, extensions, } = {}) {
        if (extensions) {
            extensions.forEach(ext => {
                if (!gl.getExtension(ext)) {
                    throw new Error(`Could not get extension ${ext}`);
                }
            });
        }
        const dev = new Device(gl, gl.canvas, pixelRatio, viewport);
        dev.update();
        return dev;
    }
    /**
     * Return width of the gl drawing buffer.
     */
    get bufferWidth() {
        return this.gl.drawingBufferWidth;
    }
    /**
     * Return height of the gl drawing buffer.
     */
    get bufferHeight() {
        return this.gl.drawingBufferHeight;
    }
    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    get canvasWidth() {
        return this.canvas.width;
    }
    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    get canvasHeight() {
        return this.canvas.height;
    }
    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSWidth() {
        return this.canvas.clientWidth;
    }
    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    get canvasCSSHeight() {
        return this.canvas.clientHeight;
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
        const canvas = this.canvas;
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
     * Clear the color buffer to provided color. Optionally, clear color buffers
     * attached to a framebuffer instead.
     */
    clearColor(r, g, b, a, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the depth buffer to provided depth. Optionally, clear depth buffer
     * attached to a framebuffer instead.
     */
    clearDepth(depth, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearDepth(depth);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the stencil buffer to provided stencil. Optionally, clear stencil
     * buffer attached to a framebuffer instead.
     */
    clearStencil(stencil, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearStencil(stencil);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the color buffers and depth buffer to provided color and depth.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearDepth()
     */
    clearColorAndDepth(r, g, b, a, depth, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the depth buffer and stencil buffer to provided depth and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearDepth()
     *   device.clearStencil()
     */
    clearDepthAndStencil(depth, stencil, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the color buffers and stencil buffer to provided color and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearStencil()
     */
    clearColorAndStencil(r, g, b, a, stencil, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearColor(r, g, b, a);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     * Clear the color buffers, depth buffer and stencil buffer to provided
     * color, depth and stencil.
     * Optionally, clear buffers attached to a framebuffer instead.
     *
     * This is equivalent to but more efficient than:
     *   device.clearColor()
     *   device.clearDepth()
     *   device.clearStencil()
     */
    clear(r, g, b, a, depth, stencil, fbo) {
        const gl = this.gl;
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
        }
        gl.clearColor(r, g, b, a);
        gl.clearDepth(depth);
        gl.clearStencil(stencil);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}

/**
 * This file is an exercise in proprocessor voodoo.
 *
 * "process.env.NODE_ENV", gets suplied by the string replacer during a
 * custom build or our production build. If "production", constant evaluation
 * will eliminate the if blocks, making the functions no-ops, in turn eligible
 * for elimination from their callsites.
 *
 * While cool, this disables us to return values from the asserts, which would
 * make for a slightly nice programming model: const checkedVal = truthy(val)
 */
// This does not get replaced and serves as a default velue. If all its uses
// are eliminated, the value itself is pruned as well.
const process = {
    env: {
        NODE_ENV: "development",
    },
};
function nonNull(p, name, msg) {
    if (process.env.NODE_ENV !== "production") {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            throw new Error(msg || fmt(`object ${name || ""} ${p}`));
        }
    }
}

function equal(p, val, name, msg) {
    if (process.env.NODE_ENV !== "production") {
        if (p !== val) {
            throw new Error(msg || fmt(`${name || ""} values not equal: ${p} ${val}`));
        }
    }
}
function range(p, start, end, name, msg) {
    if (process.env.NODE_ENV !== "production") {
        if (p < start || p > end) {
            throw new Error(msg || fmt(`${name || ""} value ${p} not in [${start}, ${end}]`));
        }
    }
}
function never(p, msg) {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites. It should never be invoked, though.
    throw new Error(msg || fmt(`Unexpected object: ${p}`));
}
function fmt(msg) {
    return `Assertion Failed: ${msg}`;
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
 * Possible data types of vertex buffers.
 */
var VertexBufferType;
(function (VertexBufferType) {
    VertexBufferType[VertexBufferType["BYTE"] = 5120] = "BYTE";
    VertexBufferType[VertexBufferType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    VertexBufferType[VertexBufferType["SHORT"] = 5122] = "SHORT";
    VertexBufferType[VertexBufferType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    VertexBufferType[VertexBufferType["INT"] = 5124] = "INT";
    VertexBufferType[VertexBufferType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    VertexBufferType[VertexBufferType["FLOAT"] = 5126] = "FLOAT";
})(VertexBufferType || (VertexBufferType = {}));
/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
class VertexBuffer {
    constructor(gl, type, data) {
        this.gl = gl;
        this.type = type;
        this.data = data;
        this.glBuffer = null;
        this.init();
    }
    /**
     * Create a new vertex buffer from bytes.
     */
    static fromInt8Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.BYTE, data instanceof Int8Array ? data : new Int8Array(data));
    }
    /**
     * Create a new vertex buffer from short ints.
     */
    static fromInt16Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.SHORT, data instanceof Int16Array ? data : new Int16Array(data));
    }
    /**
     * Create a new vertex buffer from ints.
     */
    static fromInt32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.INT, data instanceof Int32Array ? data : new Int32Array(data));
    }
    /**
     * Create a new vertex buffer from unsigned bytes.
     */
    static fromUint8Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.UNSIGNED_BYTE, 
        // Note: we also have to convert Uint8ClampedArray to Uint8Array
        // because of webgl bug
        // https://github.com/KhronosGroup/WebGL/issues/1533
        data instanceof Uint8Array ? data : new Uint8Array(data));
    }
    /**
     * Create a new vertex buffer from unsigned short ints.
     */
    static fromUint16Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.UNSIGNED_SHORT, data instanceof Uint16Array ? data : new Uint16Array(data));
    }
    /**
     * Create a new vertex buffer from unsigned ints.
     */
    static fromUint32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.UNSIGNED_INT, data instanceof Uint32Array ? data : new Uint32Array(data));
    }
    /**
     * Create a new vertex buffer from floats.
     */
    static fromFloat32Array(dev, data) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(gl, VertexBufferType.FLOAT, data instanceof Float32Array ? data : new Float32Array(data));
    }
    get count() {
        return this.data.length;
    }
    /**
     * Force buffer reinitialization.
     */
    init() {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.glBuffer = buffer;
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
}

/**
 * Possible data types of element buffers.
 */
var ElementBufferType;
(function (ElementBufferType) {
    // Should we enable this?
    // UNSIGNED_BYTE = 0x1401,
    ElementBufferType[ElementBufferType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    ElementBufferType[ElementBufferType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
})(ElementBufferType || (ElementBufferType = {}));
/**
 * WebGL drawing primitives.
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
 * Element buffers contain indices for accessing vertex buffer data. They are,
 * together with vertex buffers part of VertexArray objects.
 */
class ElementBuffer {
    constructor(gl, data, type, primitive) {
        this.gl = gl;
        this.data = data;
        this.type = type;
        this.primitive = primitive;
        this.glBuffer = null;
        this.init();
    }
    /**
     * Creates a new element buffer from plain javascript array. Tries to infer
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * To select other drawing Primitives, use fromTypedArray family of methods.
     */
    static fromArray(dev, data) {
        if (isArray2(data)) {
            const s = shape2(data);
            range(s[1], 2, 3, "element tuple length");
            const r = ravel2(data, s);
            const prim = s[1] === 3 ? Primitive.TRIANGLES : Primitive.LINES;
            return ElementBuffer.fromUint32Array(dev, r, prim);
        }
        return ElementBuffer.fromUint32Array(dev, data, Primitive.POINTS);
    }
    /**
     * Create a new element buffer from unsigned short ints.
     */
    static fromUint16Array(dev, data, primitive) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint16Array(data) : data;
        return new ElementBuffer(gl, arr, ElementBufferType.UNSIGNED_SHORT, primitive);
    }
    /**
     * Create a new element buffer from unsigned ints.
     */
    static fromUint32Array(dev, data, primitive) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        return new ElementBuffer(gl, arr, ElementBufferType.UNSIGNED_INT, primitive);
    }
    get count() {
        return this.data.length;
    }
    /**
     * Force buffer reinitialization.
     */
    init() {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.glBuffer = buffer;
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
}

const INT_PATTERN$1 = /^0|[1-9]\d*$/;
/**
 * Attribute type for reading vertex buffers. POINTER provides normalization
 * options for converting integer values to floats. IPOINTER always converts
 * to data integers types.
 */
var AttributeType;
(function (AttributeType) {
    AttributeType["POINTER"] = "pointer";
    AttributeType["IPOINTER"] = "ipointer";
})(AttributeType || (AttributeType = {}));
/**
 * Vertex array objects store store vertex buffers, an index buffer,
 * and attributes with the vertex format for provided vertex buffers.
 */
class VertexArray {
    /**
     * Create a new vertex array with attribute and element definitions.
     * `attributes` can either reference an existing vertex buffer, or have
     * enough information to create a vertex buffer.
     * `elements` can either reference an existing element buffer, or be the
     * arguments for `ElementBuffer.create()`
     */
    static create(dev, { attributes, elements }) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const attrs = Object.entries(attributes)
            .map(([locationStr, definition]) => {
            if (!INT_PATTERN$1.test(locationStr)) {
                throw new Error("Location not a number. Use Command#locate");
            }
            const location = parseInt(locationStr, 10);
            return AttributeDescriptor.create(gl, location, definition);
        });
        const elementBuffer = elements && (elements instanceof ElementBuffer
            ? elements
            : ElementBuffer.fromArray(gl, elements));
        const count = elementBuffer
            ? elementBuffer.count
            : attrs.length
                ? attrs
                    .map(attr => attr.count)
                    .reduce((min, curr) => Math.min(min, curr))
                : 0;
        const instAttrs = attrs.filter(attr => !!attr.divisor);
        const instanceCount = instAttrs.length
            ? instAttrs
                .map(attr => attr.count * attr.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
        return new VertexArray(gl, attrs, elementBuffer, count, instanceCount);
    }
    constructor(gl, attributes, elements, count, instanceCount) {
        this.gl = gl;
        this.elementBuffer = elements;
        this.attributes = attributes;
        this.count = count;
        this.instanceCount = instanceCount;
        this.glVertexArray = null;
        this.init();
    }
    get hasElements() {
        return !!this.elementBuffer;
    }
    get elementPrimitive() {
        return this.elementBuffer && this.elementBuffer.primitive;
    }
    get elementType() {
        return this.elementBuffer && this.elementBuffer.type;
    }
    /**
     * Force vertex array reinitialization.
     */
    init() {
        const { gl, attributes, elementBuffer } = this;
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
                default: never(type);
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.glVertexArray = vao;
    }
    /**
     * Reinitialize invalid vertex array, eg. after context is lost. Also tries
     * to reinitialize vertex buffer and element buffer dependencies.
     */
    restore() {
        const { gl, glVertexArray, attributes, elementBuffer } = this;
        if (elementBuffer) {
            elementBuffer.restore();
        }
        attributes.forEach(attr => attr.buffer.restore());
        if (!gl.isVertexArray(glVertexArray)) {
            this.init();
        }
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
    static create(gl, location, props) {
        if (Array.isArray(props)) {
            if (isArray2(props)) {
                const s = shape2(props);
                const r = ravel2(props, s);
                return new AttributeDescriptor(location, AttributeType.POINTER, VertexBuffer.fromFloat32Array(gl, r), s[0], s[1], false, 0);
            }
            return new AttributeDescriptor(location, AttributeType.POINTER, VertexBuffer.fromFloat32Array(gl, props), props.length, 1, false, 0);
        }
        return new AttributeDescriptor(location, props.type, props.buffer, props.count, props.size, props.type === AttributeType.POINTER
            ? (props.normalized || false)
            : false, props.divisor || 0);
    }
}

class Framebuffer {
    static create(dev, { width, height, color, depth, stencil }) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const colorBuffers = Array.isArray(color) ? color : [color];
        colorBuffers.forEach(buffer => {
            equal(width, buffer.width, "width");
            equal(height, buffer.height, "height");
        });
        if (depth) {
            equal(width, depth.width, "width");
            equal(height, depth.height, "height");
        }
        if (stencil) {
            equal(width, stencil.width, "width");
            equal(height, stencil.height, "height");
        }
        return new Framebuffer(gl, width, height, colorBuffers, depth, stencil);
    }
    constructor(gl, width, height, colorBuffers, depthBuffer, stencilBuffer) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.colorBuffers = colorBuffers;
        this.depthBuffer = depthBuffer;
        this.stencilBuffer = stencilBuffer;
        this.glColorAttachments = colorBuffers
            .map((_, i) => gl.COLOR_ATTACHMENT0 + i);
        this.glFramebuffer = null;
        this.init();
    }
    init() {
        const { gl, colorBuffers, depthBuffer, stencilBuffer } = this;
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        colorBuffers.forEach((buffer, i) => {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, buffer.glTexture, 0);
        });
        if (depthBuffer) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthBuffer, 0);
        }
        if (stencilBuffer) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.TEXTURE_2D, stencilBuffer, 0);
        }
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.deleteFramebuffer(fbo);
            throw new Error("Framebuffer not complete");
        }
        this.glFramebuffer = fbo;
    }
    restore() {
        const { gl, glFramebuffer, colorBuffers, depthBuffer, stencilBuffer, } = this;
        colorBuffers.forEach(buffer => buffer.restore());
        if (depthBuffer) {
            depthBuffer.restore();
        }
        if (stencilBuffer) {
            stencilBuffer.restore();
        }
        if (!gl.isFramebuffer(glFramebuffer)) {
            this.init();
        }
    }
}

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
    constructor(gl, glProgram, uniformDescrs, count, offset, primitive, vertexArrayAcc, framebufferAcc, depthDescr, stencilDescr, blendDescr) {
        this.gl = gl;
        this.glProgram = glProgram;
        this.primitive = typeof primitive === "number" ? primitive : undefined;
        this.uniformDescrs = uniformDescrs;
        this.count = count;
        this.offset = offset;
        this.vertexArrayAcc = vertexArrayAcc;
        this.framebufferAcc = framebufferAcc;
        this.depthDescr = depthDescr;
        this.stencilDescr = stencilDescr;
        this.blendDescr = blendDescr;
        this.currVao = null;
        this.currFbo = null;
    }
    static create(dev, { vert, frag, uniforms = {}, data, framebuffer, count = 0, offset = 0, primitive, depth, stencil, blend, }) {
        nonNull(vert, "vert");
        nonNull(frag, "frag");
        if (depth) {
            nonNull(depth.func, "depth.func");
        }
        if (blend) {
            nonNull(blend.func, "blend.func");
            nonNull(blend.func.src, "blend.func.src");
            nonNull(blend.func.dst, "blend.func.dst");
            if (typeof blend.func.src === "object") {
                nonNull(blend.func.src.rgb, "blend.func.src.rgb");
                nonNull(blend.func.src.alpha, "blend.func.src.alpha");
            }
            if (typeof blend.func.dst === "object") {
                nonNull(blend.func.dst.rgb, "blend.func.dst.rgb");
                nonNull(blend.func.dst.alpha, "blend.func.dst.alpha");
            }
        }
        if (stencil) {
            nonNull(stencil.func, "stencil.func");
            // TODO: complete stencil validation... validation framework?
        }
        const gl = dev instanceof Device ? dev.gl : dev;
        const vs = createShader(gl, gl.VERTEX_SHADER, vert);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
        const prog = createProgram(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        const uniformDescrs = Object.entries(uniforms)
            .map(([ident, uniform]) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }
            return new UniformDescriptor(ident, loc, uniform);
        });
        const vertexArrayAcc = data
            ? typeof data === "function" || data instanceof VertexArray
                ? data
                : VertexArray.create(dev, locate(gl, prog, data))
            : undefined;
        const framebufferAcc = framebuffer
            ? typeof framebuffer === "function" || framebuffer instanceof Framebuffer
                ? framebuffer
                : Framebuffer.create(gl, framebuffer)
            : undefined;
        const depthDescr = parseDepth(depth);
        const stencilDescr = parseStencil(stencil);
        const blendDescr = parseBlend(blend);
        return new Command(gl, prog, uniformDescrs, count, offset, primitive, vertexArrayAcc, framebufferAcc, depthDescr, stencilDescr, blendDescr);
    }
    execute(props) {
        const { gl, glProgram } = this;
        /*
        When batching (passing in an array of props), the price for
        gl.useProgram, enabling depth/stencil tests and blending is paid only
        once for all draw calls.
        */
        gl.useProgram(glProgram);
        this.beginDepth();
        this.beginStencil();
        this.beginBlend();
        if (Array.isArray(props)) {
            props.forEach((p, i) => this.executeInner(p, i));
        }
        else {
            this.executeInner(props, 0);
        }
        // FBOs and VAOs are bound without unbinding in the inner loop
        this.unbindFbo();
        this.unbindVao();
        this.endBlend();
        this.endStencil();
        this.endDepth();
        gl.useProgram(null);
    }
    locate(vertexArrayProps) {
        return locate(this.gl, this.glProgram, vertexArrayProps);
    }
    executeInner(props, index) {
        const { gl, primitive, count, offset, vertexArrayAcc, framebufferAcc, } = this;
        /*
        Enabling multiple FBOs and VAOs per draw batch is a nice feature. We
        cache currently bound FBO/VAO to prevent needless rebinding.
        */
        let bufferWidth = gl.drawingBufferWidth;
        let bufferHeight = gl.drawingBufferHeight;
        const fbo = framebufferAcc && access(props, index, framebufferAcc);
        if (fbo) {
            this.bindFbo(fbo);
            bufferWidth = fbo.width;
            bufferHeight = fbo.height;
        }
        gl.viewport(0, 0, bufferWidth, bufferHeight);
        this.updateUniforms(props, index);
        const vao = vertexArrayAcc && access(props, index, vertexArrayAcc);
        if (vao) {
            this.bindVao(vao);
            const prim = typeof primitive === "undefined"
                ? typeof vao.elementPrimitive === "undefined"
                    ? gl.TRIANGLES
                    : vao.elementPrimitive
                : primitive;
            const cnt = count ? Math.min(count, vao.count) : vao.count;
            if (vao.hasElements) {
                const ty = vao.elementType;
                this.drawElements(prim, cnt, ty, offset, vao.instanceCount);
            }
            else {
                this.drawArrays(prim, cnt, offset, vao.instanceCount);
            }
        }
        else {
            this.drawArrays(typeof primitive === "undefined" ? gl.TRIANGLES : primitive, count, offset, 0);
        }
    }
    bindVao(vao) {
        if (vao !== this.currVao) {
            this.currVao = vao;
            this.gl.bindVertexArray(vao.glVertexArray);
        }
    }
    unbindVao() {
        this.gl.bindVertexArray(null);
        this.currVao = null;
    }
    bindFbo(fbo) {
        const gl = this.gl;
        if (fbo !== this.currFbo) {
            this.currFbo = fbo;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
            gl.drawBuffers(fbo.glColorAttachments);
        }
    }
    unbindFbo() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.currFbo = null;
    }
    beginDepth() {
        const { gl, depthDescr } = this;
        if (depthDescr) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(depthDescr.func);
            gl.depthMask(depthDescr.mask);
            gl.depthRange(depthDescr.rangeStart, depthDescr.rangeEnd);
        }
    }
    endDepth() {
        const { gl, depthDescr } = this;
        if (depthDescr) {
            gl.disable(gl.DEPTH_TEST);
        }
    }
    beginStencil() {
        const { gl, stencilDescr } = this;
        if (stencilDescr) {
            const { fFunc, bFunc, fFuncRef, bfuncRef, fFuncMask, bFuncMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass, } = stencilDescr;
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFuncSeparate(gl.FRONT, fFunc, fFuncRef, fFuncMask);
            gl.stencilFuncSeparate(gl.BACK, bFunc, bfuncRef, bFuncMask);
            gl.stencilMaskSeparate(gl.FRONT, fMask);
            gl.stencilMaskSeparate(gl.BACK, bMask);
            gl.stencilOpSeparate(gl.FRONT, fOpFail, fOpZFail, fOpZPass);
            gl.stencilOpSeparate(gl.BACK, bOpFail, bOpZFail, bOpZPass);
        }
    }
    endStencil() {
        const { gl, stencilDescr } = this;
        if (stencilDescr) {
            gl.disable(gl.STENCIL_TEST);
        }
    }
    beginBlend() {
        const { gl, blendDescr } = this;
        if (blendDescr) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(blendDescr.srcRGB, blendDescr.dstRGB, blendDescr.srcAlpha, blendDescr.dstAlpha);
            gl.blendEquationSeparate(blendDescr.equationRGB, blendDescr.equationAlpha);
            if (blendDescr.color) {
                const [r, g, b, a] = blendDescr.color;
                gl.blendColor(r, g, b, a);
            }
        }
    }
    endBlend() {
        const { gl, blendDescr } = this;
        if (blendDescr) {
            gl.disable(gl.BLEND);
        }
    }
    drawArrays(primitive, count, offset, instCount) {
        if (instCount) {
            this.gl.drawArraysInstanced(primitive, offset, count, instCount);
        }
        else {
            this.gl.drawArrays(primitive, offset, count);
        }
    }
    drawElements(primitive, count, type, offset, instCount) {
        const gl = this.gl;
        if (instCount) {
            gl.drawElementsInstanced(primitive, count, type, offset, instCount);
        }
        else {
            gl.drawElements(primitive, count, type, offset);
        }
    }
    updateUniforms(props, index) {
        const gl = this.gl;
        let textureUnitOffset = 0;
        this.uniformDescrs.forEach(({ identifier: ident, location: loc, definition: def, }) => {
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
                case "texture":
                    // TODO: is this the best way? (is it fast? can we cache?)
                    const texture = access(props, index, def.value);
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
function locate(gl, glProgram, { attributes, elements }) {
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
function access(props, index, value) {
    return typeof value === "function" ? value(props, index) : value;
}
class DepthDescriptor {
    constructor(func, mask, rangeStart, rangeEnd) {
        this.func = func;
        this.mask = mask;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
    }
}
class StencilDescriptor {
    constructor(fFunc, bFunc, fFuncRef, bfuncRef, fFuncMask, bFuncMask, fMask, bMask, fOpFail, bOpFail, fOpZFail, bOpZFail, fOpZPass, bOpZPass) {
        this.fFunc = fFunc;
        this.bFunc = bFunc;
        this.fFuncRef = fFuncRef;
        this.bfuncRef = bfuncRef;
        this.fFuncMask = fFuncMask;
        this.bFuncMask = bFuncMask;
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
    constructor(srcRGB, srcAlpha, dstRGB, dstAlpha, equationRGB, equationAlpha, color) {
        this.srcRGB = srcRGB;
        this.srcAlpha = srcAlpha;
        this.dstRGB = dstRGB;
        this.dstAlpha = dstAlpha;
        this.equationRGB = equationRGB;
        this.equationAlpha = equationAlpha;
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
    // R
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
    // ~DEPTH
    // DEPTH_COMPONENT16
    // DEPTH_COMPONENT24
    // DEPTH_COMPONENT32F
    // ~DEPTH STENCIL
    // DEPTH24_STENCIL8
    // DEPTH32F_STENCIL8
    // ~LUMINANCE ALPHA
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(TextureInternalFormat || (TextureInternalFormat = {}));
var TextureDataFormat;
(function (TextureDataFormat) {
    TextureDataFormat[TextureDataFormat["RED"] = 6403] = "RED";
    TextureDataFormat[TextureDataFormat["RG"] = 33319] = "RG";
    TextureDataFormat[TextureDataFormat["RGB"] = 6407] = "RGB";
    TextureDataFormat[TextureDataFormat["RGBA"] = 6408] = "RGBA";
    TextureDataFormat[TextureDataFormat["RED_INTEGER"] = 36244] = "RED_INTEGER";
    TextureDataFormat[TextureDataFormat["RG_INTEGER"] = 33320] = "RG_INTEGER";
    TextureDataFormat[TextureDataFormat["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
    TextureDataFormat[TextureDataFormat["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
    // TODO: support exotic formats
    // DEPTH_COMPONENT
    // DEPTH_STENCIL
    // LUMINANCE_ALPHA
    // LUMINANCE
    // ALPHA
})(TextureDataFormat || (TextureDataFormat = {}));
var TextureDataType;
(function (TextureDataType) {
    TextureDataType[TextureDataType["BYTE"] = 5120] = "BYTE";
    TextureDataType[TextureDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TextureDataType[TextureDataType["SHORT"] = 5122] = "SHORT";
    TextureDataType[TextureDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TextureDataType[TextureDataType["INT"] = 5124] = "INT";
    TextureDataType[TextureDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    TextureDataType[TextureDataType["FLOAT"] = 5126] = "FLOAT";
    TextureDataType[TextureDataType["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
    // TODO: support exotic formats
    // UNSIGNED_SHORT_4_4_4_4
    // UNSIGNED_SHORT_5_5_5_1
    // UNSIGNED_SHORT_5_6_5
    // UNSIGNED_INT_24_8
    // UNSIGNED_INT_5_9_9_9_REV
    // UNSIGNED_INT_2_10_10_10_REV
    // UNSIGNED_INT_10F_11F_11F_REV
    // FLOAT_32_UNSIGNED_INT_24_8_REV
})(TextureDataType || (TextureDataType = {}));
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
    static fromImage(dev, image, mipmap = false, options) {
        return Texture.create(dev, image.width, image.height, TextureInternalFormat.RGBA8, image.data, TextureDataFormat.RGBA, TextureDataType.UNSIGNED_BYTE, mipmap, options);
    }
    static empty(dev, width, height, internalFormat, { min = TextureFilter.NEAREST, mag = TextureFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = {}) {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new Texture(gl, width, height, internalFormat, wrapS, wrapT, min, mag);
    }
    static create(dev, width, height, internalFormat, data, dataFormat, dataType, mipmap, { min = TextureFilter.NEAREST, mag = TextureFilter.NEAREST, wrapS = TextureWrap.CLAMP_TO_EDGE, wrapT = TextureWrap.CLAMP_TO_EDGE, } = {}) {
        const gl = dev instanceof Device ? dev.gl : dev;
        const tex = new Texture(gl, width, height, internalFormat, wrapS, wrapT, min, mag);
        if (data) {
            tex.store(data, dataFormat, dataType, mipmap);
        }
        return tex;
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
    restore() {
        const { gl, glTexture } = this;
        if (!gl.isTexture(glTexture)) {
            this.init();
        }
    }
    store(data, format, type, mipmap = false) {
        const { gl, glTexture, width, height } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, data);
        if (mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    mipmap() {
        const { gl, glTexture } = this;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export { Device, Extension, Command, DepthFunc, StencilFunc, StencilOp, BlendFunc, BlendEquation, VertexBuffer, VertexBufferType, ElementBuffer, ElementBufferType, Primitive, VertexArray, AttributeType, Texture, TextureFilter, TextureWrap, TextureInternalFormat, TextureDataFormat, TextureDataType, Framebuffer };
//# sourceMappingURL=glutenfree.es.js.map
