import { State, DepthTestDescriptor, StencilTestDescriptor, BlendDescriptor } from "./state";
import { AttributesConfig } from "./attributes";
import { Texture2D, TextureCubeMap, TextureStorageFormat } from "./texture";
export declare enum UniformType {
    FLOAT = 5126,
    FLOAT_VEC2 = 35664,
    FLOAT_VEC3 = 35665,
    FLOAT_VEC4 = 35666,
    INT = 5124,
    INT_VEC2 = 35667,
    INT_VEC3 = 35668,
    INT_VEC4 = 35669,
    UNSIGNED_INT = 5125,
    UNSIGNED_INT_VEC2 = 36294,
    UNSIGNED_INT_VEC3 = 36295,
    UNSIGNED_INT_VEC4 = 36296,
    FLOAT_MAT2 = 35674,
    FLOAT_MAT3 = 35675,
    FLOAT_MAT4 = 35676,
    SAMPLER_2D = 35678,
    SAMPLER_CUBE = 35680
}
export declare type Accessor<P, R> = R | ((props: P, index: number) => R);
export interface Uniforms<P> {
    [name: string]: Uniform<P>;
}
export declare type SingleOrSeparateFrontBack<T> = T | {
    front: T;
    back: T;
};
export declare type SingleOrSeparateRgbAlpha<T> = T | {
    rgb: T;
    alpha: T;
};
export interface CommandCreateOptions<P> {
    uniforms?: Uniforms<P>;
    depth?: {
        func: DepthFunc;
        mask?: boolean;
        range?: [number, number];
    };
    stencil?: {
        func: {
            func: SingleOrSeparateFrontBack<StencilFunc>;
            ref?: SingleOrSeparateFrontBack<number>;
            mask?: SingleOrSeparateFrontBack<number>;
        };
        mask?: SingleOrSeparateFrontBack<number>;
        op?: {
            fail: SingleOrSeparateFrontBack<StencilOp>;
            zfail: SingleOrSeparateFrontBack<StencilOp>;
            zpass: SingleOrSeparateFrontBack<StencilOp>;
        };
    };
    blend?: {
        func: {
            src: SingleOrSeparateRgbAlpha<BlendFunc>;
            dst: SingleOrSeparateRgbAlpha<BlendFunc>;
        };
        equation?: SingleOrSeparateRgbAlpha<BlendEquation>;
        color?: [number, number, number, number];
    };
}
export declare type Uniform<P> = UniformValue<P> | UniformTextureValue<P>;
export declare type UniformValue<P> = UniformFloat<P> | UniformInt<P> | UniformUnsignedInt<P> | UniformFloatVec2<P> | UniformIntVec2<P> | UniformUnsignedIntVec2<P> | UniformFloatVec3<P> | UniformIntVec3<P> | UniformUnsignedIntVec3<P> | UniformFloatVec4<P> | UniformIntVec4<P> | UniformUnsignedIntVec4<P> | UniformFloatMat2<P> | UniformFloatMat3<P> | UniformFloatMat4<P>;
export declare type UniformTextureValue<P> = UniformTexture2D<P> | UniformTextureCubeMap<P>;
export interface UniformFloat<P> {
    type: UniformType.FLOAT;
    value: Accessor<P, number | number[] | Float32Array>;
}
export interface UniformInt<P> {
    type: UniformType.INT;
    value: Accessor<P, number | number[] | Int32Array>;
}
export interface UniformUnsignedInt<P> {
    type: UniformType.UNSIGNED_INT;
    value: Accessor<P, number | number[] | Uint32Array>;
}
export interface UniformFloatVec2<P> {
    type: UniformType.FLOAT_VEC2;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformIntVec2<P> {
    type: UniformType.INT_VEC2;
    value: Accessor<P, number[] | Int32Array>;
}
export interface UniformUnsignedIntVec2<P> {
    type: UniformType.UNSIGNED_INT_VEC2;
    value: Accessor<P, number[] | Uint32Array>;
}
export interface UniformFloatVec3<P> {
    type: UniformType.FLOAT_VEC3;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformIntVec3<P> {
    type: UniformType.INT_VEC3;
    value: Accessor<P, number[] | Int32Array>;
}
export interface UniformUnsignedIntVec3<P> {
    type: UniformType.UNSIGNED_INT_VEC3;
    value: Accessor<P, number[] | Uint32Array>;
}
export interface UniformFloatVec4<P> {
    type: UniformType.FLOAT_VEC4;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformIntVec4<P> {
    type: UniformType.INT_VEC4;
    value: Accessor<P, number[] | Int32Array>;
}
export interface UniformUnsignedIntVec4<P> {
    type: UniformType.UNSIGNED_INT_VEC4;
    value: Accessor<P, number[] | Uint32Array>;
}
export interface UniformFloatMat2<P> {
    type: UniformType.FLOAT_MAT2;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformFloatMat3<P> {
    type: UniformType.FLOAT_MAT3;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformFloatMat4<P> {
    type: UniformType.FLOAT_MAT4;
    value: Accessor<P, number[] | Float32Array>;
}
export interface UniformTexture2D<P> {
    type: UniformType.SAMPLER_2D;
    value: Accessor<P, Texture2D<TextureStorageFormat>>;
}
export interface UniformTextureCubeMap<P> {
    type: UniformType.SAMPLER_CUBE;
    value: Accessor<P, TextureCubeMap<TextureStorageFormat>>;
}
export declare type DynamicUniformValue<P> = DynamicUniformFloat<P> | DynamicUniformInt<P> | DynamicUniformUnsignedInt<P> | DynamicUniformFloatVec2<P> | DynamicUniformIntVec2<P> | DynamicUniformUnsignedIntVec2<P> | DynamicUniformFloatVec3<P> | DynamicUniformIntVec3<P> | DynamicUniformUnsignedIntVec3<P> | DynamicUniformFloatVec4<P> | DynamicUniformIntVec4<P> | DynamicUniformUnsignedIntVec4<P> | DynamicUniformFloatMat2<P> | DynamicUniformFloatMat3<P> | DynamicUniformFloatMat4<P>;
export interface DynamicUniformFloat<P> {
    type: UniformType.FLOAT;
    value: (props: P, index: number) => number | number[] | Float32Array;
}
export interface DynamicUniformInt<P> {
    type: UniformType.INT;
    value: (props: P, index: number) => number | number[] | Int32Array;
}
export interface DynamicUniformUnsignedInt<P> {
    type: UniformType.UNSIGNED_INT;
    value: (props: P, index: number) => number | number[] | Uint32Array;
}
export interface DynamicUniformFloatVec2<P> {
    type: UniformType.FLOAT_VEC2;
    value: (props: P, index: number) => number[] | Float32Array;
}
export interface DynamicUniformIntVec2<P> {
    type: UniformType.INT_VEC2;
    value: (props: P, index: number) => number[] | Int32Array;
}
export interface DynamicUniformUnsignedIntVec2<P> {
    type: UniformType.UNSIGNED_INT_VEC2;
    value: (props: P, index: number) => number[] | Uint32Array;
}
export interface DynamicUniformFloatVec3<P> {
    type: UniformType.FLOAT_VEC3;
    value: (props: P, index: number) => number[] | Float32Array;
}
export interface DynamicUniformIntVec3<P> {
    type: UniformType.INT_VEC3;
    value: (props: P, index: number) => number[] | Int32Array;
}
export interface DynamicUniformUnsignedIntVec3<P> {
    type: UniformType.UNSIGNED_INT_VEC3;
    value: (props: P, index: number) => number[] | Uint32Array;
}
export interface DynamicUniformFloatVec4<P> {
    type: UniformType.FLOAT_VEC4;
    value: (props: P, index: number) => number[] | Float32Array;
}
export interface DynamicUniformIntVec4<P> {
    type: UniformType.INT_VEC4;
    value: (props: P, index: number) => number[] | Int32Array;
}
export interface DynamicUniformUnsignedIntVec4<P> {
    type: UniformType.UNSIGNED_INT_VEC4;
    value: (props: P, index: number) => number[] | Uint32Array;
}
export interface DynamicUniformFloatMat2<P> {
    type: UniformType.FLOAT_MAT2;
    value: (props: P, index: number) => number[] | Float32Array;
}
export interface DynamicUniformFloatMat3<P> {
    type: UniformType.FLOAT_MAT3;
    value: (props: P, index: number) => number[] | Float32Array;
}
export interface DynamicUniformFloatMat4<P> {
    type: UniformType.FLOAT_MAT4;
    value: (props: P, index: number) => number[] | Float32Array;
}
export declare enum DepthFunc {
    ALWAYS = 519,
    NEVER = 512,
    EQUAL = 514,
    NOTEQUAL = 517,
    LESS = 513,
    LEQUAL = 515,
    GREATER = 516,
    GEQUAL = 518
}
export declare enum StencilFunc {
    ALWAYS = 519,
    NEVER = 512,
    EQUAL = 514,
    NOTEQUAL = 517,
    LESS = 513,
    LEQUAL = 515,
    GREATER = 516,
    GEQUAL = 518
}
export declare enum StencilOp {
    KEEP = 7680,
    ZERO = 0,
    REPLACE = 7681,
    INCR = 7682,
    INCR_WRAP = 34055,
    DECR = 7683,
    DECR_WRAP = 34056,
    INVERT = 5386
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
    ONE_MINUS_CONSTANT_ALPHA = 32772
}
export declare enum BlendEquation {
    FUNC_ADD = 32774,
    FUNC_SUBTRACT = 32778,
    FUNC_REVERSE_SUBTRACT = 32779,
    MIN = 32775,
    MAX = 32776
}
export declare function _createCommand<P = void>(state: State, vert: string, frag: string, { uniforms, depth, stencil, blend, }?: CommandCreateOptions<P>): Command<P>;
export declare class Command<P> {
    readonly glProgram: WebGLProgram;
    readonly depthTestDescr: DepthTestDescriptor | null;
    readonly stencilTestDescr: StencilTestDescriptor | null;
    readonly blendDescr: BlendDescriptor | null;
    readonly uniformDescrs: UniformDescriptor<P>[];
    readonly textureDescrs: TextureDescriptor<P>[];
    private state;
    private vsSource;
    private fsSource;
    private uniforms;
    constructor(state: State, vsSource: string, fsSource: string, uniforms: Uniforms<P>, depthDescr?: DepthTestDescriptor, stencilDescr?: StencilTestDescriptor, blendDescr?: BlendDescriptor);
    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void;
    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes: AttributesConfig): AttributesConfig;
    private init;
}
export declare class UniformDescriptor<P> {
    readonly identifier: string;
    readonly location: WebGLUniformLocation;
    readonly definition: DynamicUniformValue<P>;
    constructor(identifier: string, location: WebGLUniformLocation, definition: DynamicUniformValue<P>);
}
export declare class TextureDescriptor<P> {
    readonly identifier: string;
    readonly definition: UniformTextureValue<P>;
    constructor(identifier: string, definition: UniformTextureValue<P>);
}
//# sourceMappingURL=command.d.ts.map