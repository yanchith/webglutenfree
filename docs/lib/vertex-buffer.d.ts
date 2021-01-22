import { BufferUsage } from "./types";
export declare enum VertexBufferIntegerDataType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125
}
export declare enum VertexBufferFloatDataType {
    FLOAT = 5126
}
export declare type VertexBufferDataType = VertexBufferIntegerDataType | VertexBufferFloatDataType;
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
export declare function _createVertexBuffer<T extends VertexBufferDataType>(gl: WebGL2RenderingContext, type: T, size: number, { usage }?: VertexBufferCreateOptions): VertexBuffer<T>;
export declare function _createVertexBufferWithTypedArray<T extends VertexBufferDataType>(gl: WebGL2RenderingContext, type: T, data: VertexBufferDataTypeToTypedArray[T], { usage }?: VertexBufferCreateOptions): VertexBuffer<T>;
/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export declare class VertexBuffer<T extends VertexBufferDataType> {
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
    store(data: VertexBufferDataTypeToTypedArray[T], { offset }?: VertexBufferStoreOptions): this;
    private init;
}
export declare function sizeOf(type: VertexBufferDataType): number;
//# sourceMappingURL=vertex-buffer.d.ts.map