/// <reference types="webgl2" />
import { VertexBuffer, VertexBufferProps, VertexBufferInt8Props, VertexBufferInt16Props, VertexBufferInt32Props, VertexBufferUint8Props, VertexBufferUint16Props, VertexBufferUint32Props } from "./vertex-buffer";
import { ElementBuffer, ElementBufferProps, ElementPrimitive } from "./element-buffer";
export declare type AttributeType = "pointer" | "ipointer";
export declare type Attribute = AttributeArray | AttributeObject;
export declare type AttributeArray = number[] | [number, number][] | [number, number, number][] | [number, number, number, number][];
export declare type AttributeObject = AttributePointer | AttributeIPointer;
export interface AttributePointer {
    type: "pointer";
    value: VertexBuffer | PointerValue;
    count: number;
    size: number;
    normalized?: boolean;
    divisor?: number;
}
export interface AttributeIPointer {
    type: "ipointer";
    value: VertexBuffer<IPointerValue["type"]> | IPointerValue;
    count: number;
    size: number;
    divisor?: number;
}
export declare type PointerValue = VertexBufferProps;
export declare type IPointerValue = VertexBufferInt8Props | VertexBufferInt16Props | VertexBufferInt32Props | VertexBufferUint8Props | VertexBufferUint16Props | VertexBufferUint32Props;
export interface VertexArrayProps {
    attributes: {
        [name: string]: Attribute;
        [location: number]: Attribute;
    };
    elements: ElementBuffer | ElementBufferProps;
}
export declare class VertexArray {
    static fromProps(gl: WebGL2RenderingContext, {attributes, elements}: VertexArrayProps): VertexArray;
    readonly glVertexArrayObject: WebGLVertexArrayObject;
    readonly count: number;
    readonly primitive: ElementPrimitive;
    readonly instanceCount: number;
    private constructor();
}
