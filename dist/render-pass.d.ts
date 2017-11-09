/// <reference types="webgl2" />
import { VertexArray, VertexArrayProps } from "./vertex-array";
import { Texture } from "./texture";
import { Framebuffer } from "./framebuffer";
export interface RenderPassProps<P> {
    vert: string;
    frag: string;
    uniforms?: {
        [key: string]: Uniform<P>;
    };
}
export declare class RenderPass<P = void> {
    static fromProps<P = void>(gl: WebGL2RenderingContext, {vert, frag, uniforms}: RenderPassProps<P>): RenderPass<P>;
    private gl;
    private glProgram;
    private uniformInfo;
    private constructor();
    render(vao: VertexArray, props: P, count?: number, instanceCount?: number): void;
    renderToFramebuffer(vao: VertexArray, props: P, framebuffer: Framebuffer, count?: number, instanceCount?: number): void;
    createVertexArray({attributes, elements}: VertexArrayProps): VertexArray;
    private draw(elemCount, instCount);
    private updateUniforms(props);
}
export declare type AccessorOrValue<P, R> = Accessor<P, R> | R;
export declare type Accessor<P, R> = (props: P) => R;
export declare type Uniform<P> = Uniform1f<P> | Uniform1fv<P> | Uniform1i<P> | Uniform1iv<P> | Uniform1ui<P> | Uniform1uiv<P> | Uniform2f<P> | Uniform2fv<P> | Uniform2i<P> | Uniform2iv<P> | Uniform2ui<P> | Uniform2uiv<P> | Uniform3f<P> | Uniform3fv<P> | Uniform3i<P> | Uniform3iv<P> | Uniform3ui<P> | Uniform3uiv<P> | Uniform4f<P> | Uniform4fv<P> | Uniform4i<P> | Uniform4iv<P> | Uniform4ui<P> | Uniform4uiv<P> | UniformMatrix2fv<P> | UniformMatrix3fv<P> | UniformMatrix4fv<P> | UniformTexture<P>;
export interface Uniform1f<P> {
    type: "1f";
    value: AccessorOrValue<P, number>;
}
export interface Uniform1fv<P> {
    type: "1fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform1i<P> {
    type: "1i";
    value: AccessorOrValue<P, number>;
}
export interface Uniform1iv<P> {
    type: "1iv";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform1ui<P> {
    type: "1ui";
    value: AccessorOrValue<P, number>;
}
export interface Uniform1uiv<P> {
    type: "1uiv";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform2f<P> {
    type: "2f";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform2fv<P> {
    type: "2fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform2i<P> {
    type: "2i";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform2iv<P> {
    type: "2iv";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform2ui<P> {
    type: "2ui";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform2uiv<P> {
    type: "2uiv";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform3f<P> {
    type: "3f";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform3fv<P> {
    type: "3fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform3i<P> {
    type: "3i";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform3iv<P> {
    type: "3iv";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform3ui<P> {
    type: "3ui";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform3uiv<P> {
    type: "3uiv";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform4f<P> {
    type: "4f";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform4fv<P> {
    type: "4fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform4i<P> {
    type: "4i";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform4iv<P> {
    type: "4iv";
    value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform4ui<P> {
    type: "4ui";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform4uiv<P> {
    type: "4uiv";
    value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface UniformMatrix2fv<P> {
    type: "matrix2fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformMatrix3fv<P> {
    type: "matrix3fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformMatrix4fv<P> {
    type: "matrix4fv";
    value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformTexture<P> {
    type: "texture";
    value: AccessorOrValue<P, Texture>;
}
