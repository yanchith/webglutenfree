import * as assert from "./util/assert";
import { process } from "./util/process-shim";
import { TextureInternalFormat } from "./texture";

export type Device = import ("./device").Device;
export type Texture<T> = import ("./texture").Texture<T>;
export type AttributesConfig = import ("./attributes").AttributesConfig;

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

/**
 * Tracks binding of `Command`s for each `Device`. Each `Device` must have at
 * most one `Command` bound at any time. Nested command binding is not supported
 * even though it is not prohibited by the shape of the API:
 *
 * // This produces a runtime error
 * dev.target((rt) => {
 *     rt.batch(cmd, (draw) => {
 *         rt.draw(cmd, attrs, props);
 *     });
 * });
 *
 * WeakSet is used instead of `private static` variables, as there can be
 * multiple `Device`s owning the commands.
 */
export const COMMAND_BINDINGS = new WeakSet<Device>();

export type Accessor<P, R> = R | ((props: P, index: number) => R);
export type TextureAccessor<P> = Accessor<P, Texture<TextureInternalFormat>>;

export interface Textures<P> { [name: string]: TextureAccessor<P>; }
export interface Uniforms<P> { [name: string]: Uniform<P>; }

export type SingleOrSeparateFrontBack<T> = T | { front: T, back: T };
export type SingleOrSeparateRgbAlpha<T> = T | { rgb: T, alpha: T };

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

    static create<P = void>(
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
        assert.nonNull(vert, fmtParamNonNull("vert"));
        assert.nonNull(frag, fmtParamNonNull("frag"));

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
    readonly depthTestDescr: DepthTestDescriptor | null;
    readonly stencilTestDescr: StencilTestDescriptor | null;
    readonly blendDescr: BlendDescriptor | null;
    readonly textureAccessors!: TextureAccessor<P>[];
    readonly uniformDescrs!: UniformDescriptor<P>[];

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
        depthDescr?: DepthTestDescriptor,
        stencilDescr?: StencilTestDescriptor,
        blendDescr?: BlendDescriptor,
    ) {
        this.dev = dev;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.textures = textures;
        this.uniforms = uniforms;
        this.depthTestDescr = depthDescr || null;
        this.stencilTestDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;
        this.glProgram = null;

        this.init();
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { dev: { _gl }, glProgram } = this;
        if (!_gl.isProgram(glProgram)) { this.init(); }
    }

    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes: AttributesConfig): AttributesConfig {
        const { dev: { _gl }, glProgram } = this;
        return Object.entries(attributes)
            .reduce<AttributesConfig>((accum, [identifier, definition]) => {
                if (INT_PATTERN.test(identifier)) {
                    accum[identifier] = definition;
                } else {
                    const location = _gl.getAttribLocation(
                        glProgram,
                        identifier,
                    );
                    if (location === UNKNOWN_ATTRIB_LOCATION) {
                        throw new Error(`No location for attrib: ${identifier}`);
                    }
                    accum[location] = definition;
                }
                return accum;
            }, {});
    }

    private init(): void {
        const {
            dev,
            dev: { _gl: gl },
            vsSource,
            fsSource,
            textures,
            uniforms,
        } = this;

        // We would overwrite the currently bound program unless we checked
        if (COMMAND_BINDINGS.has(dev)) {
            throw new Error("A command for this device is already bound");
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(gl, vs, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        // Validation time! (only for nonproduction envs)

        if (process.env.NODE_ENV !== "production") {
            if (!prog) {
                // ctx loss or not, we can panic all we want in nonprod env!
                throw new Error("Program was not compiled, possible reason: context loss");
            }
            validateUniformDeclarations(gl, prog, uniforms, textures);
        }

        gl.useProgram(prog);

        // Texture declarations are evaluated in two phases:
        // 1) Sampler location offsets are sent to the shader eagerly. This is
        //    ok because even if the textures themselves can change (function
        //    accessors), their offsets stay the same
        // 2) Textures provided by the accessor are activated and bound to their
        //    locations at draw time
        // Note: Object.entries() provides values in a nondeterministic order,
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
                    default: assert.unreachable(u);
                }
            } else {
                // Store a descriptor for lazy values for later use
                uniformDescrs.push(new UniformDescriptor(ident, loc, u));
            }
        });

        gl.useProgram(null);

        (this as any).glProgram = prog;
        (this as any).textureAccessors = textureAccessors;
        (this as any).uniformDescrs = uniformDescrs;
    }
}

export class DepthTestDescriptor {
    constructor(
        readonly func: number,
        readonly mask: boolean,
        readonly rangeStart: number,
        readonly rangeEnd: number,
    ) { }
}

export class StencilTestDescriptor {
    constructor(
        readonly fFn: number,
        readonly bFn: number,
        readonly fFnRef: number,
        readonly bFnRef: number,
        readonly fFnMask: number,
        readonly bFnMask: number,
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
): DepthTestDescriptor | undefined {
    if (!depth) { return undefined; }
    assert.nonNull(depth.func, fmtParamNonNull("depth.func"));
    return new DepthTestDescriptor(
        depth.func || DepthFunc.LESS,
        typeof depth.mask === "boolean" ? depth.mask : true,
        depth.range ? depth.range[0] : 0,
        depth.range ? depth.range[1] : 1,
    );
}

function parseStencil(
    stencil: CommandOptions<void>["stencil"],
): StencilTestDescriptor | undefined {
    if (!stencil) { return undefined; }
    assert.nonNull(stencil.func, fmtParamNonNull("stencil.func"));
    // TODO: complete stencil validation... validation framework?
    return new StencilTestDescriptor(
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
    assert.nonNull(blend.func, fmtParamNonNull("blend.func"));
    assert.nonNull(blend.func.src, fmtParamNonNull("blend.func.src"));
    assert.nonNull(blend.func.dst, fmtParamNonNull("blend.func.dst"));
    if (typeof blend.func.src === "object") {
        assert.nonNull(
            blend.func.src.rgb,
            fmtParamNonNull("blend.func.src.rgb"),
        );
        assert.nonNull(
            blend.func.src.alpha,
            fmtParamNonNull("blend.func.src.alpha"),
        );
    }
    if (typeof blend.func.dst === "object") {
        assert.nonNull(
            blend.func.dst.rgb,
            fmtParamNonNull("blend.func.dst.rgb"),
        );
        assert.nonNull(
            blend.func.dst.alpha,
            fmtParamNonNull("blend.func.dst.alpha"),
        );
    }
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

type UniformTypeDeclaration = Uniform<any>["type"];
interface UniformTypeDeclarations {
    [name: string]: { type: UniformTypeDeclaration };
}
interface TextureDeclarations {
    [name: string]: any;
}

/**
 * Check whether the uniforms declared in shaders and command strictly match.
 * There may be no missing or redundant uniforms on either side and types of
 * provided uniforms must match exactly
 */
function validateUniformDeclarations(
    gl: WebGL2RenderingContext,
    prog: WebGLProgram,
    uniforms: UniformTypeDeclarations,
    textures: TextureDeclarations,
): void {
    const nUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    const progUniforms = new Map<string, WebGLActiveInfo>();

    // Note: gl.getUniformLocation accepts a shorthand for uniform names of
    // basic type arrays (trailing "[0]" can be omitted). Because
    // gl.getActiveUniforms always gives us the full name, we need to widen
    // our mathing to accept the shorthands and pair them with the introspected
    // WebGLActiveInfos
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation
    const shorthands = new Map<string, string>();
    for (let i = 0; i < nUniforms; ++i) {
        const info = gl.getActiveUniform(prog, i)!;
        progUniforms.set(info.name, info);
        if (info.name.endsWith("[0]")) {
            const shorthand = info.name.substring(0, info.name.length - 3);
            shorthands.set(shorthand, info.name);
        }
    }

    // The "list" of uniforms left to check from the program's perspective
    const toCheck = new Set(progUniforms.keys());

    Object.entries(uniforms).map(([name, tyObj]) => {
        const type = tyObj.type;
        // TODO: should we assert array uniforms if we discover it in their names?
        const shorthand = shorthands.has(name) && shorthands.get(name);
        const progUniform = progUniforms.has(name)
            ? progUniforms.get(name)!
            : shorthand && progUniforms.has(shorthand)
                ? progUniforms.get(shorthands.get(name)!)
                : null;
        if (progUniform) {
            validateUniformDeclaration(gl, progUniform, type);
        } else {
            throw new Error(`Redundant uniform [name = ${name}, type = ${type}]`);
        }
        if (shorthand) {
            toCheck.delete(shorthand);
        } else {
            toCheck.delete(name);
        }
    });

    Object.keys(textures).map((name) => {
        if (progUniforms.has(name)) {
            const progUniform = progUniforms.get(name)!;
            validateUniformDeclaration(gl, progUniform, "1i");
        } else {
            throw new Error(`Redundant texture [name = ${name}]`);
        }
        toCheck.delete(name);
    });

    if (toCheck.size) {
        const names = [...toCheck].join(", ");
        throw new Error(`Missing uniforms: ${names}`);
    }
}


function validateUniformDeclaration(
    gl: WebGL2RenderingContext,
    info: WebGLActiveInfo,
    type: UniformTypeDeclaration,
): void {
    switch (type) {
        case "1f":
            assert.equal(info.type, gl.FLOAT, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "1fv":
            assert.equal(info.type, gl.FLOAT, fmtTyMismatch(info.name));
            break;
        case "1i":
            assert.oneOf(info.type, [
                gl.INT,
                gl.SAMPLER_2D,
                // gl.SAMPLER_CUBE,
            ], fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "1iv":
            assert.equal(info.type, gl.INT, fmtTyMismatch(info.name));
            break;
        case "1ui":
            assert.equal(info.type, gl.UNSIGNED_INT, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "1uiv":
            assert.equal(info.type, gl.UNSIGNED_INT, fmtTyMismatch(info.name));
            break;
        case "2f":
            assert.equal(info.type, gl.FLOAT_VEC2, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "2fv":
            assert.equal(info.type, gl.FLOAT_VEC2, fmtTyMismatch(info.name));
            break;
        case "2i":
            assert.equal(info.type, gl.INT_VEC2, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "2iv":
            assert.equal(info.type, gl.INT_VEC2, fmtTyMismatch(info.name));
            break;
        case "2ui":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC2, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "2uiv":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC2, fmtTyMismatch(info.name));
            break;
        case "3f":
            assert.equal(info.type, gl.FLOAT_VEC3, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "3fv":
            assert.equal(info.type, gl.FLOAT_VEC3, fmtTyMismatch(info.name));
            break;
        case "3i":
            assert.equal(info.type, gl.INT_VEC3, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "3iv":
            assert.equal(info.type, gl.INT_VEC3, fmtTyMismatch(info.name));
            break;
        case "3ui":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC3, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "3uiv":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC3, fmtTyMismatch(info.name));
            break;
        case "4f":
            assert.equal(info.type, gl.FLOAT_VEC4, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "4fv":
            assert.equal(info.type, gl.FLOAT_VEC4, fmtTyMismatch(info.name));
            break;
        case "4i":
            assert.equal(info.type, gl.INT_VEC4, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "4iv":
            assert.equal(info.type, gl.INT_VEC4, fmtTyMismatch(info.name));
            break;
        case "4ui":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC4, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "4uiv":
            assert.equal(info.type, gl.UNSIGNED_INT_VEC4, fmtTyMismatch(info.name));
            break;
        case "matrix2fv":
            assert.equal(info.type, gl.FLOAT_MAT2, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "matrix3fv":
            assert.equal(info.type, gl.FLOAT_MAT3, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        case "matrix4fv":
            assert.equal(info.type, gl.FLOAT_MAT4, fmtTyMismatch(info.name));
            assert.equal(info.size, 1);
            break;
        default: assert.unreachable(type);
    }
}

function fmtParamNonNull(name: string): () => string {
    return () => `Missing parameter ${name}`;
}

function fmtTyMismatch(name: string): () => string {
    return () => `Type mismatch for uniform field ${name}`;
}
