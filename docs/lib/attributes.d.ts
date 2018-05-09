/// <reference types="webgl2" />
import { Primitive, DataType } from "./types";
import { VertexBuffer, VertexBufferType } from "./vertex-buffer";
import { ElementBuffer, ElementBufferType, ElementArray } from "./element-buffer";
export declare type Device = import("./device").Device;
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
/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
export declare class Attributes {
    /**
     * Create new attributes with element and attribute definitions, and an
     * optional count limit.
     *
     * Element definitions can either be a primitive definition, reference an
     * existing element buffer, or have enough information to create an element
     * buffer.
     *
     * Attribute definitions can either reference an existing vertex buffer,
     * or have enough information to create a vertex buffer.
     *
     * Empty attribute definitions are valid. If no attributes nor elements
     * given, there will be no underlying vertex array object created, only the
     * count will be given to gl.drawArrays()
     */
    static create(dev: Device, elements: Primitive | ElementArray | ElementBuffer<ElementBufferType>, attributes: AttributesConfig, { countLimit }?: AttributesCreateOptions): Attributes;
    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    static empty(dev: Device, primitive: Primitive, count: number): Attributes;
    readonly primitive: Primitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;
    readonly glVertexArray: WebGLVertexArrayObject | null;
    private dev;
    private attributes;
    private elementBuffer?;
    private constructor();
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
