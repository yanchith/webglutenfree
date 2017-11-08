import * as assert from "./assert";

/*
███████╗██╗  ██╗ █████╗ ██████╗ ███████╗██████╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗
███████╗███████║███████║██║  ██║█████╗  ██████╔╝
╚════██║██╔══██║██╔══██║██║  ██║██╔══╝  ██╔══██╗
███████║██║  ██║██║  ██║██████╔╝███████╗██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
*/

export function createProgram(
    gl: WebGL2RenderingContext,
    vertex: WebGLShader,
    fragment: WebGLShader,
): WebGLProgram {
    const program = gl.createProgram();
    if (!program) { throw new Error("Could not create Program"); }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) { return program; }

    const msg = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link shader program: ${msg}`);
}

export function createShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string,
): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) { throw new Error("Could not create Shader"); }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { return shader; }

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

export function createArrayBuffer(
    gl: WebGL2RenderingContext,
    values: ArrayBuffer | ArrayBufferView,
): WebGLBuffer {
    const buffer = gl.createBuffer();
    if (!buffer) { throw new Error("Could not create buffer"); }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        Array.isArray(values)
            ? new Float32Array(values)
            : values,
        gl.STATIC_DRAW,
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

export function createElementArrayBuffer(
    gl: WebGL2RenderingContext,
    elements: Uint32Array,
): WebGLBuffer {
    const buffer = gl.createBuffer();
    if (!buffer) { throw new Error("Could not create buffer"); }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        Array.isArray(elements)
            ? new Uint32Array(elements)
            : elements,
        gl.STATIC_DRAW,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
}

/*
██╗   ██╗███████╗██████╗ ████████╗███████╗██╗  ██╗
██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝
██║   ██║█████╗  ██████╔╝   ██║   █████╗   ╚███╔╝
╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝   ██╔██╗
 ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██╔╝ ██╗
  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝

 █████╗ ██████╗ ██████╗  █████╗ ██╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
███████║██████╔╝██████╔╝███████║ ╚████╔╝
██╔══██║██╔══██╗██╔══██╗██╔══██║  ╚██╔╝
██║  ██║██║  ██║██║  ██║██║  ██║   ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
*/

export const enum AttribType {
    Pointer = 0,
    IPointer = 1,
}

export function createVertexArray(
    gl: WebGL2RenderingContext,
    buffers: {
        type: AttribType,
        buffer: WebGLBuffer;
        bufferType: number,
        size: number;
        location: number,
        normalized?: boolean,
        divisor?: number,
    }[],
    elementBuffer: WebGLBuffer,
): WebGLVertexArrayObject {
    const vao = gl.createVertexArray();
    if (!vao) { throw new Error("Could not create Vertex Array Object"); }

    gl.bindVertexArray(vao);
    buffers.forEach(({
        type,
        buffer,
        bufferType,
        size,
        location,
        normalized = false,
        divisor,
    }) => {
        // Enable sending attribute arrays for location
        gl.enableVertexAttribArray(location);

        // Send buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        switch (type) {
            case AttribType.Pointer:
                gl.vertexAttribPointer(location, size, bufferType, normalized, 0, 0);
                break;
            case AttribType.IPointer:
                gl.vertexAttribIPointer(location, size, bufferType, 0, 0);
                break;
            default: assert.never(type);
        }
        if (divisor) { gl.vertexAttribDivisor(location, divisor); }
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

export function createTexture(
    gl: WebGL2RenderingContext,
    data: ArrayBufferView | null,
    width: number,
    height: number,
    internalFormat: number,
    format: number,
    type: number,
    wrapS: number,
    wrapT: number,
    min: number,
    mag: number,
    mipmap: boolean,
): WebGLTexture {
    const texture = gl.createTexture();
    if (!texture) { throw new Error("Could not create texture"); }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);

    if (mipmap) { gl.generateMipmap(gl.TEXTURE_2D); }

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

export function createFramebuffer(
    gl: WebGL2RenderingContext,
    textures: WebGLTexture[],
): WebGLFramebuffer {
    const fbo = gl.createFramebuffer();
    if (!fbo) { throw new Error("Could not create framebuffer"); }

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    textures.forEach((texture, i) => {
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0 + i,
            gl.TEXTURE_2D,
            texture,
            0,
        );
    });

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }

    gl.deleteFramebuffer(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    throw new Error("Framebuffer not complete");
}
