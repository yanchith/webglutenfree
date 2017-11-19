import * as assert from "./assert";
import * as array from "./array";
import * as glutil from "./glutil";
import { Device } from "./device";
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
    elements?: ElementBuffer | ElementBufferProps;
}

export class VertexArray {

    static create(
        dev: WebGL2RenderingContext | Device,
        { attributes, elements }: VertexArrayProps,
    ): VertexArray {
        const gl = dev instanceof Device ? dev.gl : dev;
        // Setup attributes

        const attribDescriptors: AttributeDescriptor[] = [];
        const attribLocations: number[] = [];
        Object.entries(attributes).forEach(([locationStr, definition]) => {
            if (!INT_PATTERN.test(locationStr)) {
                throw new Error(
                    "Location is not a number. Use RenderPass#createVertexArray to resolve names.",
                );
            }
            const location = parseInt(locationStr, 10);
            attribLocations.push(location);
            attribDescriptors.push(AttributeDescriptor.create(gl, definition));
        });

        // Setup elements

        let elems: ElementBuffer | undefined;
        if (elements) {
            elems = elements instanceof ElementBuffer
                ? elements
                : ElementBuffer.create(gl, elements);
        }

        // Create vertex array

        const vao = glutil.createVertexArray(
            gl,
            attribDescriptors.map((attrib, i) => ({
                type: attrib.type === "ipointer"
                    ? glutil.AttribType.IPOINTER
                    : glutil.AttribType.POINTER,
                buffer: attrib.buffer.glBuffer,
                bufferType: attrib.buffer.glType,
                size: attrib.size,
                location: attribLocations[i],
                normalized: attrib.normalized,
                divisor: attrib.divisor,
            })),
            elems ? elems.glBuffer : undefined,
        );

        // Compute max safe instance count

        const instancedBuffers = attribDescriptors
            .filter(buffer => !!buffer.divisor);

        const instanceCount = instancedBuffers.length
            ? instancedBuffers
                .map(b => b.count * b.divisor)
                .reduce((min, curr) => Math.min(min, curr))
            : 0;

        // Create VAO

        return new VertexArray(
            vao,
            !!elems,
            elems ? elems.count : attribDescriptors[0].count,
            instanceCount,
        );
    }

    private constructor(
        readonly glVertexArrayObject: WebGLVertexArrayObject,
        readonly hasElements: boolean,
        readonly count: number, // Either count of vertex data or of elements
        readonly instanceCount: number,
    ) { }
}

// TODO: this could use some further refactoring. Currently its just former
// public API made private.
class AttributeDescriptor {

    static create(
        gl: WebGL2RenderingContext,
        props: Attribute,
    ): AttributeDescriptor {
        if (Array.isArray(props)) {
            if (array.is2DArray(props)) {
                const r = array.ravel(props);
                return new AttributeDescriptor(
                    "pointer",
                    VertexBuffer.fromFloat32Array(gl, r.data),
                    r.shape[0],
                    r.shape[1],
                    false,
                    0,
                );
            }
            return new AttributeDescriptor(
                "pointer",
                VertexBuffer.fromFloat32Array(gl, props),
                props.length,
                1,
                false,
                0,
            );
        }

        switch (props.type) {
            case "pointer": return new AttributeDescriptor(
                props.type,
                props.value instanceof VertexBuffer
                    ? props.value
                    // Note: typescript is not smart enough to infer what we know
                    : VertexBuffer.create(gl, props.value as any),
                props.count,
                props.size,
                props.normalized || false,
                props.divisor || 0,
            );
            case "ipointer": return new AttributeDescriptor(
                props.type,
                props.value instanceof VertexBuffer
                    ? props.value
                    // Note: typescript is not smart enough to infer what we know
                    : VertexBuffer.create(gl, props.value as any),
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
