import * as array from "./array";
import * as glutil from "./glutil";
import { Device } from "./device";

export type ElementBufferProps =
    | ElementBufferArrayProps
    | ElementBufferObjectProps
    ;

export interface ElementBufferObjectProps {
    type: "u32";
    data: number[] | Uint32Array;
}

export type ElementBufferArrayProps =
    | number[]
    | [number, number][]
    | [number, number, number][]
    ;

export class ElementBuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        props: ElementBufferProps,
    ): ElementBuffer {
        return Array.isArray(props)
            ? ElementBuffer.fromArray(dev, props)
            : ElementBuffer.fromUint32Array(dev, props.data);
    }

    static fromArray(
        dev: WebGL2RenderingContext | Device,
        data: ElementBufferArrayProps,
    ) {
        return ElementBuffer.fromUint32Array(
            dev,
            array.is2DArray(data)
                ? array.ravel(data).data
                : data,
        );
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint32Array,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const arr = Array.isArray(data) ? new Uint32Array(data) : data;
        const buffer = glutil.createElementArrayBuffer(gl, arr);
        return new ElementBuffer(buffer, arr.length);
    }

    private constructor(
        readonly glBuffer: WebGLBuffer,
        readonly count: number,
    ) { }
}
