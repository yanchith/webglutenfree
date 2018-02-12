import * as assert from "./util/assert";
import * as array from "./util/array";
import { Device } from "./device";
import { Primitive, DataType } from "./types";
import { VertexBuffer, VertexBufferType } from "./vertex-buffer";
import {
    ElementBuffer,
    ElementBufferType,
    ElementArray,
} from "./element-buffer";

const INT_PATTERN = /^0|[1-9]\d*$/;


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

/**
 * Vertex array objects store store vertex buffers, an index buffer,
 * and attributes with the vertex format for provided vertex buffers.
 */
export class Attributes {

    /**
     * Create empty attributes of a given primitive. This actually performs no
     * gl calls, only remembers the count for `gl.drawArrays()`
     */
    static create(
        dev: Device,
        primitive: Primitive,
        count: number,
    ): Attributes {
        const gl = dev.gl;
        return new Attributes(gl, primitive, [], count, 0);
    }

    /**
     * Create new attributes with primitive and attribute definitions.
     * Attribute definitions can either reference an existing vertex buffer,
     * or have enough information to create a vertex buffer.
     */
    static withBuffers(
        dev: Device,
        primitive: Primitive,
        attributes: AttributesConfig,
    ): Attributes {
        const gl = dev.gl;
        const attrs = Object.entries(attributes)
            .map(([locationStr, definition]) => {
                if (!INT_PATTERN.test(locationStr)) {
                    throw new Error("Location not a number. Use Command#locate");
                }
                const location = parseInt(locationStr, 10);
                return AttributeDescriptor.create(dev, location, definition);
            });

        const count = attrs.length
            ? attrs
                .map(attr => attr.count)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        const instAttrs = attrs.filter(attr => !!attr.divisor);
        const instanceCount = instAttrs.length
            ? instAttrs
                .map(attr => attr.count * attr.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        return new Attributes(gl, primitive, attrs, count, instanceCount);
    }

    /**
     * Create new attributes with element and attribute definitions.
     * Attribute definitions can either reference an existing vertex buffer,
     * or have enough information to create a vertex buffer.
     * Element definitions can either reference an existing element buffer,
     * or have enough information to create an element buffer.
     */
    static withIndexedBuffers(
        dev: Device,
        elements: ElementArray | ElementBuffer<ElementBufferType>,
        attributes: AttributesConfig,
    ): Attributes {
        const gl = dev.gl;
        const attrs = Object.entries(attributes)
            .map(([locationStr, definition]) => {
                if (!INT_PATTERN.test(locationStr)) {
                    throw new Error("Location not a number. Use Command#locate");
                }
                const location = parseInt(locationStr, 10);
                return AttributeDescriptor.create(dev, location, definition);
            });

        const elementBuffer = elements && (elements instanceof ElementBuffer
            ? elements
            : ElementBuffer.withArray(dev, elements));

        const count = elementBuffer
            ? elementBuffer.length
            : attrs.length
                ? attrs
                    .map(attr => attr.count)
                    .reduce((min, curr) => Math.min(min, curr))
                : 0;

        const instAttrs = attrs.filter(attr => !!attr.divisor);
        const instanceCount = instAttrs.length
            ? instAttrs
                .map(attr => attr.count * attr.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        return new Attributes(
            gl,
            elementBuffer.primitive,
            attrs,
            count,
            instanceCount,
            elementBuffer,
        );
    }

    readonly primitive: Primitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;

    readonly glVertexArray: WebGLVertexArrayObject | null;

    private gl: WebGL2RenderingContext;

    // The buffers
    private attributes: AttributeDescriptor[];
    private elementBuffer?: ElementBuffer<ElementBufferType>;

    private constructor(
        gl: WebGL2RenderingContext,
        primitive: Primitive,
        attributes: AttributeDescriptor[],
        count: number,
        instanceCount: number,
        elements?: ElementBuffer<ElementBufferType> | undefined,
    ) {
        this.gl = gl;
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
     * Force vertex array reinitialization.
     */
    init(): void {
        // Do not create the gl vao if there are no buffers to bind
        if (this.isEmpty()) { return; }

        const { gl, attributes, elementBuffer } = this;
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
                default: assert.never(type);
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

    /**
     * Reinitialize invalid vertex array, eg. after context is lost. Also tries
     * to reinitialize vertex buffer and element buffer dependencies.
     */
    restore(): void {
        const { gl, glVertexArray, attributes, elementBuffer } = this;
        if (elementBuffer) { elementBuffer.restore(); }
        attributes.forEach(attr => attr.buffer.restore());
        // If we have no attributes nor elements, there is no need to restore
        // any GPU state
        if (!this.isEmpty() && !gl.isVertexArray(glVertexArray)) {
            this.init();
        }
    }

    private isEmpty(): boolean {
        // IF we have either attributes or elements, this geometry can not
        // longer be considered empty.
        return !this.elementBuffer && !this.attributes.length;
    }
}

// TODO: this could use some further refactoring. Currently its just former
// public API made private.
class AttributeDescriptor {

    static create(
        dev: Device,
        location: number,
        props: AttributeConfig,
    ): AttributeDescriptor {
        if (Array.isArray(props)) {
            if (array.isArray2(props)) {
                const s = array.shape2(props);
                const r = array.ravel2(props, s);
                return new AttributeDescriptor(
                    location,
                    AttributeType.POINTER,
                    VertexBuffer.withTypedArray(dev, DataType.FLOAT, r),
                    s[0],
                    s[1],
                    false,
                    0,
                );
            }
            return new AttributeDescriptor(
                location,
                AttributeType.POINTER,
                VertexBuffer.withTypedArray(dev, DataType.FLOAT, props),
                props.length,
                1,
                false,
                0,
            );
        }

        return new AttributeDescriptor(
            location,
            props.type,
            Array.isArray(props.buffer)
                ? VertexBuffer.withTypedArray(
                    dev,
                    DataType.FLOAT,
                    props.buffer,
                )
                : props.buffer,
            props.count,
            props.size,
            props.type === AttributeType.POINTER
                ? (props.normalized || false)
                : false,
            props.divisor || 0,
        );
    }

    private constructor(
        readonly location: number,
        readonly type: AttributeType,
        readonly buffer: VertexBuffer<VertexBufferType>,
        readonly count: number,
        readonly size: number,
        readonly normalized: boolean,
        readonly divisor: number,
    ) { }
}
