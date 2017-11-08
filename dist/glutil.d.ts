/// <reference types="webgl2" />
export declare function createProgram(gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram;
export declare function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader;
export declare function createArrayBuffer(gl: WebGL2RenderingContext, values: ArrayBuffer | ArrayBufferView): WebGLBuffer;
export declare function createElementArrayBuffer(gl: WebGL2RenderingContext, elements: Uint32Array): WebGLBuffer;
export declare const enum AttribType {
    Pointer = 0,
    IPointer = 1,
}
export declare function createVertexArray(gl: WebGL2RenderingContext, buffers: {
    type: AttribType;
    buffer: WebGLBuffer;
    bufferType: number;
    size: number;
    location: number;
    normalized?: boolean;
    divisor?: number;
}[], elementBuffer: WebGLBuffer): WebGLVertexArrayObject;
export declare function createTexture(gl: WebGL2RenderingContext, data: ArrayBufferView | null, width: number, height: number, internalFormat: number, format: number, type: number, wrapS: number, wrapT: number, min: number, mag: number, mipmap: boolean): WebGLTexture;
export declare function createFramebuffer(gl: WebGL2RenderingContext, textures: WebGLTexture[]): WebGLFramebuffer;
