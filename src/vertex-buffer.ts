import * as assert from "./assert";
import { Device } from "./device";

export type VertexBufferType = VertexBufferProps["type"];

export type VertexBufferProps =
    | VertexBufferInt8Props
    | VertexBufferInt16Props
    | VertexBufferInt32Props
    | VertexBufferUint8Props
    | VertexBufferUint16Props
    | VertexBufferUint32Props
    | VertexBufferFloat32Props
    ;

export interface VertexBufferInt8Props {
    type: "i8";
    data: number[] | Int8Array;
}

export interface VertexBufferInt16Props {
    type: "i16";
    data: number[] | Int16Array;
}

export interface VertexBufferInt32Props {
    type: "i32";
    data: number[] | Int32Array;
}

export interface VertexBufferUint8Props {
    type: "u8";
    data: number[] | Uint8Array | Uint8ClampedArray;
}

export interface VertexBufferUint16Props {
    type: "u16";
    data: number[] | Uint16Array;
}

export interface VertexBufferUint32Props {
    type: "u32";
    data: number[] | Uint32Array;
}

export interface VertexBufferFloat32Props {
    type: "f32";
    data: number[] | Float32Array;
}

export class VertexBuffer<T extends VertexBufferType = VertexBufferType> {

    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt8Props,
    ): VertexBuffer<"i8">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt16Props,
    ): VertexBuffer<"i16">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt32Props,
    ): VertexBuffer<"i32">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint8Props,
    ): VertexBuffer<"u8">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint16Props,
    ): VertexBuffer<"u16">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint32Props,
    ): VertexBuffer<"u32">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferFloat32Props,
    ): VertexBuffer<"f32">;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferProps,
    ): VertexBuffer<VertexBufferProps["type"]> {
        const gl = dev instanceof Device ? dev.gl : dev;
        switch (props.type) {
            case "i8": return VertexBuffer.fromInt8Array(gl, props.data);
            case "i16": return VertexBuffer.fromInt16Array(gl, props.data);
            case "i32": return VertexBuffer.fromInt32Array(gl, props.data);
            case "u8": return VertexBuffer.fromUint8Array(gl, props.data);
            case "u16": return VertexBuffer.fromUint16Array(gl, props.data);
            case "u32": return VertexBuffer.fromUint32Array(gl, props.data);
            case "f32": return VertexBuffer.fromFloat32Array(gl, props.data);
            default: return assert.never(props);
        }
    }

    static fromInt8Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int8Array,
    ): VertexBuffer<"i8"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "i8",
            data instanceof Int8Array ? data : new Int8Array(data),
            gl.BYTE,
        );
    }

    static fromInt16Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int16Array,
    ): VertexBuffer<"i16"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "i16",
            data instanceof Int16Array ? data : new Int16Array(data),
            gl.SHORT,
        );
    }

    static fromInt32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int32Array,
    ): VertexBuffer<"i32"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "i32",
            data instanceof Int32Array ? data : new Int32Array(data),
            gl.INT,
        );
    }

    static fromUint8Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint8Array | Uint8ClampedArray,
    ): VertexBuffer<"u8"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "u8",
            // Note: we also have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            data instanceof Uint8Array ? data : new Uint8Array(data),
            gl.UNSIGNED_BYTE,
        );
    }

    static fromUint16Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint16Array,
    ): VertexBuffer<"u16"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "u16",
            data instanceof Uint16Array ? data : new Uint16Array(data),
            gl.UNSIGNED_SHORT,
        );
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint32Array,
    ): VertexBuffer<"u32"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "u32",
            data instanceof Uint32Array ? data : new Uint32Array(data),
            gl.UNSIGNED_INT,
        );
    }

    static fromFloat32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array,
    ): VertexBuffer<"f32"> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            "f32",
            data instanceof Float32Array ? data : new Float32Array(data),
            gl.FLOAT,
        );
    }

    readonly gl: WebGL2RenderingContext;
    readonly type: T;
    readonly data: ArrayBuffer | ArrayBufferView;
    readonly glType: number;
    readonly glBuffer: WebGLBuffer | null;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        data: ArrayBuffer | ArrayBufferView,
        glType: number,
    ) {
        this.gl = gl;
        this.type = type;
        this.data = data;
        this.glType = glType;
        this.glBuffer = null;

        this.init();
    }

    init(): void {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        if (buffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            (this as any).glBuffer = buffer;
        }
    }

    restore(): void {
        if (!this.glBuffer) { this.init(); }
    }
}
