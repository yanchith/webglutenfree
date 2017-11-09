/// <reference types="webgl2" />
export declare type VertexBufferType = VertexBufferProps["type"];
export declare type VertexBufferProps = VertexBufferInt8Props | VertexBufferInt16Props | VertexBufferInt32Props | VertexBufferUint8Props | VertexBufferUint16Props | VertexBufferUint32Props | VertexBufferFloat32Props;
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
export declare class VertexBuffer<T extends VertexBufferType = VertexBufferType> {
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferInt8Props): VertexBuffer<"i8">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferInt16Props): VertexBuffer<"i16">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferInt32Props): VertexBuffer<"i32">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferUint8Props): VertexBuffer<"u8">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferUint16Props): VertexBuffer<"u16">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferUint32Props): VertexBuffer<"u32">;
    static fromProps(gl: WebGL2RenderingContext, props: VertexBufferFloat32Props): VertexBuffer<"f32">;
    static fromInt8Array(gl: WebGL2RenderingContext, data: number[] | Int8Array): VertexBuffer<"i8">;
    static fromInt16Array(gl: WebGL2RenderingContext, data: number[] | Int16Array): VertexBuffer<"i16">;
    static fromInt32Array(gl: WebGL2RenderingContext, data: number[] | Int32Array): VertexBuffer<"i32">;
    static fromUint8Array(gl: WebGL2RenderingContext, data: number[] | Uint8Array | Uint8ClampedArray): VertexBuffer<"u8">;
    static fromUint16Array(gl: WebGL2RenderingContext, data: number[] | Uint16Array): VertexBuffer<"u16">;
    static fromUint32Array(gl: WebGL2RenderingContext, data: number[] | Uint32Array): VertexBuffer<"u32">;
    static fromFloat32Array(gl: WebGL2RenderingContext, data: number[] | Float32Array): VertexBuffer<"f32">;
    readonly gl: WebGL2RenderingContext;
    readonly type: T;
    readonly glType: number;
    readonly glBuffer: WebGLBuffer;
    private constructor();
}
