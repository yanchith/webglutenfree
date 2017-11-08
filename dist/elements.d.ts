/// <reference types="webgl2" />
export declare type ElementsProps = ElementsArrayProps | ElementsObjectProps;
export interface ElementsObjectProps {
    primitive: ElementPrimitive;
    data: number[] | Uint32Array;
}
export declare type ElementsArrayProps = [number, number, number][];
export declare type ElementPrimitive = "triangles";
export default class Elements {
    static fromProps(gl: WebGL2RenderingContext, props: ElementsProps): Elements;
    static fromArray(gl: WebGL2RenderingContext, arr: ElementsArrayProps): Elements;
    static fromUint32Array(gl: WebGL2RenderingContext, buffer: number[] | Uint32Array, primitive: ElementPrimitive): Elements;
    readonly glBuffer: WebGLBuffer;
    readonly count: number;
    readonly primitive: ElementPrimitive;
    private constructor();
}
