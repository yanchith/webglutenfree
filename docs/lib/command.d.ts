import { Device as _Device } from "./device";
import { AttributesConfig } from "./attributes";
import { Texture as _Texture, TextureInternalFormat } from "./texture";
export declare type Accessor<P, R> = R | ((props: P, index: number) => R);
export declare type TextureAccessor<P> = Accessor<P, _Texture<TextureInternalFormat>>;
export interface Textures<P> {
    [name: string]: TextureAccessor<P>;
}
export interface Uniforms<P> {
    [name: string]: Uniform<P>;
}
export declare type StencilOrSeparate<T> = T | {
    front: T;
    back: T;
};
export declare type BlendOrSeparate<T> = T | {
    rgb: T;
    alpha: T;
};
export interface CommandOptions<P> {
    textures?: Textures<P>;
    uniforms?: Uniforms<P>;
    depth?: {
        func: DepthFunc;
        mask?: boolean;
        range?: [number, number];
    };
    stencil?: {
        func: {
            func: StencilOrSeparate<StencilFunc>;
            ref?: StencilOrSeparate<number>;
            mask?: StencilOrSeparate<number>;
        };
        mask?: StencilOrSeparate<number>;
        op?: {
            fail: StencilOrSeparate<StencilOp>;
            zfail: StencilOrSeparate<StencilOp>;
            zpass: StencilOrSeparate<StencilOp>;
        };
    };
    blend?: {
        func: {
            src: BlendOrSeparate<BlendFunc>;
            dst: BlendOrSeparate<BlendFunc>;
        };
        equation?: BlendOrSeparate<BlendEquation>;
        color?: [number, number, number, number];
    };
}
export declare type Uniform<P> = Uniform1f<P> | Uniform1fv<P> | Uniform1i<P> | Uniform1iv<P> | Uniform1ui<P> | Uniform1uiv<P> | Uniform2f<P> | Uniform2fv<P> | Uniform2i<P> | Uniform2iv<P> | Uniform2ui<P> | Uniform2uiv<P> | Uniform3f<P> | Uniform3fv<P> | Uniform3i<P> | Uniform3iv<P> | Uniform3ui<P> | Uniform3uiv<P> | Uniform4f<P> | Uniform4fv<P> | Uniform4i<P> | Uniform4iv<P> | Uniform4ui<P> | Uniform4uiv<P> | UniformMatrix2fv<P> | UniformMatrix3fv<P> | UniformMatrix4fv<P>;
export interface Uniform1f<P> {
    type: "1f";
    value: Accessor<P, number>;
}
export interface Uniform1fv<P> {
    type: "1fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform1i<P> {
    type: "1i";
    value: Accessor<P, number>;
}
export interface Uniform1iv<P> {
    type: "1iv";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform1ui<P> {
    type: "1ui";
    value: Accessor<P, number>;
}
export interface Uniform1uiv<P> {
    type: "1uiv";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform2f<P> {
    type: "2f";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform2fv<P> {
    type: "2fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform2i<P> {
    type: "2i";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform2iv<P> {
    type: "2iv";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform2ui<P> {
    type: "2ui";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform2uiv<P> {
    type: "2uiv";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform3f<P> {
    type: "3f";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform3fv<P> {
    type: "3fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform3i<P> {
    type: "3i";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform3iv<P> {
    type: "3iv";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform3ui<P> {
    type: "3ui";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform3uiv<P> {
    type: "3uiv";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform4f<P> {
    type: "4f";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform4fv<P> {
    type: "4fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface Uniform4i<P> {
    type: "4i";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform4iv<P> {
    type: "4iv";
    value: Accessor<P, Int32Array | number[]>;
}
export interface Uniform4ui<P> {
    type: "4ui";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface Uniform4uiv<P> {
    type: "4uiv";
    value: Accessor<P, Uint32Array | number[]>;
}
export interface UniformMatrix2fv<P> {
    type: "matrix2fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface UniformMatrix3fv<P> {
    type: "matrix3fv";
    value: Accessor<P, Float32Array | number[]>;
}
export interface UniformMatrix4fv<P> {
    type: "matrix4fv";
    value: Accessor<P, Float32Array | number[]>;
}
export declare enum DepthFunc {
    ALWAYS = 519,
    NEVER = 512,
    EQUAL = 514,
    NOTEQUAL = 517,
    LESS = 513,
    LEQUAL = 515,
    GREATER = 516,
    GEQUAL = 518,
}
export declare enum StencilFunc {
    ALWAYS = 519,
    NEVER = 512,
    EQUAL = 514,
    NOTEQUAL = 517,
    LESS = 513,
    LEQUAL = 515,
    GREATER = 516,
    GEQUAL = 518,
}
export declare enum StencilOp {
    KEEP = 7680,
    ZERO = 0,
    REPLACE = 7681,
    INCR = 7682,
    INCR_WRAP = 34055,
    DECR = 7683,
    DECR_WRAP = 34056,
    INVERT = 5386,
}
export declare enum BlendFunc {
    ZERO = 0,
    ONE = 1,
    SRC_COLOR = 768,
    SRC_ALPHA = 770,
    ONE_MINUS_SRC_COLOR = 769,
    ONE_MINUS_SRC_ALPHA = 771,
    DST_COLOR = 774,
    DST_ALPHA = 772,
    ONE_MINUS_DST_COLOR = 775,
    ONE_MINUS_DST_ALPHA = 773,
    CONSTANT_COLOR = 32769,
    CONSTANT_ALPHA = 32771,
    ONE_MINUS_CONSTANT_COLOR = 32770,
    ONE_MINUS_CONSTANT_ALPHA = 32772,
}
export declare enum BlendEquation {
    FUNC_ADD = 32774,
    FUNC_SUBTRACT = 32778,
    FUNC_REVERSE_SUBTRACT = 32779,
    MIN = 32775,
    MAX = 32776,
}
export declare class Command<P> {
    static create<P>(dev: _Device, vert: string, frag: string, {textures, uniforms, depth, stencil, blend}?: CommandOptions<P>): Command<P>;
    readonly glProgram: WebGLProgram | null;
    readonly depthDescr: DepthDescriptor | null;
    readonly stencilDescr: StencilDescriptor | null;
    readonly blendDescr: BlendDescriptor | null;
    readonly textureAccessors: TextureAccessor<P>[];
    readonly uniformDescrs: UniformDescriptor<P>[];
    private dev;
    private vsSource;
    private fsSource;
    private textures;
    private uniforms;
    private constructor();
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes: AttributesConfig): AttributesConfig;
    private init();
}
export declare class DepthDescriptor {
    readonly func: number;
    readonly mask: boolean;
    readonly rangeStart: number;
    readonly rangeEnd: number;
    static equals(left: DepthDescriptor | null, right: DepthDescriptor | null): boolean;
    constructor(func: number, mask: boolean, rangeStart: number, rangeEnd: number);
}
export declare class StencilDescriptor {
    readonly fFn: number;
    readonly bFn: number;
    readonly fFnRef: number;
    readonly bFnRef: number;
    readonly fFnMask: number;
    readonly bFnMask: number;
    readonly fMask: number;
    readonly bMask: number;
    readonly fOpFail: number;
    readonly bOpFail: number;
    readonly fOpZFail: number;
    readonly bOpZFail: number;
    readonly fOpZPass: number;
    readonly bOpZPass: number;
    static equals(left: StencilDescriptor | null, right: StencilDescriptor | null): boolean;
    constructor(fFn: number, bFn: number, fFnRef: number, bFnRef: number, fFnMask: number, bFnMask: number, fMask: number, bMask: number, fOpFail: number, bOpFail: number, fOpZFail: number, bOpZFail: number, fOpZPass: number, bOpZPass: number);
}
export declare class BlendDescriptor {
    readonly srcRGB: number;
    readonly srcAlpha: number;
    readonly dstRGB: number;
    readonly dstAlpha: number;
    readonly eqnRGB: number;
    readonly eqnAlpha: number;
    readonly color: [number, number, number, number] | undefined;
    static equals(left: BlendDescriptor | null, right: BlendDescriptor | null): boolean;
    constructor(srcRGB: number, srcAlpha: number, dstRGB: number, dstAlpha: number, eqnRGB: number, eqnAlpha: number, color?: [number, number, number, number] | undefined);
}
export declare class UniformDescriptor<P> {
    readonly identifier: string;
    readonly location: WebGLUniformLocation;
    readonly definition: Uniform<P>;
    constructor(identifier: string, location: WebGLUniformLocation, definition: Uniform<P>);
}
