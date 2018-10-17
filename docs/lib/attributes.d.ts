/// <reference types="webgl2" />
import { State } from "./state";
import { VertexBuffer, VertexBufferDataType, VertexBufferIntegerDataType } from "./vertex-buffer";
import { ElementBuffer, ElementArray, ElementBufferDataType, ElementPrimitive } from "./element-buffer";
/**
 * Attribute type for reading vertex buffers. POINTER provides normalization
 * options for converting integer values to floats. IPOINTER always retains
 * integers types.
 */
export declare enum AttributeType {
    POINTER = "pointer",
    IPOINTER = "ipointer"
}
export interface AttributesConfig {
    [name: string]: AttributeConfig;
    [location: number]: AttributeConfig;
}
export declare type AttributeConfig = AttributeArrayConfig | AttributeObjectConfig;
export declare type AttributeArrayConfig = number[] | [number, number][] | [number, number, number][] | [number, number, number, number][] | number[][];
export declare type AttributeObjectConfig = AttributePointerConfig | AttributeIPointerConfig;
export interface AttributePointerConfig {
    type: AttributeType.POINTER;
    buffer: VertexBuffer<VertexBufferDataType>;
    count: number;
    size: number;
    normalized?: boolean;
    divisor?: number;
}
export interface AttributeIPointerConfig {
    type: AttributeType.IPOINTER;
    buffer: VertexBuffer<VertexBufferIntegerDataType>;
    count: number;
    size: number;
    divisor?: number;
}
export interface AttributesCreateOptions {
    countLimit?: number;
}
export declare function _createAttributes(state: State, elements: ElementPrimitive | ElementArray | ElementBuffer<ElementBufferDataType>, attributes: AttributesConfig, { countLimit }?: AttributesCreateOptions): Attributes;
/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
export declare class Attributes {
    readonly primitive: ElementPrimitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;
    readonly glVertexArray: WebGLVertexArrayObject | null;
    private state;
    private attributes;
    private elementBuffer?;
    constructor(state: State, primitive: ElementPrimitive, attributes: AttributeDescriptor[], count: number, instanceCount: number, elements?: ElementBuffer<ElementBufferDataType> | undefined);
    readonly indexed: boolean;
    readonly indexType: ElementBufferDataType | undefined;
    /**
     * Reinitialize invalid vertex array, eg. after context is lost. Also tries
     * to reinitialize vertex buffer and element buffer dependencies.
     */
    restore(): void;
    private init;
    private hasAttribs;
}
declare class AttributeDescriptor {
    readonly location: number;
    readonly type: AttributeType;
    readonly buffer: VertexBuffer<VertexBufferDataType>;
    readonly count: number;
    readonly size: number;
    readonly normalized: boolean;
    readonly divisor: number;
    constructor(location: number, type: AttributeType, buffer: VertexBuffer<VertexBufferDataType>, count: number, size: number, normalized: boolean, divisor: number);
}
export {};
//# sourceMappingURL=attributes.d.ts.map