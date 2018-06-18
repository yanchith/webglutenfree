import { BufferUsage, DataType } from "./types";
export declare type Device = import("./device").Device;
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
export interface VertexBufferOptions {
    usage?: BufferUsage;
}
export interface VertexBufferStoreOptions {
    offset?: number;
}
/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export declare class VertexBuffer<T extends VertexBufferType> {
    /**
     * Create a new vertex buffer with given type and of given size.
     */
    static create<T extends VertexBufferType>(dev: Device, type: T, size: number, { usage }?: {
        usage?: BufferUsage;
    }): VertexBuffer<T>;
    /**
     * Create a new vertex buffer of given type with provided data. Does not
     * take ownership of data.
     */
    static withTypedArray<T extends VertexBufferType>(dev: Device, type: T, data: VertexBufferTypeToTypedArray[T] | number[], { usage }?: VertexBufferOptions): VertexBuffer<T>;
    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly usage: BufferUsage;
    readonly glBuffer: WebGLBuffer | null;
    private gl;
    private constructor();
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