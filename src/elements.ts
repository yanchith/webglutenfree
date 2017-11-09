import * as array from "./array";
import * as glutil from "./glutil";

export type ElementsProps =
    | ElementsArrayProps
    | ElementsObjectProps
    ;

export interface ElementsObjectProps {
    primitive: ElementPrimitive;
    data: number[] | Uint32Array;
}

export type ElementsArrayProps = [number, number, number][];
export type ElementPrimitive = "triangles";

export class Elements {

    static fromProps(
        gl: WebGL2RenderingContext,
        props: ElementsProps,
    ): Elements {
        if (Array.isArray(props)) {
            return Elements.fromArray(gl, props);
        }
        return Elements.fromUint32Array(gl, props.data, props.primitive);
    }

    static fromArray(
        gl: WebGL2RenderingContext,
        arr: ElementsArrayProps,
    ): Elements {
        const data = array.ravel(arr).data;
        return new Elements(gl, new Uint32Array(data), "triangles");
    }

    static fromUint32Array(
        gl: WebGL2RenderingContext,
        buffer: number[] | Uint32Array,
        primitive: ElementPrimitive,
    ): Elements {
        return new Elements(
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
