import * as assert from "./assert";
import { Device } from "./device";

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
    type: VertexBufferType.BYTE;
    data: number[] | Int8Array;
}

export interface VertexBufferInt16Props {
    type: VertexBufferType.SHORT;
    data: number[] | Int16Array;
}

export interface VertexBufferInt32Props {
    type: VertexBufferType.INT;
    data: number[] | Int32Array;
}

export interface VertexBufferUint8Props {
    type: VertexBufferType.UNSIGNED_BYTE;
    data: number[] | Uint8Array | Uint8ClampedArray;
}

export interface VertexBufferUint16Props {
    type: VertexBufferType.UNSIGNED_SHORT;
    data: number[] | Uint16Array;
}

export interface VertexBufferUint32Props {
    type: VertexBufferType.UNSIGNED_INT;
    data: number[] | Uint32Array;
}

export interface VertexBufferFloat32Props {
    type: VertexBufferType.FLOAT;
    data: number[] | Float32Array;
}

export type VertexBufferTypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Float32Array;

export const enum VertexBufferType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
}

export class VertexBuffer<T extends VertexBufferType = VertexBufferType> {

    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt8Props,
    ): VertexBuffer<VertexBufferType.BYTE>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt16Props,
    ): VertexBuffer<VertexBufferType.SHORT>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferInt32Props,
    ): VertexBuffer<VertexBufferType.INT>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint8Props,
    ): VertexBuffer<VertexBufferType.UNSIGNED_BYTE>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint16Props,
    ): VertexBuffer<VertexBufferType.UNSIGNED_SHORT>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferUint32Props,
    ): VertexBuffer<VertexBufferType.UNSIGNED_INT>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferFloat32Props,
    ): VertexBuffer<VertexBufferType.FLOAT>;
    static create(
        dev: WebGL2RenderingContext | Device,
        props: VertexBufferProps,
    ): VertexBuffer<VertexBufferType> {
        const gl = dev instanceof Device ? dev.gl : dev;
        switch (props.type) {
            case VertexBufferType.BYTE:
                return VertexBuffer.fromInt8Array(gl, props.data);
            case VertexBufferType.SHORT:
                return VertexBuffer.fromInt16Array(gl, props.data);
            case VertexBufferType.INT:
                return VertexBuffer.fromInt32Array(gl, props.data);
            case VertexBufferType.UNSIGNED_BYTE:
                return VertexBuffer.fromUint8Array(gl, props.data);
            case VertexBufferType.UNSIGNED_SHORT:
                return VertexBuffer.fromUint16Array(gl, props.data);
            case VertexBufferType.UNSIGNED_INT:
                return VertexBuffer.fromUint32Array(gl, props.data);
            case VertexBufferType.FLOAT:
                return VertexBuffer.fromFloat32Array(gl, props.data);
            default: return assert.never(props);
        }
    }

    static fromInt8Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int8Array,
    ): VertexBuffer<VertexBufferType.BYTE> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.BYTE,
            data instanceof Int8Array ? data : new Int8Array(data),
        );
    }

    static fromInt16Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int16Array,
    ): VertexBuffer<VertexBufferType.SHORT> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.SHORT,
            data instanceof Int16Array ? data : new Int16Array(data),
        );
    }

    static fromInt32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Int32Array,
    ): VertexBuffer<VertexBufferType.INT> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.INT,
            data instanceof Int32Array ? data : new Int32Array(data),
        );
    }

    static fromUint8Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint8Array | Uint8ClampedArray,
    ): VertexBuffer<VertexBufferType.UNSIGNED_BYTE> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.UNSIGNED_BYTE,
            // Note: we also have to convert Uint8ClampedArray to Uint8Array
            // because of webgl bug
            // https://github.com/KhronosGroup/WebGL/issues/1533
            data instanceof Uint8Array ? data : new Uint8Array(data),
        );
    }

    static fromUint16Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint16Array,
    ): VertexBuffer<VertexBufferType.UNSIGNED_SHORT> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.UNSIGNED_SHORT,
            data instanceof Uint16Array ? data : new Uint16Array(data),
        );
    }

    static fromUint32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Uint32Array,
    ): VertexBuffer<VertexBufferType.UNSIGNED_INT> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.UNSIGNED_INT,
            data instanceof Uint32Array ? data : new Uint32Array(data),
        );
    }

    static fromFloat32Array(
        dev: WebGL2RenderingContext | Device,
        data: number[] | Float32Array,
    ): VertexBuffer<VertexBufferType.FLOAT> {
        const gl = dev instanceof Device ? dev.gl : dev;
        return new VertexBuffer(
            gl,
            VertexBufferType.FLOAT,
            data instanceof Float32Array ? data : new Float32Array(data),
        );
    }

    readonly type: T;

    readonly glBuffer: WebGLBuffer | null;

    private gl: WebGL2RenderingContext;
    private data: VertexBufferTypedArray;

    private constructor(
        gl: WebGL2RenderingContext,
        type: T,
        data: VertexBufferTypedArray,
    ) {
        this.gl = gl;
        this.type = type;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }
}
