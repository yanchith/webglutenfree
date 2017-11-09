/// <reference types="webgl2" />
export declare type ElementBufferProps = ElementBufferArrayProps | ElementBufferObjectProps;
export interface ElementBufferObjectProps {
    primitive: ElementPrimitive;
    data: number[] | Uint32Array;
}
export declare type ElementBufferArrayProps = [number, number, number][];
export declare type ElementPrimitive = "triangles";
export declare class ElementBuffer {
    static fromProps(gl: WebGL2RenderingContext, props: ElementBufferProps): ElementBuffer;
    static fromArray(gl: WebGL2RenderingContext, arr: ElementBufferArrayProps): ElementBuffer;
    static fromUint32Array(gl: WebGL2RenderingContext, buffer: number[] | Uint32Array, primitive: ElementPrimitive): ElementBuffer;
    readonly glBuffer: WebGLBuffer;
    readonly count: number;
    readonly primitive: ElementPrimitive;
    private constructor();
}
