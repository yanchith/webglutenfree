import * as assert from "./assert";
import * as glutil from "./glutil";
import { Device } from "./device";
import { Attributes } from "./attribute-data";
import { Texture, TextureInternalFormat } from "./texture";

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

export type Access<P, R> = R | ((props: P, index: number) => R);
export type StencilOrSeparate<T> = T | { front: T, back: T };
export type BlendOrSeparate<T> = T | { rgb: T, alpha: T };

export interface CommandOptions<P> {
    uniforms?: { [key: string]: Uniform<P> };
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

export type Uniform<P> =
    | Uniform1f<P> | Uniform1fv<P>
    | Uniform1i<P> | Uniform1iv<P> | Uniform1ui<P> | Uniform1uiv<P>
    | Uniform2f<P> | Uniform2fv<P>
    | Uniform2i<P> | Uniform2iv<P> | Uniform2ui<P> | Uniform2uiv<P>
    | Uniform3f<P> | Uniform3fv<P>
    | Uniform3i<P> | Uniform3iv<P> | Uniform3ui<P> | Uniform3uiv<P>
    | Uniform4f<P> | Uniform4fv<P>
    | Uniform4i<P> | Uniform4iv<P> | Uniform4ui<P> | Uniform4uiv<P>
    | UniformMatrix2fv<P> | UniformMatrix3fv<P> | UniformMatrix4fv<P>
    | UniformTexture<P>
    ;

export interface Uniform1f<P> {
    type: "1f";
    value: Access<P, number>;
}

export interface Uniform1fv<P> {
    type: "1fv";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform1i<P> {
    type: "1i";
    value: Access<P, number>;
}

export interface Uniform1iv<P> {
    type: "1iv";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform1ui<P> {
    type: "1ui";
    value: Access<P, number>;
}

export interface Uniform1uiv<P> {
    type: "1uiv";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform2f<P> {
    type: "2f";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform2fv<P> {
    type: "2fv";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform2i<P> {
    type: "2i";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform2iv<P> {
    type: "2iv";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform2ui<P> {
    type: "2ui";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform2uiv<P> {
    type: "2uiv";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform3f<P> {
    type: "3f";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform3fv<P> {
    type: "3fv";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform3i<P> {
    type: "3i";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform3iv<P> {
    type: "3iv";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform3ui<P> {
    type: "3ui";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform3uiv<P> {
    type: "3uiv";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform4f<P> {
    type: "4f";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform4fv<P> {
    type: "4fv";
    value: Access<P, Float32Array | number[]>;
}

export interface Uniform4i<P> {
    type: "4i";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform4iv<P> {
    type: "4iv";
    value: Access<P, Int32Array | number[]>;
}

export interface Uniform4ui<P> {
    type: "4ui";
    value: Access<P, Uint32Array | number[]>;
}

export interface Uniform4uiv<P> {
    type: "4uiv";
    value: Access<P, Uint32Array | number[]>;
}

export interface UniformMatrix2fv<P> {
    type: "matrix2fv";
    value: Access<P, Float32Array | number[]>;
}

export interface UniformMatrix3fv<P> {
    type: "matrix3fv";
    value: Access<P, Float32Array | number[]>;
}

export interface UniformMatrix4fv<P> {
    type: "matrix4fv";
    value: Access<P, Float32Array | number[]>;
}

export interface UniformTexture<P> {
    type: "texture";
    value: Access<P, Texture<TextureInternalFormat>>;
}

export enum DepthFunc {
    ALWAYS = 0x0207,
    NEVER = 0x0200,
    EQUAL = 0x0202,
    NOTEQUAL = 0x0205,
    LESS = 0x0201,
    LEQUAL = 0x0203,
    GREATER = 0x0204,
    GEQUAL = 0x0206,
}

export enum StencilFunc {
    ALWAYS = 0x0207,
    NEVER = 0x0200,
    EQUAL = 0x0202,
    NOTEQUAL = 0x0205,
    LESS = 0x0201,
    LEQUAL = 0x0203,
    GREATER = 0x0204,
    GEQUAL = 0x0206,
}

export enum StencilOp {
    KEEP = 0x1E00,
    ZERO = 0,
    REPLACE = 0x1E01,
    INCR = 0x1E02,
    INCR_WRAP = 0x8507,
    DECR = 0x1E03,
    DECR_WRAP = 0x8508,
    INVERT = 0x150A,
}

export enum BlendFunc {
    ZERO = 0,
    ONE = 1,
    SRC_COLOR = 0x0300,
    SRC_ALPHA = 0x0302,
    ONE_MINUS_SRC_COLOR = 0x0301,
    ONE_MINUS_SRC_ALPHA = 0x0303,
    DST_COLOR = 0x0306,
    DST_ALPHA = 0x0304,
    ONE_MINUS_DST_COLOR = 0x0307,
    ONE_MINUS_DST_ALPHA = 0x0305,
    CONSTANT_COLOR = 0x8001,
    CONSTANT_ALPHA = 0x8003,
    ONE_MINUS_CONSTANT_COLOR = 0x8002,
    ONE_MINUS_CONSTANT_ALPHA = 0x8004,
}

export enum BlendEquation {
    FUNC_ADD = 0x8006,
    FUNC_SUBTRACT = 0x800A,
    FUNC_REVERSE_SUBTRACT = 0x800B,
    MIN = 0x8007,
    MAX = 0x8008,
}

export class Command<P> {

    static create<P>(
        dev: WebGL2RenderingContext | Device,
        vert: string,
        frag: string,
        {
            uniforms = {},
            depth,
            stencil,
            blend,
        }: CommandOptions<P> = {},
    ): Command<P> {
        assert.nonNull(vert, "vert");
        assert.nonNull(frag, "frag");
        if (depth) {
            assert.nonNull(depth.func, "depth.func");
        }
        if (blend) {
            assert.nonNull(blend.func, "blend.func");
            assert.nonNull(blend.func.src, "blend.func.src");
            assert.nonNull(blend.func.dst, "blend.func.dst");
            if (typeof blend.func.src === "object") {
                assert.nonNull(
                    blend.func.src.rgb,
                    "blend.func.src.rgb",
                );
                assert.nonNull(
                    blend.func.src.alpha,
                    "blend.func.src.alpha",
                );
            }
            if (typeof blend.func.dst === "object") {
                assert.nonNull(
                    blend.func.dst.rgb,
                    "blend.func.dst.rgb",
                );
                assert.nonNull(
                    blend.func.dst.alpha,
                    "blend.func.dst.alpha",
                );
            }
        }
        if (stencil) {
            assert.nonNull(stencil.func, "stencil.func");
            // TODO: complete stencil validation... validation framework?
        }

        const gl = dev instanceof Device ? dev.gl : dev;
        const vs = glutil.createShader(gl, gl.VERTEX_SHADER, vert);
        const fs = glutil.createShader(gl, gl.FRAGMENT_SHADER, frag);
        const prog = glutil.createProgram(gl, vs, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        const uniformDescrs = Object.entries(uniforms)
            .map(([ident, uniform]) => {
                const loc = gl.getUniformLocation(prog, ident);
                if (!loc) {
                    throw new Error(`No location for uniform: ${ident}`);
                }
                return new UniformDescriptor(ident, loc, uniform);
            });

        const depthDescr = parseDepth(depth);
        const stencilDescr = parseStencil(stencil);
        const blendDescr = parseBlend(blend);

        return new Command(
            gl,
            prog,
            uniformDescrs,
            depthDescr,
            stencilDescr,
            blendDescr,
        );
    }

    readonly glProgram: WebGLProgram;
    readonly depthDescr?: DepthDescriptor;
    readonly stencilDescr?: StencilDescriptor;
    readonly blendDescr?: BlendDescriptor;
    readonly uniformDescrs: UniformDescriptor<P>[];

    private gl: WebGL2RenderingContext;

    private constructor(
        gl: WebGL2RenderingContext,
        glProgram: WebGLProgram,
        uniformDescrs: UniformDescriptor<P>[],
        depthDescr?: DepthDescriptor,
        stencilDescr?: StencilDescriptor,
        blendDescr?: BlendDescriptor,
    ) {
        this.gl = gl;
        this.glProgram = glProgram;
        this.uniformDescrs = uniformDescrs;
        this.depthDescr = depthDescr;
        this.stencilDescr = stencilDescr;
        this.blendDescr = blendDescr;
    }

    locate(attributes: Attributes): Attributes {
        return locate(this.gl, this.glProgram, attributes);
    }
}

function locate(
    gl: WebGL2RenderingContext,
    glProgram: WebGLProgram,
    attributes: Attributes,
): Attributes {
    return Object.entries(attributes)
        .reduce<Attributes>((accum, [identifier, definition]) => {
            if (INT_PATTERN.test(identifier)) {
                accum[identifier] = definition;
            } else {
                const location = gl.getAttribLocation(glProgram, identifier);
                if (location === UNKNOWN_ATTRIB_LOCATION) {
                    throw new Error(`No location for attrib: ${identifier}`);
                }
                accum[location] = definition;
            }
            return accum;
        }, {});
}


export class DepthDescriptor {
    constructor(
        readonly func: number,
        readonly mask: boolean,
        readonly rangeStart: number,
        readonly rangeEnd: number,
    ) { }
}

export class StencilDescriptor {
    constructor(
        readonly fFunc: number,
        readonly bFunc: number,
        readonly fFuncRef: number,
        readonly bfuncRef: number,
        readonly fFuncMask: number,
        readonly bFuncMask: number,
        readonly fMask: number,
        readonly bMask: number,
        readonly fOpFail: number,
        readonly bOpFail: number,
        readonly fOpZFail: number,
        readonly bOpZFail: number,
        readonly fOpZPass: number,
        readonly bOpZPass: number,
    ) { }
}

export class BlendDescriptor {
    constructor(
        readonly srcRGB: number,
        readonly srcAlpha: number,
        readonly dstRGB: number,
        readonly dstAlpha: number,
        readonly equationRGB: number,
        readonly equationAlpha: number,
        readonly color?: [number, number, number, number],
    ) { }
}

export class UniformDescriptor<P> {
    constructor(
        readonly identifier: string,
        readonly location: WebGLUniformLocation,
        readonly definition: Uniform<P>,
    ) { }
}

function parseDepth(
    depth: CommandOptions<void>["depth"],
): DepthDescriptor | undefined {
    if (!depth) { return undefined; }
    return new DepthDescriptor(
        depth.func || DepthFunc.LESS,
        typeof depth.mask === "boolean" ? depth.mask : true,
        depth.range ? depth.range[0] : 0,
        depth.range ? depth.range[1] : 1,
    );
}

function parseStencil(
    stencil: CommandOptions<void>["stencil"],
): StencilDescriptor | undefined {
    if (!stencil) { return undefined; }
    return new StencilDescriptor(
        typeof stencil.func.func === "object"
            ? stencil.func.func.front
            : stencil.func.func,
        typeof stencil.func.func === "object"
            ? stencil.func.func.back
            : stencil.func.func,
        typeof stencil.func.ref !== "undefined"
            ? typeof stencil.func.ref === "object"
                ? stencil.func.ref.front
                : stencil.func.ref
            : 1,
        typeof stencil.func.ref !== "undefined"
            ? typeof stencil.func.ref === "object"
                ? stencil.func.ref.back
                : stencil.func.ref
            : 1,
        typeof stencil.func.mask !== "undefined"
            ? typeof stencil.func.mask === "object"
                ? stencil.func.mask.front
                : stencil.func.mask
            : 0xFF,
        typeof stencil.func.mask !== "undefined"
            ? typeof stencil.func.mask === "object"
                ? stencil.func.mask.back
                : stencil.func.mask
            : 0xFF,
        typeof stencil.mask !== "undefined"
            ? typeof stencil.mask === "object"
                ? stencil.mask.front
                : stencil.mask
            : 0xFF,
        typeof stencil.mask !== "undefined"
            ? typeof stencil.mask === "object"
                ? stencil.mask.back
                : stencil.mask
            : 0xFF,
        stencil.op
            ? typeof stencil.op.fail === "object"
                ? stencil.op.fail.front
                : stencil.op.fail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.fail === "object"
                ? stencil.op.fail.back
                : stencil.op.fail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zfail === "object"
                ? stencil.op.zfail.front
                : stencil.op.zfail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zfail === "object"
                ? stencil.op.zfail.back
                : stencil.op.zfail
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zpass === "object"
                ? stencil.op.zpass.front
                : stencil.op.zpass
            : StencilOp.KEEP,
        stencil.op
            ? typeof stencil.op.zpass === "object"
                ? stencil.op.zpass.back
                : stencil.op.zpass
            : StencilOp.KEEP,
    );
}

function parseBlend(
    blend: CommandOptions<void>["blend"],
): BlendDescriptor | undefined {
    if (!blend) { return undefined; }
    return new BlendDescriptor(
        typeof blend.func.src === "object"
            ? blend.func.src.rgb
            : blend.func.src,
        typeof blend.func.src === "object"
            ? blend.func.src.alpha
            : blend.func.src,
        typeof blend.func.dst === "object"
            ? blend.func.dst.rgb
            : blend.func.dst,
        typeof blend.func.dst === "object"
            ? blend.func.dst.alpha
            : blend.func.dst,
        blend.equation
            ? typeof blend.equation === "object"
                ? blend.equation.rgb
                : blend.equation
            : BlendEquation.FUNC_ADD,
        blend.equation
            ? typeof blend.equation === "object"
                ? blend.equation.alpha
                : blend.equation
            : BlendEquation.FUNC_ADD,
        blend.color,
    );
}
