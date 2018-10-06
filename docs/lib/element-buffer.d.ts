/// <reference types="webgl2" />
import { BufferUsage, DataType, Primitive } from "./types";
export declare type ElementArray = number[] | [number, number][] | [number, number, number][] | number[][];
/**
 * Possible data types of element buffers.
 */
export declare type ElementBufferType = DataType.UNSIGNED_BYTE | DataType.UNSIGNED_SHORT | DataType.UNSIGNED_INT;
export declare type ElementBufferTypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;
export interface ElementBufferTypeToTypedArray {
    [DataType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [DataType.UNSIGNED_SHORT]: Uint16Array;
    [DataType.UNSIGNED_INT]: Uint32Array;
    [p: number]: ElementBufferTypedArray;
}
export interface ElementBufferCreateOptions {
    usage?: BufferUsage;
}
export interface ElementBufferStoreOptions {
    offset?: number;
}
/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
export declare class ElementBuffer<T extends ElementBufferType> {
    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: Primitive;
    readonly usage: BufferUsage;
    readonly glBuffer: WebGLBuffer | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, type: T, primitive: Primitive, length: number, byteLength: number, usage: BufferUsage);
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(data: ElementBufferTypeToTypedArray[T] | number[], { offset }?: ElementBufferStoreOptions): this;
    private init;
}
//# sourceMappingURL=element-buffer.d.ts.map