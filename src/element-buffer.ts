import * as assert from "./util/assert";
import * as array from "./util/array";
import { BufferUsage } from "./types";

export type ElementArray =
    | number[] // infers POINTS
    | [number, number][] // infers LINES
    | [number, number, number][] // infers TRIANGLES
    /*
    Unfortunately, typescript does not always infer tuple types when in
    nested optional structutes, so we provide a number[][] typing fallback.
    If explicit tuples make it to typescript, the fallback might go away.
    */
    | number[][]
    ;

export enum ElementPrimitive {
    POINT_LIST = 0x0000,
    LINE_LIST = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLE_LIST = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006,
}

export const enum ElementBufferDataType {
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405,
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

export function _createElementBuffer<T extends ElementBufferDataType>(
    gl: WebGL2RenderingContext,
    type: T,
    primitive: ElementPrimitive,
    size: number,
    { usage = BufferUsage.DYNAMIC_DRAW }: ElementBufferCreateOptions = {},
): ElementBuffer<T> {
    return new ElementBuffer(
        gl,
        type,
        primitive,
        size,
        size * sizeOf(type),
        usage,
    );
}

export function _createElementBufferWithArray(
    gl: WebGL2RenderingContext,
    data: ElementArray,
    options?: ElementBufferCreateOptions,
): ElementBuffer<ElementBufferDataType.UNSIGNED_INT> {
    if (array.is2(data)) {
        const shape = array.shape2(data);
        assert.rangeInclusive(shape[1], 2, 3, (p) => {
            return `Elements must be 2-tuples or 3-tuples, got ${p}-tuple`;
        });
        const ravel = array.ravel2(data, shape);
        const primitive = shape[1] === 3
            ? ElementPrimitive.TRIANGLE_LIST
            : ElementPrimitive.LINE_LIST;
        return _createElementBufferWithTypedArray(
            gl,
            ElementBufferDataType.UNSIGNED_INT,
            primitive,
            new Uint32Array(ravel),
            options,
        );
    }
    return _createElementBufferWithTypedArray(
        gl,
        ElementBufferDataType.UNSIGNED_INT,
        ElementPrimitive.POINT_LIST,
        new Uint32Array(data),
        options,
    );
}

export function _createElementBufferWithTypedArray<T extends ElementBufferDataType>(
    gl: WebGL2RenderingContext,
    type: T,
    primitive: ElementPrimitive,
    data: ElementBufferDataTypeToTypedArray[T],
    { usage = BufferUsage.STATIC_DRAW }: ElementBufferCreateOptions = {},
): ElementBuffer<T> {
    return new ElementBuffer(
        gl,
        type,
        primitive,
        data.length,
        data.length * sizeOf(type),
        usage,
    ).store(data);
}

/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
export class ElementBuffer<T extends ElementBufferDataType> {

    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: ElementPrimitive;
    readonly usage: BufferUsage;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        type: T,
        primitive: ElementPrimitive,
        length: number,
        byteLength: number,
        usage: BufferUsage,
    ) {
        this.gl = gl;
        this.type = type;
        this.primitive = primitive;
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
        data: ElementBufferDataTypeToTypedArray[T],
        { offset = 0 }: ElementBufferStoreOptions = {},
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return this;
    }

    private init(): void {
        const { usage, byteLength, gl } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, byteLength, usage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

}

export function sizeOf(type: ElementBufferDataType): number {
    switch (type) {
        case ElementBufferDataType.UNSIGNED_BYTE:
            return 1;
        case ElementBufferDataType.UNSIGNED_SHORT:
            return 2;
        case ElementBufferDataType.UNSIGNED_INT:
            return 4;
        default: return assert.unreachable(type);
    }
}
