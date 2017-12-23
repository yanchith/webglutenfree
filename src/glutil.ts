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
    POINTER = 0,
    IPOINTER = 1,
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
    elementBuffer?: WebGLBuffer,
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
            case AttribType.POINTER:
                gl.vertexAttribPointer(location, size, bufferType, normalized, 0, 0);
                break;
            case AttribType.IPOINTER:
                gl.vertexAttribIPointer(location, size, bufferType, 0, 0);
                break;
            default: assert.never(type);
        }
        if (divisor) { gl.vertexAttribDivisor(location, divisor); }
    });

    if (elementBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    }

    gl.bindVertexArray(null);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vao;
}
