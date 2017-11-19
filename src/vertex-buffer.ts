import * as assert from "./assert";
import * as glutil from "./glutil";
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
            gl.BYTE,
            data instanceof Int8Array ? data : new Int8Array(data),
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
            gl.SHORT,
            data instanceof Int16Array ? data : new Int16Array(data),
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
            gl.INT,
            data instanceof Int32Array ? data : new Int32Array(data),
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
            gl.UNSIGNED_BYTE,
            // Note: we also have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            data instanceof Uint8Array ? data : new Uint8Array(data),
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
            gl.UNSIGNED_SHORT,
            data instanceof Uint16Array ? data : new Uint16Array(data),
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
            gl.UNSIGNED_INT,
            data instanceof Uint32Array ? data : new Uint32Array(data),
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
            gl.FLOAT,
            data instanceof Float32Array ? data : new Float32Array(data),
        );
    }

    readonly gl: WebGL2RenderingContext;
    readonly type: T;
    readonly glType: number;
    readonly glBuffer: WebGLBuffer;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        glType: number,
        data: ArrayBuffer | ArrayBufferView,
    ) {
        this.gl = gl;
        this.type = type;
        this.glType = glType;
        this.glBuffer = glutil.createArrayBuffer(gl, data);
    }
}
