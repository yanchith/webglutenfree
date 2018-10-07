/// <reference types="webgl2" />
import { BufferUsage, DataType } from "./types";
/**
 * Possible data types of vertex buffers.
 */
export declare type VertexBufferType = DataType.UNSIGNED_BYTE | DataType.BYTE | DataType.UNSIGNED_SHORT | DataType.SHORT | DataType.UNSIGNED_INT | DataType.INT | DataType.FLOAT;
export declare type VertexBufferTypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array;
export interface VertexBufferTypeToTypedArray {
    [DataType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [DataType.BYTE]: Int8Array;
    [DataType.UNSIGNED_SHORT]: Uint16Array;
    [DataType.SHORT]: Int16Array;
    [DataType.UNSIGNED_INT]: Uint32Array;
    [DataType.INT]: Int32Array;
    [DataType.FLOAT]: Float32Array;
    [p: number]: VertexBufferTypedArray;
}
export interface VertexBufferCreateOptions {
    usage?: BufferUsage;
}
export interface VertexBufferStoreOptions {
    offset?: number;
}
export declare function _createVertexBuffer<T extends VertexBufferType>(gl: WebGL2RenderingContext, type: T, size: number, { usage }?: VertexBufferCreateOptions): VertexBuffer<T>;
export declare function _createVertexBufferWithTypedArray<T extends VertexBufferType>(gl: WebGL2RenderingContext, type: T, data: VertexBufferTypeToTypedArray[T] | number[], { usage }?: VertexBufferCreateOptions): VertexBuffer<T>;
/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export declare class VertexBuffer<T extends VertexBufferType> {
    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly usage: BufferUsage;
    readonly glBuffer: WebGLBuffer | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, type: T, length: number, byteLength: number, usage: BufferUsage);
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(data: VertexBufferTypeToTypedArray[T] | number[], { offset }?: VertexBufferStoreOptions): this;
    private init;
}
//# sourceMappingURL=vertex-buffer.d.ts.map