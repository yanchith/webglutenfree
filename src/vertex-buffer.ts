import { Device } from "./device";

type VertexBufferTypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Float32Array;

/**
 * Possible data types of vertex buffers.
 */
export enum VertexBufferType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
}

/**
 * Vertex buffers contain GPU accessible data. Accessing them is usually done
 * via setting up an attribute that reads the buffer.
 */
export class VertexBuffer<T extends VertexBufferType> {

    /**
     * Create a new vertex buffer from bytes.
     */
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

    /**
     * Create a new vertex buffer from short ints.
     */
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

    /**
     * Create a new vertex buffer from ints.
     */
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

    /**
     * Create a new vertex buffer from unsigned bytes.
     */
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

    /**
     * Create a new vertex buffer from unsigned short ints.
     */
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

    /**
     * Create a new vertex buffer from unsigned ints.
     */
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

    /**
     * Create a new vertex buffer from floats.
     */
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

    /**
     * Force buffer reinitialization.
     */
    init(): void {
        const { gl, data } = this;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        (this as any).glBuffer = buffer;
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { gl, glBuffer } = this;
        if (!gl.isBuffer(glBuffer)) { this.init(); }
    }
}
