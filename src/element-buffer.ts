import * as array from "./array";
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
    | [number][]
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
        return new ElementBuffer(gl, arr);
    }

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: Uint32Array;

    private constructor(gl: WebGL2RenderingContext, data: Uint32Array) {
        this.gl = gl;
        this.data = data;
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
