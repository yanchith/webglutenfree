import * as assert from "./util/assert";
import * as array from "./util/array";
import { State } from "./state";
import {
    VertexBuffer,
    VertexBufferDataType,
    VertexBufferIntegerDataType,
    VertexBufferFloatDataType,
    _createVertexBufferWithTypedArray,
} from "./vertex-buffer";
import {
    ElementBuffer,
    ElementArray,
    ElementBufferDataType,
    ElementPrimitive,
    _createElementBuffer,
    _createElementBufferWithArray,
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

export function _createAttributes(
    state: State,
    elements:
        | ElementPrimitive
        | ElementArray
        | ElementBuffer<ElementBufferDataType>,
    attributes: AttributesConfig,
    { countLimit }: AttributesCreateOptions = {},
): Attributes {
    if (typeof countLimit === "number") {
        assert.gt(countLimit, 0, (p) => {
            return `Count limit must be greater than 0, got: ${p}`;
        });
    }

    const attrs = Object.entries(attributes)
        .map(([locationStr, definition]) => {
            if (!INT_PATTERN.test(locationStr)) {
                throw new Error("Location not a number. Use Command#locate");
            }
            const location = parseInt(locationStr, 10);
            if (Array.isArray(definition)) {
                if (array.is2(definition)) {
                    const s = array.shape2(definition);
                    const r = array.ravel2(definition, s);
                    return new AttributeDescriptor(
                        location,
                        AttributeType.POINTER,
                        _createVertexBufferWithTypedArray(
                            state.gl,
                            VertexBufferFloatDataType.FLOAT,
                            new Float32Array(r),
                        ),
                        s[0],
                        s[1],
                        false,
                        0,
                    );
                }
                return new AttributeDescriptor(
                    location,
                    AttributeType.POINTER,
                    _createVertexBufferWithTypedArray(
                        state.gl,
                        VertexBufferFloatDataType.FLOAT,
                        new Float32Array(definition),
                    ),
                    definition.length,
                    1,
                    false,
                    0,
                );
            }

            return new AttributeDescriptor(
                location,
                definition.type,
                definition.buffer,
                definition.count,
                definition.size,
                definition.type === AttributeType.POINTER
                    ? (definition.normalized || false)
                    : false,
                definition.divisor || 0,
            );
        });

    let primitive: ElementPrimitive;
    let elementBuffer: ElementBuffer<ElementBufferDataType> | undefined;
    if (typeof elements === "number") {
        primitive = elements;
    } else {
        elementBuffer = elements instanceof ElementBuffer
            ? elements
            : _createElementBufferWithArray(state.gl, elements);
        primitive = elementBuffer.primitive;
    }

    const inferredCount = elementBuffer
        ? elementBuffer.length
        : attrs.length
            ? attrs
                .map((attr) => attr.count)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;
    const count = typeof countLimit === "number"
        ? Math.min(countLimit, inferredCount)
        : inferredCount;

    const instAttrs = attrs.filter((attr) => !!attr.divisor);
    const instanceCount = instAttrs.length
        ? instAttrs
            .map((attr) => attr.count * attr.divisor)
            .reduce((min, curr) => Math.min(min, curr))
        : 0;

    return new Attributes(
        state,
        primitive,
        attrs,
        count,
        instanceCount,
        elementBuffer,
    );
}

/**
 * Attributes store vertex buffers, an element buffer, and attributes with the
 * vertex format for provided vertex buffers.
 */
export class Attributes {

    readonly primitive: ElementPrimitive;
    readonly count: number;
    readonly elementCount: number;
    readonly instanceCount: number;

    readonly glVertexArray: WebGLVertexArrayObject | null;

    private state: State;

    // The buffers
    private attributes: AttributeDescriptor[];
    private elementBuffer?: ElementBuffer<ElementBufferDataType>;

    constructor(
        state: State,
        primitive: ElementPrimitive,
        attributes: AttributeDescriptor[],
        count: number,
        instanceCount: number,
        elements?: ElementBuffer<ElementBufferDataType> | undefined,
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

    get indexType(): ElementBufferDataType | undefined {
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

class AttributeDescriptor {
    constructor(
        readonly location: number,
        readonly type: AttributeType,
        readonly buffer: VertexBuffer<VertexBufferDataType>,
        readonly count: number,
        readonly size: number,
        readonly normalized: boolean,
        readonly divisor: number,
    ) { }
}
