import * as assert from "./assert";
import * as array from "./array";
import { Device } from "./device";

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
    // Should we enable this?
    // UNSIGNED_BYTE = 0x1401,
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
            return ElementBuffer.fromUint32Array(dev, primitive, ravel);
        }
        return ElementBuffer.fromUint32Array(dev, Primitive.POINTS, data);
    }

    /**
     * Create a new element buffer from unsigned short ints.
     */
    static fromUint16Array(
        dev: Device,
        primitive: Primitive,
        data: number[] | Uint16Array,
    ): ElementBuffer<ElementBufferType.UNSIGNED_SHORT> {
        const arr = Array.isArray(data) ? new Uint16Array(data) : data;
        return new ElementBuffer(
            dev.gl,
            arr,
            ElementBufferType.UNSIGNED_SHORT,
            primitive,
        );
    }

    /**
     * Create a new element buffer from unsigned ints.
     */
    static fromUint32Array(
        dev: Device,
        primitive: Primitive,
        data: number[] | Uint32Array,
    ): ElementBuffer<ElementBufferType.UNSIGNED_INT> {
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        return new ElementBuffer(
            dev.gl,
            arr,
            ElementBufferType.UNSIGNED_INT,
            primitive,
        );
    }

    readonly type: T;
    readonly primitive: Primitive;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: Uint16Array | Uint32Array;

    private constructor(
        gl: WebGL2RenderingContext,
        data: Uint16Array | Uint32Array,
        type: T,
        primitive: Primitive,
    ) {
        this.gl = gl;
        this.data = data;
        this.type = type;
        this.primitive = primitive;
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
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
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
}
