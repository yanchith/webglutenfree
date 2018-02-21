import * as assert from "./util/assert";
import { Device, SYM_STACK_PROGRAM } from "./device";
import { AttributesConfig } from "./attributes";
import { Texture, TextureInternalFormat } from "./texture";

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

export type Accessor<P, R> = R | ((props: P, index: number) => R);
export type StencilOrSeparate<T> = T | { front: T, back: T };
export type BlendOrSeparate<T> = T | { rgb: T, alpha: T };

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

export interface Textures<P> {
    [name: string]: TextureAccessor<P>;
}

export type TextureAccessor<P> = Accessor<P, Texture<TextureInternalFormat>>;

export interface Uniforms<P> { [name: string]: Uniform<P>; }

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
    ;

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
        dev: Device,
        vert: string,
        frag: string,
        {
            textures = {},
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

        const depthDescr = parseDepth(depth);
        const stencilDescr = parseStencil(stencil);
        const blendDescr = parseBlend(blend);

        return new Command(
            dev,
            vert,
            frag,
            textures,
            uniforms,
            depthDescr,
            stencilDescr,
            blendDescr,
        );
    }

    readonly glProgram: WebGLProgram | null;
    readonly depthDescr: DepthDescriptor | null;
    readonly stencilDescr: StencilDescriptor | null;
    readonly blendDescr: BlendDescriptor | null;
    readonly textureAccessors: TextureAccessor<P>[];
    readonly uniformDescrs: UniformDescriptor<P>[];

    private dev: Device;
    private vsSource: string;
    private fsSource: string;
    private textures: Textures<P>;
    private uniforms: Uniforms<P>;

    private constructor(
        dev: Device,
        vsSource: string,
        fsSource: string,
        textures: Textures<P>,
        uniforms: Uniforms<P>,
        depthDescr?: DepthDescriptor,
        stencilDescr?: StencilDescriptor,
        blendDescr?: BlendDescriptor,
    ) {
        this.dev = dev;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.textures = textures;
        this.uniforms = uniforms;
        this.depthDescr = depthDescr || null;
        this.stencilDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;
        this.glProgram = null;
        this.textureAccessors = [];
        this.uniformDescrs = [];

        this.init();
    }

    /**
     * Force command reinitialization.
     */
    init(): void {
        const {
            dev: { gl, [SYM_STACK_PROGRAM]: stackProgram },
            vsSource,
            fsSource,
            textures,
            uniforms,
        } = this;

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(gl, vs, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        stackProgram.push(prog);

        // Texture declarations are evaluated in two phases:
        // 1) Sampler location offsets are sent to the shader eagerly
        // 2) Textures are bound to the locations at draw time
        // Note that Object.entries provides values in a nondeterministic order,
        // but we store the descriptors in an array, remembering the order.

        const textureAccessors: TextureAccessor<P>[] = [];
        Object.entries(textures).forEach(([ident, t], i) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for sampler: ${ident}`);
            }
            gl.uniform1i(loc, i);
            textureAccessors.push(t);
        });

        // Some uniform declarations can be evaluated right away, so do it at
        // init-time. Create a descriptor for the rest that is evaluated at
        // render-time.

        const uniformDescrs: UniformDescriptor<P>[] = [];
        Object.entries(uniforms).forEach(([ident, u]) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }
            if (typeof u.value !== "function") {
                // Eagerly send everything we can process now to GPU
                switch (u.type) {
                    case "1f":
                        gl.uniform1f(loc, u.value);
                        break;
                    case "1fv":
                        gl.uniform1fv(loc, u.value);
                        break;
                    case "1i":
                        gl.uniform1i(loc, u.value);
                        break;
                    case "1iv":
                        gl.uniform1iv(loc, u.value);
                        break;
                    case "1ui":
                        gl.uniform1ui(loc, u.value);
                        break;
                    case "1uiv":
                        gl.uniform1uiv(loc, u.value);
                        break;
                    case "2f": {
                        const [x, y] = u.value;
                        gl.uniform2f(loc, x, y);
                        break;
                    }
                    case "2fv":
                        gl.uniform2fv(loc, u.value);
                        break;
                    case "2i": {
                        const [x, y] = u.value;
                        gl.uniform2i(loc, x, y);
                        break;
                    }
                    case "2iv":
                        gl.uniform2iv(loc, u.value);
                        break;
                    case "2ui": {
                        const [x, y] = u.value;
                        gl.uniform2ui(loc, x, y);
                        break;
                    }
                    case "2uiv":
                        gl.uniform2uiv(loc, u.value);
                        break;
                    case "3f": {
                        const [x, y, z] = u.value;
                        gl.uniform3f(loc, x, y, z);
                        break;
                    }
                    case "3fv":
                        gl.uniform3fv(loc, u.value);
                        break;
                    case "3i": {
                        const [x, y, z] = u.value;
                        gl.uniform3i(loc, x, y, z);
                        break;
                    }
                    case "3iv":
                        gl.uniform3iv(loc, u.value);
                        break;
                    case "3ui": {
                        const [x, y, z] = u.value;
                        gl.uniform3ui(loc, x, y, z);
                        break;
                    }
                    case "3uiv":
                        gl.uniform3uiv(loc, u.value);
                        break;
                    case "4f": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4f(loc, x, y, z, w);
                        break;
                    }
                    case "4fv":
                        gl.uniform4fv(loc, u.value);
                        break;
                    case "4i": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4i(loc, x, y, z, w);
                        break;
                    }
                    case "4iv":
                        gl.uniform4iv(loc, u.value);
                        break;
                    case "4ui": {
                        const [x, y, z, w] = u.value;
                        gl.uniform4ui(loc, x, y, z, w);
                        break;
                    }
                    case "4uiv":
                        gl.uniform4uiv(loc, u.value);
                        break;
                    case "matrix2fv":
                        gl.uniformMatrix2fv(
                            loc,
                            false,
                            u.value,
                        );
                        break;
                    case "matrix3fv":
                        gl.uniformMatrix3fv(
                            loc,
                            false,
                            u.value,
                        );
                        break;
                    case "matrix4fv":
                        gl.uniformMatrix4fv(
                            loc,
                            false,
                            u.value,
                        );
                        break;
                    default: assert.never(u);
                }
            } else {
                // Store a descriptor for lazy values and textures for later use
                uniformDescrs.push(new UniformDescriptor(ident, loc, u));
            }
        });

        stackProgram.pop();

        (this as any).glProgram = prog;
        (this as any).textureAccessors = textureAccessors;
        (this as any).uniformDescrs = uniformDescrs;
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { dev: { gl }, glProgram } = this;
        if (!gl.isProgram(glProgram)) { this.init(); }
    }

    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes: AttributesConfig): AttributesConfig {
        const { dev: { gl }, glProgram } = this;
        return Object.entries(attributes)
            .reduce<AttributesConfig>((accum, [identifier, definition]) => {
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
}

export class DepthDescriptor {
    static equals(left: DepthDescriptor | null, right: DepthDescriptor | null) {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.func !== right.func) { return false; }
        if (left.mask !== right.mask) { return false; }
        if (left.rangeStart !== right.rangeStart) { return false; }
        if (left.rangeEnd !== right.rangeEnd) { return false; }
        return true;
    }

    constructor(
        readonly func: number,
        readonly mask: boolean,
        readonly rangeStart: number,
        readonly rangeEnd: number,
    ) { }
}

export class StencilDescriptor {
    static equals(
        left: StencilDescriptor | null,
        right: StencilDescriptor | null,
    ) {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.fFunc !== right.fFunc) { return false; }
        if (left.bFunc !== right.bFunc) { return false; }
        if (left.fFuncRef !== right.fFuncRef) { return false; }
        if (left.bFuncRef !== right.bFuncRef) { return false; }
        if (left.fFuncMask !== right.fFuncMask) { return false; }
        if (left.bFuncMask !== right.bFuncMask) { return false; }
        if (left.fMask !== right.fMask) { return false; }
        if (left.bMask !== right.bMask) { return false; }
        if (left.fOpFail !== right.fOpFail) { return false; }
        if (left.bOpFail !== right.bOpFail) { return false; }
        if (left.fOpZFail !== right.fOpZFail) { return false; }
        if (left.bOpZFail !== right.bOpZFail) { return false; }
        if (left.fOpZPass !== right.fOpZPass) { return false; }
        if (left.bOpZPass !== right.bOpZPass) { return false; }
        return true;
    }

    constructor(
        readonly fFunc: number,
        readonly bFunc: number,
        readonly fFuncRef: number,
        readonly bFuncRef: number,
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
    static equals(left: BlendDescriptor | null, right: BlendDescriptor | null) {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.srcRGB !== right.srcRGB) { return false; }
        if (left.srcAlpha !== right.srcAlpha) { return false; }
        if (left.dstRGB !== right.dstRGB) { return false; }
        if (left.dstAlpha !== right.dstAlpha) { return false; }
        if (left.eqnRGB !== right.eqnRGB) { return false; }
        if (left.eqnAlpha !== right.eqnAlpha) { return false; }
        if (left.color === right.color) { return true; }
        if (!left.color || !right.color) { return false; }
        if (left.color[0] !== right.color[0]) { return false; }
        if (left.color[1] !== right.color[1]) { return false; }
        if (left.color[2] !== right.color[2]) { return false; }
        if (left.color[3] !== right.color[3]) { return false; }
        return true;
    }

    constructor(
        readonly srcRGB: number,
        readonly srcAlpha: number,
        readonly dstRGB: number,
        readonly dstAlpha: number,
        readonly eqnRGB: number,
        readonly eqnAlpha: number,
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

function createProgram(
    gl: WebGL2RenderingContext,
    vertex: WebGLShader | null,
    fragment: WebGLShader | null,
): WebGLProgram | null {
    const program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);

    gl.linkProgram(program);

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (gl.isContextLost() || linked) { return program; }

    const msg = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link shader program: ${msg}`);
}

function createShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string,
): WebGLShader | null {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (gl.isContextLost() || compiled) { return shader; }

    const msg = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    const prettySource = source
        .split("\n")
        .map((l, i) => `${i + 1}: ${l}`)
        .join("\n");
    throw new Error(`Could not compile shader:\n${msg}\n${prettySource}`);
}
