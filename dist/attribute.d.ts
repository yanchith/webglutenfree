/// <reference types="webgl2" />
import { VertexBuffer, VertexBufferProps, VertexBufferInt8Props, VertexBufferInt16Props, VertexBufferInt32Props, VertexBufferUint8Props, VertexBufferUint16Props, VertexBufferUint32Props } from "./vertex-buffer";
export declare type AttributeType = "pointer" | "ipointer";
export declare type AttributeProps = AttributeArrayProps | AttributeObjectProps;
export declare type AttributeArrayProps = number[] | [number, number][] | [number, number, number][] | [number, number, number, number][];
export declare type AttributeObjectProps = AttributePointerProps | AttributeIPointerProps;
export interface AttributePointerProps {
    type: "pointer";
    value: VertexBuffer | PointerValueProps;
    count: number;
    size: number;
    normalized?: boolean;
    divisor?: number;
}
export interface AttributeIPointerProps {
    type: "ipointer";
    value: VertexBuffer<IPointerValueType> | IPointerValueProps;
    count: number;
    size: number;
    divisor?: number;
}
export declare type PointerValueProps = VertexBufferProps;
export declare type IPointerValueProps = VertexBufferInt8Props | VertexBufferInt16Props | VertexBufferInt32Props | VertexBufferUint8Props | VertexBufferUint16Props | VertexBufferUint32Props;
export declare type IPointerValueType = IPointerValueProps["type"];
export declare class Attribute {
    static fromProps(gl: WebGL2RenderingContext, props: AttributeProps): Attribute;
    static fromArray(gl: WebGL2RenderingContext, arr: AttributeArrayProps): Attribute;
    static fromPointer(gl: WebGL2RenderingContext, buffer: VertexBuffer | PointerValueProps, count: number, size: number, normalized?: boolean, divisor?: number): Attribute;
    static fromIPointer(gl: WebGL2RenderingContext, buffer: VertexBuffer<IPointerValueType> | IPointerValueProps, count: number, size: number, divisor?: number): Attribute;
    readonly type: AttributeType;
    readonly buffer: VertexBuffer;
    readonly count: number;
    readonly size: number;
    readonly normalized: boolean;
    readonly divisor: number;
    private constructor();
}
