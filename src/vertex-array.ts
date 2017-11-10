import * as assert from "./assert";
import * as array from "./array";
import * as glutil from "./glutil";
import {
    VertexBuffer,
    VertexBufferProps,
    VertexBufferInt8Props,
    VertexBufferInt16Props,
    VertexBufferInt32Props,
    VertexBufferUint8Props,
    VertexBufferUint16Props,
    VertexBufferUint32Props,
} from "./vertex-buffer";
import {
    ElementBuffer,
    ElementBufferProps,
    ElementPrimitive,
} from "./element-buffer";

const INT_PATTERN = /^0|[1-9]\d*$/;

export type AttributeType =
    | "pointer"
    | "ipointer"
    ;

export type Attribute =
    | AttributeArray
    | AttributeObject
    ;

export type AttributeArray =
    | number[]
    | [number, number][]
    | [number, number, number][]
    | [number, number, number, number][]
    ;

export type AttributeObject =
    | AttributePointer
    | AttributeIPointer
    ;

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

export type PointerValue = VertexBufferProps;

export type IPointerValue =
    | VertexBufferInt8Props
    | VertexBufferInt16Props
    | VertexBufferInt32Props
    | VertexBufferUint8Props
    | VertexBufferUint16Props
    | VertexBufferUint32Props
    ;

export interface VertexArrayProps {
    attributes: {
        [name: string]: Attribute;
        [location: number]: Attribute;
    };
    elements: ElementBuffer | ElementBufferProps;
}

export class VertexArray {

    static fromProps(
        gl: WebGL2RenderingContext,
        { attributes, elements }: VertexArrayProps,
    ): VertexArray {

        // Setup attributes

        const attribs: AttributeInfo[] = [];
        const attribLocations: number[] = [];
        Object.entries(attributes).forEach(([locationStr, definition]) => {
            if (!INT_PATTERN.test(locationStr)) {
                throw new Error(
                    "Location is not a number. Use RenderPass#createVertexArray to resolve names.",
                );
            }
            const location = parseInt(locationStr, 10);
            attribLocations.push(location);
            attribs.push(AttributeInfo.create(gl, definition));
        });

        // Setup elements

        const elems = elements instanceof ElementBuffer
            ? elements
            : ElementBuffer.fromProps(gl, elements);

        // Create vertex array

        const vao = glutil.createVertexArray(
            gl,
            attribs.map((attrib, i) => ({
                type: attrib.type === "ipointer"
                    ? glutil.AttribType.IPointer
                    : glutil.AttribType.Pointer,
                buffer: attrib.buffer.glBuffer,
                bufferType: attrib.buffer.glType,
                size: attrib.size,
                location: attribLocations[i],
                normalized: attrib.normalized,
                divisor: attrib.divisor,
            })),
            elems.glBuffer,
        );

        // Compute max safe instance count

        const instancedBuffers = attribs
            .filter(buffer => !!buffer.divisor);

        const instanceCount = instancedBuffers.length
            ? instancedBuffers
                .map(b => b.count * b.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        // Create VAO

        return new VertexArray(
            vao,
            elems.count,
            elems.primitive,
            instanceCount,
        );
    }

    readonly glVertexArrayObject: WebGLVertexArrayObject;

    readonly count: number;
    readonly primitive: ElementPrimitive;
    readonly instanceCount: number;

    private constructor(
        vao: WebGLVertexArrayObject,
        count: number,
        primitive: ElementPrimitive,
        instanceCount: number,
    ) {
        this.glVertexArrayObject = vao;
        this.count = count;
        this.primitive = primitive;
        this.instanceCount = instanceCount;
    }
}

// TODO: this could use some further refactoring. Currently its just former
// public API made private.
class AttributeInfo {

    static create(
        gl: WebGL2RenderingContext,
        props: Attribute,
    ): AttributeInfo {
        if (Array.isArray(props)) {
            if (array.is2DArray(props)) {
                const r = array.ravel(props);
                return new AttributeInfo(
                    "pointer",
                    VertexBuffer.fromFloat32Array(gl, r.data),
                    r.shape[0],
                    r.shape[1],
                    false,
                    0,
                );
            }
            return new AttributeInfo(
                "pointer",
                VertexBuffer.fromFloat32Array(gl, props),
                props.length,
                1,
                false,
                0,
            );
        }

        switch (props.type) {
            case "pointer": return new AttributeInfo(
                props.type,
                props.value instanceof VertexBuffer
                    ? props.value
                    // Note: typescript is not smart enough to infer what we know
                    : VertexBuffer.fromProps(gl, props.value as any),
                props.count,
                props.size,
                props.normalized || false,
                props.divisor || 0,
            );
            case "ipointer": return new AttributeInfo(
                props.type,
                props.value instanceof VertexBuffer
                    ? props.value
                    // Note: typescript is not smart enough to infer what we know
                    : VertexBuffer.fromProps(gl, props.value as any),
                props.count,
                props.size,
                false,
                props.divisor || 0,
            );
            default: return assert.never(props);
        }

    }

    readonly type: AttributeType;
    readonly buffer: VertexBuffer;
    readonly count: number;
    readonly size: number;
    readonly normalized: boolean;
    readonly divisor: number;

    private constructor(
        type: AttributeType,
        buffer: VertexBuffer,
        count: number,
        size: number,
        normalized: boolean,
        divisor: number,
    ) {
        this.type = type;
        this.buffer = buffer;
        this.count = count;
        this.size = size;
        this.normalized = normalized;
        this.divisor = divisor;
    }
}
