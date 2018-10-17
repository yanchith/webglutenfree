import * as assert from "./util/assert";
import { BufferUsage } from "./types";

export const enum VertexBufferIntegerDataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
}

export const enum VertexBufferFloatDataType {
    FLOAT = 0x1406,
}

export type VertexBufferDataType =
    | VertexBufferIntegerDataType
    | VertexBufferFloatDataType
    ;

export interface VertexBufferDataTypeToTypedArray {
    [VertexBufferIntegerDataType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [VertexBufferIntegerDataType.BYTE]: Int8Array;
    [VertexBufferIntegerDataType.UNSIGNED_SHORT]: Uint16Array;
    [VertexBufferIntegerDataType.SHORT]: Int16Array;
    [VertexBufferIntegerDataType.UNSIGNED_INT]: Uint32Array;
    [VertexBufferIntegerDataType.INT]: Int32Array;
    [VertexBufferFloatDataType.FLOAT]: Float32Array;
}

export interface VertexBufferCreateOptions {
    usage?: BufferUsage;
}

export interface VertexBufferStoreOptions {
    offset?: number;
}

export function _createVertexBuffer<T extends VertexBufferDataType>(
    gl: WebGL2RenderingContext,
    type: T,
    size: number,
    { usage = BufferUsage.DYNAMIC_DRAW }: VertexBufferCreateOptions = {},
): VertexBuffer<T> {
    return new VertexBuffer(
        gl,
        type,
        size,
        size * sizeOf(type),
        usage,
    );
}

export function _createVertexBufferWithTypedArray<T extends VertexBufferDataType>(
    gl: WebGL2RenderingContext,
    type: T,
    data: VertexBufferDataTypeToTypedArray[T],
    { usage = BufferUsage.STATIC_DRAW }: VertexBufferCreateOptions = {},
): VertexBuffer<T> {
    return new VertexBuffer(
        gl,
        type,
        data.length,
        data.byteLength,
        usage,
    ).store(data);
}

/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export class VertexBuffer<T extends VertexBufferDataType> {

    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly usage: BufferUsage;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        type: T,
        length: number,
        byteLength: number,
        usage: BufferUsage,
    ) {
        this.gl = gl;
        this.type = type;
        this.length = length;
        this.byteLength = byteLength;
        this.usage = usage;
        this.glBuffer = null;

        this.init();
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }

    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(
        data: VertexBufferDataTypeToTypedArray[T],
        { offset = 0 }: VertexBufferStoreOptions = {},
    ): this {
        const { gl, glBuffer } = this;
        // WebGL bug causes Uint8ClampedArray to be read incorrectly
        // https://github.com/KhronosGroup/WebGL/issues/1533
        const buffer = data instanceof Uint8ClampedArray
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

    private init(): void {
        const { usage, byteLength, gl } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, byteLength, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }
}

export function sizeOf(type: VertexBufferDataType): number {
    switch (type) {
        case VertexBufferIntegerDataType.BYTE:
        case VertexBufferIntegerDataType.UNSIGNED_BYTE:
            return 1;
        case VertexBufferIntegerDataType.SHORT:
        case VertexBufferIntegerDataType.UNSIGNED_SHORT:
            return 2;
        case VertexBufferIntegerDataType.INT:
        case VertexBufferIntegerDataType.UNSIGNED_INT:
        case VertexBufferFloatDataType.FLOAT:
            return 4;
        default: return assert.unreachable(type);
    }
}
