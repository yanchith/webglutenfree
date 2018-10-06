import * as assert from "./util/assert";
import { BufferUsage, DataType, Primitive } from "./types";

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

export interface ElementBufferCreateOptions {
    usage?: BufferUsage;
}

export interface ElementBufferStoreOptions {
    offset?: number;
}

/**
 * Element buffers contain indices for accessing vertex buffer data.
 */
export class ElementBuffer<T extends ElementBufferType> {

    readonly type: T;
    readonly length: number;
    readonly byteLength: number;
    readonly primitive: Primitive;
    readonly usage: BufferUsage;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;

    constructor(
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
            // WebGL bug causes Uint8ClampedArray to be read incorrectly
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
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

function createBuffer(
    type: ElementBufferType,
    arr: number[],
): ElementBufferTypedArray {
    switch (type) {
        case DataType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case DataType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case DataType.UNSIGNED_INT: return new Uint32Array(arr);
        default: return assert.unreachable(type, (p) => {
            return `invalid buffer type: ${p}`;
        });
    }
}
