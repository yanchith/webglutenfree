import * as array from "./array";
import * as glutil from "./glutil";

export type ElementBufferProps =
    | ElementBufferArrayProps
    | ElementBufferObjectProps
    ;

export interface ElementBufferObjectProps {
    primitive: ElementPrimitive;
    data: number[] | Uint32Array;
}

export type ElementBufferArrayProps = [number, number, number][];
export type ElementPrimitive = "triangles";

export class ElementBuffer {

    static fromProps(
        gl: WebGL2RenderingContext,
        props: ElementBufferProps,
    ): ElementBuffer {
        if (Array.isArray(props)) {
            return ElementBuffer.fromArray(gl, props);
        }
        return ElementBuffer.fromUint32Array(gl, props.data, props.primitive);
    }

    static fromArray(
        gl: WebGL2RenderingContext,
        arr: ElementBufferArrayProps,
    ): ElementBuffer {
        const data = array.ravel(arr).data;
        return new ElementBuffer(gl, new Uint32Array(data), "triangles");
    }

    static fromUint32Array(
        gl: WebGL2RenderingContext,
        buffer: number[] | Uint32Array,
        primitive: ElementPrimitive,
    ): ElementBuffer {
        return new ElementBuffer(
            gl,
            Array.isArray(buffer) ? new Uint32Array(buffer) : buffer,
            primitive,
        );
    }

    readonly glBuffer: WebGLBuffer;
    readonly count: number;
    readonly primitive: ElementPrimitive;

    private constructor(
        gl: WebGL2RenderingContext,
        buffer: Uint32Array,
        primitive: ElementPrimitive,
    ) {
        this.glBuffer = glutil.createElementArrayBuffer(gl, buffer);
        this.count = buffer.length;
        this.primitive = primitive;
    }
}