import * as glutil from "./glutil";
import { Attribute, AttributeProps } from "./attribute";
import { ElementBuffer, ElementBufferProps, ElementPrimitive } from "./element-buffer";

const INT_PATTERN = /^0|[1-9]\d*$/;

export interface VertexArrayProps {
    attributes: {
        [name: string]: Attribute | AttributeProps;
        [location: number]: Attribute | AttributeProps;
    };
    elements: ElementBuffer | ElementBufferProps;
}

export class VertexArray {

    static fromProps(
        gl: WebGL2RenderingContext,
        { attributes, elements }: VertexArrayProps,
    ): VertexArray {

        // Setup attributes

        const attribs: Attribute[] = [];
        const attribLocations: number[] = [];
        Object.entries(attributes).forEach(([locationStr, definition]) => {
            if (!INT_PATTERN.test(locationStr)) {
                throw new Error(
                    "Location is not a number. Use RenderPass#createVertexArray to resolve names.",
                );
            }
            const location = parseInt(locationStr, 10);
            attribLocations.push(location);
            attribs.push(
                definition instanceof Attribute
                    ? definition
                    : Attribute.fromProps(gl, definition),
            );
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
