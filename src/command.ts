import * as assert from "./util/assert";
import { IS_DEBUG_BUILD } from "./util/env";
import {
    State,
    DepthTestDescriptor,
    StencilTestDescriptor,
    BlendDescriptor,
} from "./state";
import { AttributesConfig } from "./attributes";
import { Texture2D, TextureCubeMap, TextureStorageFormat } from "./texture";

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

export enum UniformType {
    FLOAT = 0x1406,
    FLOAT_VEC2 = 0x8B50,
    FLOAT_VEC3 = 0x8B51,
    FLOAT_VEC4 = 0x8B52,

    INT = 0x1404,
    INT_VEC2 = 0x8B53,
    INT_VEC3 = 0x8B54,
    INT_VEC4 = 0x8B55,

    UNSIGNED_INT = 0x1405,
    UNSIGNED_INT_VEC2 = 0x8DC6,
    UNSIGNED_INT_VEC3 = 0x8DC7,
    UNSIGNED_INT_VEC4 = 0x8DC8,

    FLOAT_MAT2 = 0x8B5A,
    FLOAT_MAT3 = 0x8B5B,
    FLOAT_MAT4 = 0x8B5C,

    SAMPLER_2D = 0x8B5E,
    SAMPLER_CUBE = 0x8B60,

    // TODO: support all uniform types
    // BOOL
}

export type Accessor<P, R> = R | ((props: P, index: number) => R);
export interface Uniforms<P> { [name: string]: Uniform<P>; }

export type SingleOrSeparateFrontBack<T> = T | { front: T, back: T };
export type SingleOrSeparateRgbAlpha<T> = T | { rgb: T, alpha: T };

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
    // TODO(yan): Support face culling.
}

export type Uniform<P> = UniformValue<P> | UniformTextureValue<P>;

export type UniformValue<P> =
    | UniformFloat<P>
    | UniformInt<P>
    | UniformUnsignedInt<P>
    | UniformFloatVec2<P>
    | UniformIntVec2<P>
    | UniformUnsignedIntVec2<P>
    | UniformFloatVec3<P>
    | UniformIntVec3<P>
    | UniformUnsignedIntVec3<P>
    | UniformFloatVec4<P>
    | UniformIntVec4<P>
    | UniformUnsignedIntVec4<P>
    | UniformFloatMat2<P>
    | UniformFloatMat3<P>
    | UniformFloatMat4<P>
    ;

export type UniformTextureValue<P> =
    | UniformTexture2D<P>
    | UniformTextureCubeMap<P>
    ;

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

export type DynamicUniformValue<P> =
    | DynamicUniformFloat<P>
    | DynamicUniformInt<P>
    | DynamicUniformUnsignedInt<P>
    | DynamicUniformFloatVec2<P>
    | DynamicUniformIntVec2<P>
    | DynamicUniformUnsignedIntVec2<P>
    | DynamicUniformFloatVec3<P>
    | DynamicUniformIntVec3<P>
    | DynamicUniformUnsignedIntVec3<P>
    | DynamicUniformFloatVec4<P>
    | DynamicUniformIntVec4<P>
    | DynamicUniformUnsignedIntVec4<P>
    | DynamicUniformFloatMat2<P>
    | DynamicUniformFloatMat3<P>
    | DynamicUniformFloatMat4<P>
    ;

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

export function _createCommand<P = void>(
    state: State,
    vert: string,
    frag: string,
    {
        uniforms = {},
        depth,
        stencil,
        blend,
    }: CommandCreateOptions<P> = {},
): Command<P> {
    assert.isString(vert, fmtParamNonNull("vert"));
    assert.isString(frag, fmtParamNonNull("frag"));

    const depthDescr = parseDepth(depth);
    const stencilDescr = parseStencil(stencil);
    const blendDescr = parseBlend(blend);

    return new Command(
        state,
        vert,
        frag,
        uniforms,
        depthDescr,
        stencilDescr,
        blendDescr,
    );
}

export class Command<P> {

    readonly glProgram!: WebGLProgram; // Assigned in init()

    readonly depthTestDescr: DepthTestDescriptor | null;
    readonly stencilTestDescr: StencilTestDescriptor | null;
    readonly blendDescr: BlendDescriptor | null;

    readonly uniformDescrs!: UniformDescriptor<P>[]; // Assigned in init()
    readonly textureDescrs!: TextureDescriptor<P>[]; // Assigned in init()

    private state: State;
    private vsSource: string;
    private fsSource: string;
    private uniforms: Uniforms<P>;

    constructor(
        state: State,
        vsSource: string,
        fsSource: string,
        uniforms: Uniforms<P>,
        depthDescr?: DepthTestDescriptor,
        stencilDescr?: StencilTestDescriptor,
        blendDescr?: BlendDescriptor,
    ) {
        this.state = state;
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.uniforms = uniforms;
        this.depthTestDescr = depthDescr || null;
        this.stencilTestDescr = stencilDescr || null;
        this.blendDescr = blendDescr || null;

        this.init();
    }

    /**
     * Reinitialize invalid buffer, eg. after context is lost.
     */
    restore(): void {
        const { state: { gl }, glProgram } = this;
        if (!gl.isProgram(glProgram)) { this.init(); }
    }

    /**
     * Transforms names found in the attributes object to numbers representing
     * actual attribute locations for the program in this command.
     */
    locate(attributes: AttributesConfig): AttributesConfig {
        const { state: { gl }, glProgram } = this;
        return Object.entries(attributes)
            .reduce<AttributesConfig>((accum, [identifier, definition]) => {
                if (INT_PATTERN.test(identifier)) {
                    accum[identifier] = definition;
                } else {
                    const location = gl.getAttribLocation(
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
            state,
            state: { gl },
            vsSource,
            fsSource,
            uniforms,
        } = this;

        // `init()` would overwrite and unbind the currently bound
        // `Command`'s program, so assert against it.
        // (`gl.useProgram(null)` is called at the end of `init()`).
        assert.isTrue(
            state.isCommandUnlocked(),
            "Expected Command to be unlocked when performing Program init (would overwrite)",
        );

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const prog = createProgram(gl, vs, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        // Validation time! (only for nonproduction envs)

        if (IS_DEBUG_BUILD) {
            if (!prog) {
                // ctx loss or not, we can panic all we want in nonprod env!
                throw new Error("Program was not compiled, possible reason: context loss");
            }
            validateUniformDeclarations(gl, prog, uniforms);
        }

        gl.useProgram(prog);

        // Some uniform declarations can be evaluated right away, so do it at
        // init-time. Create a descriptor for the rest that is evaluated at
        // render-time.
        //
        // Texture declarations are evaluated in two phases:
        // 1) Texture location offsets are sent to the shader in init time.
        //    This is ok because even if the textures themselves can change (via
        //    function accessors), their offsets stay the same,
        // 2) Textures provided by the accessor are activated and bound to their
        //    locations at draw time.
        // Note: Object.entries() provides values in a nondeterministic order,
        // but we store the descriptors in an array, remembering the order.

        const uniformDescrs: UniformDescriptor<P>[] = [];
        const textureDescrs: TextureDescriptor<P>[] = [];

        Object.entries(uniforms).forEach(([ident, u]) => {
            const loc = gl.getUniformLocation(prog, ident);
            if (!loc) {
                throw new Error(`No location for uniform: ${ident}`);
            }

            // Handle textures first...

            switch (u.type) {
                case UniformType.SAMPLER_2D:
                case UniformType.SAMPLER_CUBE:
                    // The old lenght is the new index to access the texture
                    // under with gl.activeTexture()
                    gl.uniform1i(loc, textureDescrs.length);
                    textureDescrs.push(new TextureDescriptor(ident, u));

                    return;
            }

            // ... and then handle the rest of the uniforms

            if (typeof u.value !== "function") {
                // Eagerly send everything we can process now to GPU

                // TODO: there are additional else if guards as ts inference
                // broke in 3.1 or 3.2, but we are sure that
                // typeof u.value !== "function"

                switch (u.type) {
                    case UniformType.FLOAT:
                        if (typeof u.value === "number") {
                            gl.uniform1f(loc, u.value);
                        } else if (typeof u.value !== "function") {
                            gl.uniform1fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT:
                        if (typeof u.value === "number") {
                            gl.uniform1i(loc, u.value);
                        } else if (typeof u.value !== "function") {
                            gl.uniform1iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT:
                        if (typeof u.value === "number") {
                            gl.uniform1ui(loc, u.value);
                        } else if (typeof u.value !== "function") {
                            gl.uniform1uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC2:
                        if (typeof u.value !== "function") {
                            gl.uniform2uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC3:
                        if (typeof u.value !== "function") {
                            gl.uniform3uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4fv(loc, u.value);
                        }
                        break;
                    case UniformType.INT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4iv(loc, u.value);
                        }
                        break;
                    case UniformType.UNSIGNED_INT_VEC4:
                        if (typeof u.value !== "function") {
                            gl.uniform4uiv(loc, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT2:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix2fv(loc, false, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT3:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix3fv(loc, false, u.value);
                        }
                        break;
                    case UniformType.FLOAT_MAT4:
                        if (typeof u.value !== "function") {
                            gl.uniformMatrix4fv(loc, false, u.value);
                        }
                        break;
                    default: assert.unreachable(u);
                }
            } else {
                // Store a descriptor for lazy values for later use
                uniformDescrs.push(new UniformDescriptor(
                    ident,
                    loc,
                    u as DynamicUniformValue<P>, // TODO: remove cast
                ));
            }
        });

        gl.useProgram(null);

        (this as any).glProgram = prog;
        (this as any).uniformDescrs = uniformDescrs;
        (this as any).textureDescrs = textureDescrs;
    }
}

export class UniformDescriptor<P> {
    constructor(
        readonly identifier: string,
        readonly location: WebGLUniformLocation,
        readonly definition: DynamicUniformValue<P>,
    ) { }
}

export class TextureDescriptor<P> {
    constructor(
        readonly identifier: string,
        readonly definition: UniformTextureValue<P>,
    ) { }
}

function createProgram(
    gl: WebGL2RenderingContext,
    vertex: WebGLShader,
    fragment: WebGLShader,
): WebGLProgram {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("Could not create WebGL program");
    }

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
): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Could not create WebGL shader");
    }

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

type UniformTypeDeclaration = Uniform<unknown>["type"];
interface UniformTypeDeclarations {
    [name: string]: { type: UniformTypeDeclaration };
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
): void {
    const nUniforms = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    const progUniforms = new Map<string, WebGLActiveInfo>();

    // Note: gl.getUniformLocation accepts a shorthand for uniform names of
    // basic type arrays (trailing "[0]" can be omitted). Because
    // gl.getActiveUniforms always gives us the full name, we need to widen
    // our matching to accept the shorthands and pair them with the introspected
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
        const shorthand = shorthands.has(name) && shorthands.get(name);
        const progUniform = progUniforms.has(name)
            ? progUniforms.get(name)!
            : shorthand && progUniforms.has(shorthand)
                ? progUniforms.get(shorthands.get(name)!)
                : null;
        if (progUniform) {
            // TODO: validate array lengths?
            assert.is(
                progUniform.type,
                tyObj.type,
                fmtTyMismatch(progUniform.name),
            );
        } else {
            throw new Error(`Redundant uniform: ${name}`);
        }
        if (shorthand) {
            toCheck.delete(shorthand);
        } else {
            toCheck.delete(name);
        }
    });

    if (toCheck.size) {
        const names = [...toCheck].join(", ");
        throw new Error(`Missing uniforms: ${names}`);
    }
}

function parseDepth(
    depth: CommandCreateOptions<void>["depth"],
): DepthTestDescriptor | undefined {
    if (!depth) { return undefined; }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        assert.isNumber(depth.func, fmtParamNonNull("depth.func"));
    }
    return new DepthTestDescriptor(
        depth.func || DepthFunc.LESS,
        typeof depth.mask === "boolean" ? depth.mask : true,
        depth.range ? depth.range[0] : 0,
        depth.range ? depth.range[1] : 1,
    );
}

function parseStencil(
    stencil: CommandCreateOptions<void>["stencil"],
): StencilTestDescriptor | undefined {
    if (!stencil) { return undefined; }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        assert.isNotNullOrUndefined(stencil.func, fmtParamNonNull("stencil.func"));
    }
    // TODO: complete stencil validation
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
    blend: CommandCreateOptions<void>["blend"],
): BlendDescriptor | undefined {
    if (!blend) { return undefined; }
    // TODO: DCE did not kick in here without help
    if (IS_DEBUG_BUILD) {
        assert.isNotNullOrUndefined(
            blend.func,
            fmtParamNonNull("blend.func"),
        );
        assert.isNotNullOrUndefined(
            blend.func.src,
            fmtParamNonNull("blend.func.src"),
        );
        assert.isNotNullOrUndefined(
            blend.func.dst,
            fmtParamNonNull("blend.func.dst"),
        );
        if (typeof blend.func.src === "object") {
            assert.isNotNullOrUndefined(
                blend.func.src.rgb,
                fmtParamNonNull("blend.func.src.rgb"),
            );
            assert.isNotNullOrUndefined(
                blend.func.src.alpha,
                fmtParamNonNull("blend.func.src.alpha"),
            );
        }
        if (typeof blend.func.dst === "object") {
            assert.isNotNullOrUndefined(
                blend.func.dst.rgb,
                fmtParamNonNull("blend.func.dst.rgb"),
            );
            assert.isNotNullOrUndefined(
                blend.func.dst.alpha,
                fmtParamNonNull("blend.func.dst.alpha"),
            );
        }
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

function fmtParamNonNull(name: string): () => string {
    return () => `Missing parameter ${name}`;
}

function fmtTyMismatch(name: string): () => string {
    return () => `Type mismatch for uniform field ${name}`;
}
