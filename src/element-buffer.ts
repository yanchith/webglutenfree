import * as array from "./array";
import * as glutil from "./glutil";
import { Device } from "./device";

export type ElementBufferProps =
    | ElementBufferArrayProps
    | ElementBufferObjectProps
    ;

export interface ElementBufferObjectProps {
    data: number[] | Uint32Array;
}

export type ElementBufferArrayProps = [number, number, number][];

export class ElementBuffer {

    static create(
        dev: WebGL2RenderingContext | Device,
        props: ElementBufferProps,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        if (Array.isArray(props)) {
            return ElementBuffer.fromArray(gl, props);
        }
        return ElementBuffer.fromUint32Array(gl, props.data);
    }

    static fromArray(
        dev: WebGL2RenderingContext | Device,
        arr: ElementBufferArrayProps,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        const data = array.ravel(arr).data;
        return new ElementBuffer(gl, new Uint32Array(data));
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        buffer: number[] | Uint32Array,
    ): ElementBuffer {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new ElementBuffer(
            gl,
            Array.isArray(buffer) ? new Uint32Array(buffer) : buffer,
        );
    }

    readonly glBuffer: WebGLBuffer;
    readonly count: number;

    private constructor(
        gl: WebGL2RenderingContext,
        buffer: Uint32Array,
    ) {
        this.glBuffer = glutil.createElementArrayBuffer(gl, buffer);
        this.count = buffer.length;
    }
}
