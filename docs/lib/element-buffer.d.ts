import { BufferUsage, DataType, Primitive } from "./types";
export declare type Device = import("./device").Device;
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
export interface ElementBufferOptions {
    usage?: BufferUsage;
}
export interface ElementBufferStoreOptions {
    offset?: number;
}
/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
export declare class ElementBuffer<T extends ElementBufferType> {
    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    static create<T extends ElementBufferType>(dev: Device, type: T, primitive: Primitive, size: number, { usage }?: ElementBufferOptions): ElementBuffer<T>;
    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    static withArray(dev: Device, data: ElementArray, options?: ElementBufferOptions): ElementBuffer<DataType.UNSIGNED_INT>;
    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    static withTypedArray<T extends ElementBufferType>(dev: Device, type: T, primitive: Primitive, data: ElementBufferTypeToTypedArray[T] | number[], { usage }?: ElementBufferOptions): ElementBuffer<T>;
    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: Primitive;
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
    store(data: ElementBufferTypeToTypedArray[T] | number[], { offset }?: ElementBufferStoreOptions): this;
    private init;
}
