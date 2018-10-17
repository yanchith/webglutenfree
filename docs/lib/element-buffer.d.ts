/// <reference types="webgl2" />
import { BufferUsage } from "./types";
export declare type ElementArray = number[] | [number, number][] | [number, number, number][] | number[][];
export declare enum ElementPrimitive {
    POINT_LIST = 0,
    LINE_LIST = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLE_LIST = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6
}
export declare const enum ElementBufferDataType {
    UNSIGNED_BYTE = 5121,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125
}
export interface ElementBufferDataTypeToTypedArray {
    [ElementBufferDataType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [ElementBufferDataType.UNSIGNED_SHORT]: Uint16Array;
    [ElementBufferDataType.UNSIGNED_INT]: Uint32Array;
}
export interface ElementBufferCreateOptions {
    usage?: BufferUsage;
}
export interface ElementBufferStoreOptions {
    offset?: number;
}
export declare function _createElementBuffer<T extends ElementBufferDataType>(gl: WebGL2RenderingContext, type: T, primitive: ElementPrimitive, size: number, { usage }?: ElementBufferCreateOptions): ElementBuffer<T>;
export declare function _createElementBufferWithArray(gl: WebGL2RenderingContext, data: ElementArray, options?: ElementBufferCreateOptions): ElementBuffer<ElementBufferDataType.UNSIGNED_INT>;
export declare function _createElementBufferWithTypedArray<T extends ElementBufferDataType>(gl: WebGL2RenderingContext, type: T, primitive: ElementPrimitive, data: ElementBufferDataTypeToTypedArray[T], { usage }?: ElementBufferCreateOptions): ElementBuffer<T>;
/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
export declare class ElementBuffer<T extends ElementBufferDataType> {
    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: ElementPrimitive;
    readonly usage: BufferUsage;
    readonly glBuffer: WebGLBuffer | null;
    private gl;
    constructor(gl: WebGL2RenderingContext, type: T, primitive: ElementPrimitive, length: number, byteLength: number, usage: BufferUsage);
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Upload new data to buffer. Does not take ownership of data.
     */
    store(data: ElementBufferDataTypeToTypedArray[T], { offset }?: ElementBufferStoreOptions): this;
    private init;
}
export declare function sizeOf(type: ElementBufferDataType): number;
//# sourceMappingURL=element-buffer.d.ts.map