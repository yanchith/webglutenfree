/// <reference types="webgl2" />
import { Primitive, DataType } from "./types";
import { State } from "./state";
import { VertexBuffer, VertexBufferType } from "./vertex-buffer";
import { ElementBuffer, ElementBufferType, ElementArray } from "./element-buffer";
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
export declare type VertexBufferIntegerType = DataType.BYTE | DataType.SHORT | DataType.INT | DataType.UNSIGNED_BYTE | DataType.UNSIGNED_SHORT | DataType.UNSIGNED_INT;
export interface AttributePointerConfig {
    type: AttributeType.POINTER;
    buffer: VertexBuffer<VertexBufferType> | number[];
    count: number;
    size: number;
    normalized?: boolean;
    divisor?: number;
}
export interface AttributeIPointerConfig {
    type: AttributeType.IPOINTER;
    buffer: VertexBuffer<VertexBufferIntegerType>;
    count: number;
    size: number;
    divisor?: number;
}
export interface AttributesCreateOptions {
    countLimit?: number;
}
export declare function _createAttributes(state: State, elements: Primitive | ElementArray | ElementBuffer<ElementBufferType>, attributes: AttributesConfig, { countLimit }?: AttributesCreateOptions): Attributes;
/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
export declare class Attributes {
    readonly primitive: Primitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;
    readonly glVertexArray: WebGLVertexArrayObject | null;
    private state;
    private attributes;
    private elementBuffer?;
    constructor(state: State, primitive: Primitive, attributes: AttributeDescriptor[], count: number, instanceCount: number, elements?: ElementBuffer<ElementBufferType> | undefined);
    readonly indexed: boolean;
    readonly indexType: ElementBufferType | undefined;
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
    readonly buffer: VertexBuffer<VertexBufferType>;
    readonly count: number;
    readonly size: number;
    readonly normalized: boolean;
    readonly divisor: number;
    constructor(location: number, type: AttributeType, buffer: VertexBuffer<VertexBufferType>, count: number, size: number, normalized: boolean, divisor: number);
}
export {};
//# sourceMappingURL=attributes.d.ts.map