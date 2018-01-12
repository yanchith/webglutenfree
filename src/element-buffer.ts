import * as assert from "./assert";
import * as array from "./array";
import { Device } from "./device";

export type ElementBufferProps =
    | ElementBufferArrayProps
    | ElementBufferObjectProps
    ;

export interface ElementBufferObjectProps {
    type: ElementBufferType;
    data: number[] | Uint32Array;
    primitive: Primitive;
}

export type ElementBufferArrayProps =
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

export const enum ElementBufferType {
    // Should we enable this?
    // UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405,
}

export const enum Primitive {
    POINTS = 0x0000,
    LINES = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLES = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006,
}


export class ElementBuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        props: ElementBufferProps,
    ): ElementBuffer {
        return Array.isArray(props)
            ? ElementBuffer.fromArray(dev, props)
            : ElementBuffer.fromUint32Array(dev, props.data, props.primitive);
    }

    static fromArray(
        dev: WebGL2RenderingContext | Device,
        data: ElementBufferArrayProps,
    ) {
        if (array.isArray2(data)) {
            const s = array.shape2(data);
            assert.range(s[1], 2, 3, "element tuple length");
            const r = array.ravel2(data, s);
            const prim = s[1] === 3 ? Primitive.TRIANGLES : Primitive.LINES;
            return ElementBuffer.fromUint32Array(dev, r, prim);
        }
        return ElementBuffer.fromUint32Array(dev, data, Primitive.POINTS);
    }

    static fromUint16Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint16Array,
        primitive: Primitive,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint16Array(data) : data;
        return new ElementBuffer(
            gl,
            arr,
            ElementBufferType.UNSIGNED_SHORT,
            primitive,
        );
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint32Array,
        primitive: Primitive,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        return new ElementBuffer(
            gl,
            arr,
            ElementBufferType.UNSIGNED_INT,
            primitive,
        );
    }

    readonly type: ElementBufferType;
    readonly primitive: Primitive;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: Uint16Array | Uint32Array;

    private constructor(
        gl: WebGL2RenderingContext,
        data: Uint16Array | Uint32Array,
        type: ElementBufferType,
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

    init(): void {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }
}
