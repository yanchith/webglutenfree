import * as assert from "./util/assert";
import { Primitive, DataType } from "./types";
import { State } from "./state";
import { VertexBuffer, VertexBufferType } from "./vertex-buffer";
import { ElementBuffer, ElementBufferType } from "./element-buffer";


/**
 * Attribute type for reading vertex buffers. POINTER provides normalization
 * options for converting integer values to floats. IPOINTER always retains
 * integers types.
 */
export enum AttributeType {
    POINTER = "pointer",
    IPOINTER = "ipointer",
}

export interface AttributesConfig {
    [name: string]: AttributeConfig;
    [location: number]: AttributeConfig;
}

export type AttributeConfig =
    | AttributeArrayConfig
    | AttributeObjectConfig
    ;

export type AttributeArrayConfig =
    | number[] // infers size 1
    | [number, number][] // infers size 2
    | [number, number, number][] // infers size 3
    | [number, number, number, number][] // infers size 4
    /*
    Unfortunately, typescript does not always infer tuple types when in
    nested optional structutes, so we provide a number[][] typing fallback.
    If explicit tuples make it to typescript, the fallback might go away.
    */
    | number[][]
    ;

export type AttributeObjectConfig =
    | AttributePointerConfig
    | AttributeIPointerConfig
    ;

export type VertexBufferIntegerType =
    | DataType.BYTE
    | DataType.SHORT
    | DataType.INT
    | DataType.UNSIGNED_BYTE
    | DataType.UNSIGNED_SHORT
    | DataType.UNSIGNED_INT
    ;

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
export class Attributes {

    readonly primitive: Primitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;

    readonly glVertexArray: WebGLVertexArrayObject | null;

    private state: State;

    // The buffers
    private attributes: AttributeDescriptor[];
    private elementBuffer?: ElementBuffer<ElementBufferType>;

    constructor(
        state: State,
        primitive: Primitive,
        attributes: AttributeDescriptor[],
        count: number,
        instanceCount: number,
        elements?: ElementBuffer<ElementBufferType> | undefined,
    ) {
        this.state = state;
        this.primitive = primitive;
        this.elementBuffer = elements;
        this.attributes = attributes;
        this.count = count;
        this.elementCount = elements ? elements.length : 0;
        this.instanceCount = instanceCount;
        this.glVertexArray = null;

        this.init();
    }

    get indexed(): boolean {
        return !!this.elementBuffer;
    }

    get indexType(): ElementBufferType | undefined {
        return this.elementBuffer && this.elementBuffer.type;
    }

    /**
     * Reinitialize invalid vertex array, eg. after context is lost. Also tries
     * to reinitialize vertex buffer and element buffer dependencies.
     */
    restore(): void {
        const { state: { gl }, glVertexArray, attributes, elementBuffer } = this;
        if (elementBuffer) { elementBuffer.restore(); }
        attributes.forEach((attr) => attr.buffer.restore());
        // If we have no attributes nor elements, there is no need to restore
        // any GPU state
        if (this.hasAttribs() && !gl.isVertexArray(glVertexArray)) {
            this.init();
        }
    }

    private init(): void {
        // Do not create the gl vao if there are no buffers to bind
        if (!this.hasAttribs()) { return; }

        const { state: { gl }, attributes, elementBuffer } = this;

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        attributes.forEach(({
            location,
            type,
            buffer: { glBuffer, type: glBufferType },
            size,
            normalized = false,
            divisor,
        }) => {
            // Enable sending attribute arrays for location
            gl.enableVertexAttribArray(location);

            // Send buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
            switch (type) {
                case AttributeType.POINTER:
                    gl.vertexAttribPointer(
                        location,
                        size,
                        glBufferType,
                        normalized,
                        0,
                        0,
                    );
                    break;
                case AttributeType.IPOINTER:
                    gl.vertexAttribIPointer(
                        location,
                        size,
                        glBufferType,
                        0,
                        0,
                    );
                    break;
                default: assert.unreachable(type);
            }
            if (divisor) { gl.vertexAttribDivisor(location, divisor); }
        });

        if (elementBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer.glBuffer);
        }

        gl.bindVertexArray(null);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (elementBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }

        (this as any).glVertexArray = vao;
    }

    private hasAttribs(): boolean {
        // IF we have either attributes or elements, this geometry can not
        // longer be considered empty.
        return !!this.elementBuffer || !!this.attributes.length;
    }
}

export class AttributeDescriptor {
    constructor(
        readonly location: number,
        readonly type: AttributeType,
        readonly buffer: VertexBuffer<VertexBufferType>,
        readonly count: number,
        readonly size: number,
        readonly normalized: boolean,
        readonly divisor: number,
    ) { }
}
