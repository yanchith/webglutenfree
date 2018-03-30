import * as assert from "./util/assert";
import * as array from "./util/array";
import { BufferUsage, DataType, Primitive, sizeOf } from "./types";
import { Device as _Device } from "./device";

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

/**
 * Possible data types of element buffers.
 */
export type ElementBufferType =
    | DataType.UNSIGNED_BYTE
    | DataType.UNSIGNED_SHORT
    | DataType.UNSIGNED_INT
    ;

export type ElementBufferTypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    ;

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
export class ElementBuffer<T extends ElementBufferType> {

    /**
     * Create a new element buffer with given type, primitive, and size.
     */
    static create<T extends ElementBufferType>(
        dev: _Device,
        type: T,
        primitive: Primitive,
        size: number,
        { usage = BufferUsage.DYNAMIC_DRAW }: ElementBufferOptions = {},
    ): ElementBuffer<T> {
        return new ElementBuffer(
            dev._gl,
            type,
            primitive,
            size,
            size * sizeOf(type),
            usage,
        );
    }

    /**
     * Create a new element buffer from potentially nested array. Infers
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * Does not take ownership of data.
     */
    static withArray(
        dev: _Device,
        data: ElementArray,
        options?: ElementBufferOptions,
    ): ElementBuffer<DataType.UNSIGNED_INT> {
        if (array.isArray2(data)) {
            const shape = array.shape2(data);
            assert.range(shape[1], 2, 3, "elements must be 2-tuples or 3-tuples");
            const ravel = array.ravel2(data, shape);
            const primitive = shape[1] === 3
                ? Primitive.TRIANGLES
                : Primitive.LINES;
            return ElementBuffer.withTypedArray(
                dev,
                DataType.UNSIGNED_INT,
                primitive,
                ravel,
            );
        }
        return ElementBuffer.withTypedArray(
            dev,
            DataType.UNSIGNED_INT,
            Primitive.POINTS,
            data,
            options,
        );
    }

    /**
     * Create a new element buffer of given type with provided data. Does not
     * take ownership of data.
     */
    static withTypedArray<T extends ElementBufferType>(
        dev: _Device,
        type: T,
        primitive: Primitive,
        data: ElementBufferTypeToTypedArray[T] | number[],
        { usage = BufferUsage.STATIC_DRAW }: ElementBufferOptions = {},
    ): ElementBuffer<T> {
        return new ElementBuffer(
            dev._gl,
            type,
            primitive,
            data.length,
            data.length * sizeOf(type),
            usage,
        ).store(data);
    }

    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: Primitive;
    readonly usage: BufferUsage;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        primitive: Primitive,
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
        data: ElementBufferTypeToTypedArray[T] | number[],
        { offset = 0 }: ElementBufferStoreOptions = {},
    ): this {
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

function createBuffer(
    type: ElementBufferType,
    arr: number[],
): ElementBufferTypedArray {
    switch (type) {
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        default: return assert.never(type, `invalid buffer type: ${type}`);
    }
}
