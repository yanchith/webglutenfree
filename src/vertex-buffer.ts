import * as assert from "./assert";
import { Device } from "./device";

/**
 * Possible data types of vertex buffers.
 */
export enum VertexBufferType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
}

export type VertexBufferTypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    ;

export interface VertexBufferTypeToTypedArray {
    [VertexBufferType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [VertexBufferType.BYTE]: Int8Array;
    [VertexBufferType.UNSIGNED_SHORT]: Uint16Array;
    [VertexBufferType.SHORT]: Int16Array;
    [VertexBufferType.UNSIGNED_INT]: Uint32Array;
    [VertexBufferType.INT]: Int32Array;
    [VertexBufferType.FLOAT]: Float32Array;

    [p: number]: VertexBufferTypedArray;
}


/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export class VertexBuffer<T extends VertexBufferType> {

    /**
     * Create a new vertex buffer of given type with provided data.
     */
    static create<T extends VertexBufferType>(
        dev: Device,
        type: T,
        data: VertexBufferTypeToTypedArray[T] | number[],
    ): VertexBuffer<T> {
        const buffer = Array.isArray(data)
            ? createBuffer(type, data)
            // Note: we have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
                ? new Uint8Array(data)
                : data;
        return new VertexBuffer(dev.gl, type, buffer);
    }

    readonly type: T;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: VertexBufferTypedArray;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        data: VertexBufferTypedArray,
    ) {
        this.gl = gl;
        this.type = type;
        this.data = data;
        this.glBuffer = null;

        this.init();
    }

    /**
     * Force buffer reinitialization.
     */
    init(): void {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }

    /**
     * Upload new data to buffer, possibly with offset.
     */
    store(
        data: VertexBufferTypeToTypedArray[T] | number[],
        offset: number = 0,
    ): void {
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
    }
}

function createBuffer(
    type: VertexBufferType,
    arr: number[],
): VertexBufferTypedArray {
    switch (type) {
        case VertexBufferType.BYTE: return new Int8Array(arr);
        case VertexBufferType.SHORT: return new Int16Array(arr);
        case VertexBufferType.INT: return new Int32Array(arr);
        case VertexBufferType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case VertexBufferType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case VertexBufferType.UNSIGNED_INT: return new Uint32Array(arr);
        case VertexBufferType.FLOAT: return new Float32Array(arr);
        default: return assert.never(type, `Invalid buffer type: ${type}`);
    }
}
