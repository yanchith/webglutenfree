import * as assert from "./assert";
import * as array from "./array";
import { Device } from "./device";

export type ElementBufferProps =
    | ElementBufferArrayProps
    | ElementBufferObjectProps
    ;

export interface ElementBufferObjectProps {
    type: "u32";
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

export const enum Primitive {
    TRIANGLES = "triangles",
    TRIANGLE_STRIP = "triangle-strip",
    TRIANGLE_FAN = "triangle-fan",
    POINTS = "points",
    LINES = "lines",
    LINE_STRIP = "line-strip",
    LINE_LOOP = "line-loop",
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
            assert.paramRange(s[1], 2, 3, "element tuple length");
            const r = array.ravel2(data, s);
            const prim = s[1] === 3 ? Primitive.TRIANGLES : Primitive.LINES;
            return ElementBuffer.fromUint32Array(dev, r, prim);
        }
        return ElementBuffer.fromUint32Array(dev, data, Primitive.POINTS);
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint32Array,
        primitive: Primitive,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        return new ElementBuffer(gl, arr, primitive);
    }

    readonly primitive: Primitive;

    readonly glBuffer: WebGLBuffer | null;
    readonly glPrimitive: number;

    private gl: WebGL2RenderingContext;
    private data: Uint32Array;

    private constructor(
        gl: WebGL2RenderingContext,
        data: Uint32Array,
        primitive: Primitive,
    ) {
        this.gl = gl;
        this.data = data;
        this.primitive = primitive;
        this.glPrimitive = mapGlPrimitive(gl, primitive);
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

export function mapGlPrimitive(
    gl: WebGL2RenderingContext,
    primitive: Primitive,
): number {
    switch (primitive) {
        case Primitive.TRIANGLES: return gl.TRIANGLES;
        case Primitive.TRIANGLE_STRIP: return gl.TRIANGLE_STRIP;
        case Primitive.TRIANGLE_FAN: return gl.TRIANGLE_FAN;
        case Primitive.POINTS: return gl.POINTS;
        case Primitive.LINES: return gl.LINES;
        case Primitive.LINE_STRIP: return gl.LINE_STRIP;
        case Primitive.LINE_LOOP: return gl.LINE_LOOP;
        default: return assert.never(
            primitive,
            `Unknown primitive: ${primitive}`,
        );
    }
}
