import * as assert from "./assert";
import * as array from "./array";
import { Device } from "./device";
import { BufferUsage } from "./vertex-buffer";

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
export enum ElementBufferType {
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405,
}

/**
 * WebGL drawing primitives.
 */
export enum Primitive {
    POINTS = 0x0000,
    LINES = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLES = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006,
}

export type ElementBufferTypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    ;

export interface ElementBufferTypeToTypedArray {
    [ElementBufferType.UNSIGNED_BYTE]: Uint8Array | Uint8ClampedArray;
    [ElementBufferType.UNSIGNED_SHORT]: Uint16Array;
    [ElementBufferType.UNSIGNED_INT]: Uint32Array;

    [p: number]: ElementBufferTypedArray;
}


/**
 * Element buffers contain indices for accessing vertex buffer data. They are,
 * together with vertex buffers part of VertexArray objects.
 */
export class ElementBuffer<T extends ElementBufferType> {

    /**
     * Creates a new element buffer from plain javascript array. Tries to infer
     * Primitive from the array's shape:
     *   number[] -> POINTS
     *   [number, number][] -> LINES
     *   [number, number, number][] -> TRIANGLES
     * To select other drawing Primitives, use fromTypedArray family of methods.
     */
    static fromArray(
        dev: Device,
        data: ElementArray,
    ): ElementBuffer<ElementBufferType.UNSIGNED_INT> {
        if (array.isArray2(data)) {
            const shape = array.shape2(data);
            assert.range(shape[1], 2, 3, "element tuple length");
            const ravel = array.ravel2(data, shape);
            const primitive = shape[1] === 3
                ? Primitive.TRIANGLES
                : Primitive.LINES;
            return ElementBuffer.create(
                dev,
                ElementBufferType.UNSIGNED_INT,
                primitive,
                ravel,
            );
        }
        return ElementBuffer.create(
            dev,
            ElementBufferType.UNSIGNED_INT,
            Primitive.POINTS,
            data,
        );
    }

    /**
     * Create a new element buffer from unsigned short ints.
     */
    static create<T extends ElementBufferType>(
        dev: Device,
        type: T,
        primitive: Primitive,
        data: ElementBufferTypeToTypedArray[T] | number[],
        usage: BufferUsage = BufferUsage.STATIC_DRAW,
    ): ElementBuffer<T> {
        const buffer = Array.isArray(data)
            ? createBuffer(type, data)
            // Note: we have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            : data instanceof Uint8ClampedArray
                ? new Uint8Array(data)
                : data;
        return new ElementBuffer(dev.gl, type, primitive, usage, buffer);
    }

    readonly type: T;
    readonly primitive: Primitive;
    readonly usage: BufferUsage;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: ElementBufferTypedArray;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        primitive: Primitive,
        usage: BufferUsage,
        data: ElementBufferTypedArray,
    ) {
        this.gl = gl;
        this.data = data;
        this.type = type;
        this.primitive = primitive;
        this.usage = usage;
        this.glBuffer = null;

        this.init();
    }

    get count(): number {
        return this.data.length;
    }

    /**
     * Force buffer reinitialization.
     */
    init(): void {
        const { usage, gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }

    /**
     * Upload new data to buffer, possibly with offset.
     */
    store(
        data: ElementBufferTypeToTypedArray[T] | number[],
        offset: number = 0,
    ): void {
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
    }
}

function createBuffer(
    type: ElementBufferType,
    arr: number[],
): ElementBufferTypedArray {
    switch (type) {
        case ElementBufferType.UNSIGNED_BYTE: return new Uint8Array(arr);
        case ElementBufferType.UNSIGNED_SHORT: return new Uint16Array(arr);
        case ElementBufferType.UNSIGNED_INT: return new Uint32Array(arr);
        default: return assert.never(type, `Invalid buffer type: ${type}`);
    }
}
