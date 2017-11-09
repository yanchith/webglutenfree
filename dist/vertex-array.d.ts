/// <reference types="webgl2" />
import { Attribute, AttributeProps } from "./attribute";
import { ElementBuffer, ElementBufferProps, ElementPrimitive } from "./element-buffer";
export interface VertexArrayProps {
    attributes: {
        [name: string]: Attribute | AttributeProps;
        [location: number]: Attribute | AttributeProps;
    };
    elements: ElementBuffer | ElementBufferProps;
}
export declare class VertexArray {
    static fromProps(gl: WebGL2RenderingContext, {attributes, elements}: VertexArrayProps): VertexArray;
    readonly glVao: WebGLVertexArrayObject;
    readonly count: number;
    readonly primitive: ElementPrimitive;
    readonly instanceCount: number;
    private constructor();
}
