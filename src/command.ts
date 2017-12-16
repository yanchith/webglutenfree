import * as assert from "./assert";
import * as glutil from "./glutil";
import { Device } from "./device";
import { VertexArray, VertexArrayProps } from "./vertex-array";
import { Texture } from "./texture";
import { Framebuffer } from "./framebuffer";

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

export type Color = [number, number, number, number];

export type AccessorOrValue<P, R> = Accessor<P, R> | R;
export type Accessor<P, R> = (props: P, index: number) => R;

export interface CommandProps<P> {
    vert: string;
    frag: string;
    primitive?: Primitive;
    uniforms?: { [key: string]: Uniform<P> };
    depth?: {
        func: DepthFunction;
        mask?: boolean;
        range?: [number, number];
    };
    blend?: {
        func: {
            src: BlendFunction | { rgb: BlendFunction; alpha: BlendFunction };
            dst: BlendFunction | { rgb: BlendFunction; alpha: BlendFunction };
        };
        equation?: BlendEquation | { rgb: BlendEquation; alpha: BlendEquation };
        color?: Color;
    };
    framebuffer?: AccessorOrValue<P, Framebuffer>;
}

export const enum Primitive {
    TRIANGLES = "triangles",
    TRIANGLE_STRIP = "triangle-strip",
    TRIANGLE_FAN = "triangle-fan",
    POINTS = "points",
    LINES = "lines",
    LINE_STRIP = "line-strip",
    LINE_LOOP = "line-loop",
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

export const enum DepthFunction {
    ALWAYS = "always",
    NEVER = "never",
    EQUAL = "equal",
    NOTEQUAL = "notequal",
    LESS = "less",
    LEQUAL = "lequal",
    GREATER = "greater",
    GEQUAL = "gequal",
}

export const enum BlendFunction {
    ZERO = "zero",
    ONE = "one",
    SRC_COLOR = "src-color",
    SRC_ALPHA = "src-alpha",
    ONE_MINUS_SRC_COLOR = "one-minus-src-color",
    ONE_MINUS_SRC_ALPHA = "one-minus-src-alpha",
    DST_COLOR = "dst-color",
    DST_ALPHA = "dst-alpha",
    ONE_MINUS_DST_COLOR = "one-minus-dst-color",
    ONE_MINUS_DST_ALPHA = "one-minus-dst-alpha",
    CONSTANT_COLOR = "constant-color",
    CONSTANT_ALPHA = "constant-alpha",
    ONE_MINUS_CONSTANT_COLOR = "one-minus-constant-color",
    ONE_MINUS_CONSTANT_ALPHA = "one-minus-constant-alpha",
}

export const enum BlendEquation {
    ADD = "add",
    SUBTRACT = "subtract",
    REVERSE_SUBTRACT = "reverse-subtract",
    MIN = "min",
    MAX = "max",
}

export class Command<P = void> {

    static create<P = void>(
        dev: WebGL2RenderingContext | Device,
        {
            vert,
            frag,
            uniforms = {},
            primitive = Primitive.TRIANGLES,
            depth,
            blend,
            framebuffer,
        }: CommandProps<P>,
    ): Command<P> {
        const gl = dev instanceof Device ? dev.gl : dev;
        const vertShader = glutil.createShader(gl, gl.VERTEX_SHADER, vert);
        const fragShader = glutil.createShader(gl, gl.FRAGMENT_SHADER, frag);
        const program = glutil.createProgram(gl, vertShader, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        const uniformDescriptors = Object.entries(uniforms)
            .map(([identifier, uniform]) => {
                const location = gl.getUniformLocation(program, identifier);
                if (!location) {
                    throw new Error(`No location for uniform: ${identifier}`);
                }
                return new UniformDescriptor(identifier, location, uniform);
            });

        if (depth) {
            assert.requireNonNull(depth.func, "depth.func");
        }
        const depthDescriptor = depth
            ? new DepthDescriptor(
                mapGlDepthFunc(gl, depth.func || DepthFunction.LESS),
                typeof depth.mask === "boolean" ? depth.mask : true,
                depth.range ? depth.range[0] : 0,
                depth.range ? depth.range[1] : 1,
            )
            : undefined;

        if (blend) {
            assert.requireNonNull(blend.func, "blend.func");
            assert.requireNonNull(blend.func.src, "blend.func.src");
            assert.requireNonNull(blend.func.dst, "blend.func.dst");
            if (typeof blend.func.src === "object") {
                assert.requireNonNull(blend.func.src.rgb, "blend.func.src.rgb");
                assert.requireNonNull(blend.func.src.alpha, "blend.func.src.alpha");
            }
            if (typeof blend.func.dst === "object") {
                assert.requireNonNull(blend.func.dst.rgb, "blend.func.dst.rgb");
                assert.requireNonNull(blend.func.dst.alpha, "blend.func.dst.alpha");
            }
        }
        const blendDescriptor = blend
            ? new BlendDescriptor(
                mapGlBlendFunc(
                    gl,
                    typeof blend.func.src === "object"
                        ? blend.func.src.rgb
                        : blend.func.src,
                ),
                mapGlBlendFunc(
                    gl,
                    typeof blend.func.src === "object"
                        ? blend.func.src.alpha
                        : blend.func.src,
                ),
                mapGlBlendFunc(
                    gl,
                    typeof blend.func.dst === "object"
                        ? blend.func.dst.rgb
                        : blend.func.dst,
                ),
                mapGlBlendFunc(
                    gl,
                    typeof blend.func.dst === "object"
                        ? blend.func.dst.alpha
                        : blend.func.dst,
                ),
                mapGlBlendEquation(
                    gl,
                    blend.equation
                        ? typeof blend.equation === "object"
                            ? blend.equation.rgb
                            : blend.equation
                        : BlendEquation.ADD,
                ),
                mapGlBlendEquation(
                    gl,
                    blend.equation
                        ? typeof blend.equation === "object"
                            ? blend.equation.alpha
                            : blend.equation
                        : BlendEquation.ADD,
                ),
                blend.color,
            )
            : undefined;

        const framebufferDescriptor = framebuffer
            ? new FramebufferDescriptor(framebuffer)
            : undefined;

        return new Command(
            gl,
            program,
            mapGlPrimitive(gl, primitive),
            uniformDescriptors,
            depthDescriptor,
            blendDescriptor,
            framebufferDescriptor,
        );
    }

    private constructor(
        private gl: WebGL2RenderingContext,
        private glProgram: WebGLProgram,
        private glPrimitive: number,
        private uniformDescriptors: UniformDescriptor<P>[],
        private depthDescriptor?: DepthDescriptor,
        private blendDescriptor?: BlendDescriptor,
        private framebufferDescriptor?: FramebufferDescriptor<P>,
    ) { }

    execute(
        vao: VertexArray | VertexArray[],
        props: P,
    ): void {
        const { gl, glProgram } = this;

        gl.useProgram(glProgram);

        this.beginDepth();
        this.beginBlend();

        if (Array.isArray(vao)) {
            vao.forEach((v, i) => this.executeInner(v, props, i));
        } else {
            this.executeInner(vao, props, 0);
        }

        this.endBlend();
        this.endDepth();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindVertexArray(null);
    }

    locate({ attributes, elements }: VertexArrayProps): VertexArrayProps {
        type Attributes = VertexArrayProps["attributes"];
        const { gl, glProgram } = this;
        const locatedAttributes = Object.entries(attributes)
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
        return { attributes: locatedAttributes, elements };
    }

    private executeInner(
        vao: VertexArray,
        props: P,
        index: number,
    ): void {
        const gl = this.gl;

        let bufferWidth = gl.drawingBufferWidth;
        let bufferHeight = gl.drawingBufferHeight;

        const fbo = this.framebufferDescriptor
            ? access(props, index, this.framebufferDescriptor.definition)
            : undefined;

        if (fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.glFramebuffer);
            gl.drawBuffers(fbo.glColorAttachments);
            bufferWidth = fbo.width;
            bufferHeight = fbo.height;
        }
        gl.viewport(0, 0, bufferWidth, bufferHeight);

        this.updateUniforms(props, index);

        gl.bindVertexArray(vao.glVertexArrayObject);
        if (vao.hasElements) {
            this.drawElements(vao.count, vao.instanceCount);
        } else {
            this.drawArrays(vao.count, vao.instanceCount);
        }
    }

    private beginDepth(): void {
        const { gl, depthDescriptor } = this;
        if (depthDescriptor) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(depthDescriptor.func);
            gl.depthMask(depthDescriptor.mask);
            gl.depthRange(depthDescriptor.rangeStart, depthDescriptor.rangeEnd);
        }
    }

    private endDepth(): void {
        const { gl, depthDescriptor } = this;
        if (depthDescriptor) { gl.disable(gl.DEPTH_TEST); }
    }

    private beginBlend(): void {
        const { gl, blendDescriptor } = this;
        if (blendDescriptor) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(
                blendDescriptor.srcRGB,
                blendDescriptor.dstRGB,
                blendDescriptor.srcAlpha,
                blendDescriptor.dstAlpha,
            );
            gl.blendEquationSeparate(
                blendDescriptor.equationRGB,
                blendDescriptor.equationAlpha,
            );
            if (blendDescriptor.color) {
                const [r, g, b, a] = blendDescriptor.color;
                gl.blendColor(r, g, b, a);
            }
        }
    }

    private endBlend(): void {
        const { gl, blendDescriptor } = this;
        if (blendDescriptor) { gl.disable(gl.BLEND); }
    }

    private drawArrays(count: number, instCount: number): void {
        const { gl, glPrimitive } = this;
        if (instCount) {
            gl.drawArraysInstanced(glPrimitive, 0, count, instCount);
        } else {
            gl.drawArrays(glPrimitive, 0, count);
        }
    }

    private drawElements(count: number, instCount: number): void {
        const { gl, glPrimitive } = this;
        if (instCount) {
            gl.drawElementsInstanced(
                glPrimitive,
                count,
                gl.UNSIGNED_INT, // We only support u32 indices
                0,
                instCount,
            );
        } else {
            gl.drawElements(
                glPrimitive,
                count,
                gl.UNSIGNED_INT, // We only support u32 indices
                0,
            );
        }
    }

    private updateUniforms(props: P, index: number): void {
        const gl = this.gl;

        let textureUnitOffset = 0;

        this.uniformDescriptors.forEach(({
            identifier: ident,
            location: loc,
            definition: def,
        }) => {
            switch (def.type) {
                case "1f":
                    gl.uniform1f(loc, access(props, index, def.value));
                    break;
                case "1fv":
                    gl.uniform1fv(loc, access(props, index, def.value));
                    break;
                case "1i":
                    gl.uniform1i(loc, access(props, index, def.value));
                    break;
                case "1iv":
                    gl.uniform1iv(loc, access(props, index, def.value));
                    break;
                case "1ui":
                    gl.uniform1ui(loc, access(props, index, def.value));
                    break;
                case "1uiv":
                    gl.uniform1uiv(loc, access(props, index, def.value));
                    break;
                case "2f": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2f(loc, x, y);
                    break;
                }
                case "2fv":
                    gl.uniform2fv(loc, access(props, index, def.value));
                    break;
                case "2i": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2i(loc, x, y);
                    break;
                }
                case "2iv":
                    gl.uniform2iv(loc, access(props, index, def.value));
                    break;
                case "2ui": {
                    const [x, y] = access(props, index, def.value);
                    gl.uniform2ui(loc, x, y);
                    break;
                }
                case "2uiv":
                    gl.uniform2uiv(loc, access(props, index, def.value));
                    break;
                case "3f": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3f(loc, x, y, z);
                    break;
                }
                case "3fv":
                    gl.uniform3fv(loc, access(props, index, def.value));
                    break;
                case "3i": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3i(loc, x, y, z);
                    break;
                }
                case "3iv":
                    gl.uniform3iv(loc, access(props, index, def.value));
                    break;
                case "3ui": {
                    const [x, y, z] = access(props, index, def.value);
                    gl.uniform3ui(loc, x, y, z);
                    break;
                }
                case "3uiv":
                    gl.uniform3uiv(loc, access(props, index, def.value));
                    break;
                case "4f": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4f(loc, x, y, z, w);
                    break;
                }
                case "4fv":
                    gl.uniform4fv(loc, access(props, index, def.value));
                    break;
                case "4i": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4i(loc, x, y, z, w);
                    break;
                }
                case "4iv":
                    gl.uniform4iv(loc, access(props, index, def.value));
                    break;
                case "4ui": {
                    const [x, y, z, w] = access(props, index, def.value);
                    gl.uniform4ui(loc, x, y, z, w);
                    break;
                }
                case "4uiv":
                    gl.uniform4uiv(loc, access(props, index, def.value));
                    break;
                case "matrix2fv":
                    gl.uniformMatrix2fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                case "matrix3fv":
                    gl.uniformMatrix3fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                case "matrix4fv":
                    gl.uniformMatrix4fv(
                        loc,
                        false,
                        access(props, index, def.value),
                    );
                    break;
                case "texture":
                    // TODO: is this the best way? (is it fast? can we cache?)
                    const texture = access(props, index, def.value);
                    const currentTexture = textureUnitOffset++;
                    gl.activeTexture(gl.TEXTURE0 + currentTexture);
                    gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
                    gl.uniform1i(loc, currentTexture);
                    break;
                default:
                    assert.never(def, `Unknown uniform type: (${ident})`);
                    break;
            }
        });
    }
}

function access<P, R>(
    props: P,
    index: number,
    value: ((props: P, index: number) => R) | R,
): R {
    return typeof value === "function" ? value(props, index) : value;
}

class DepthDescriptor {
    constructor(
        readonly func: number,
        readonly mask: boolean,
        readonly rangeStart: number,
        readonly rangeEnd: number,
    ) { }
}

class BlendDescriptor {
    constructor(
        readonly srcRGB: number,
        readonly srcAlpha: number,
        readonly dstRGB: number,
        readonly dstAlpha: number,
        readonly equationRGB: number,
        readonly equationAlpha: number,
        readonly color?: Color,
    ) { }
}

class FramebufferDescriptor<P> {
    constructor(readonly definition: AccessorOrValue<P, Framebuffer>) { }
}

class UniformDescriptor<P> {
    constructor(
        readonly identifier: string,
        readonly location: WebGLUniformLocation,
        readonly definition: Uniform<P>,
    ) { }
}

function mapGlPrimitive(
    gl: WebGL2RenderingContext,
    primitive: Primitive,
): number {
    switch (primitive) {
        case Primitive.TRIANGLES: return gl.TRIANGLES;
        case Primitive.TRIANGLE_STRIP: return gl.TRIANGLE_STRIP;
        case Primitive.TRIANGLE_FAN: return gl.TRIANGLE_FAN;
        case Primitive.POINTS: return gl.POINTS;
        case Primitive.LINES: return gl.LINES;
        case Primitive.LINE_STRIP: return gl.LINE_STRIP;
        case Primitive.LINE_LOOP: return gl.LINE_LOOP;
        default: return assert.never(primitive);
    }
}

function mapGlDepthFunc(
    gl: WebGL2RenderingContext,
    func: DepthFunction,
): number {
    switch (func) {
        case DepthFunction.ALWAYS: return gl.ALWAYS;
        case DepthFunction.NEVER: return gl.NEVER;
        case DepthFunction.EQUAL: return gl.EQUAL;
        case DepthFunction.NOTEQUAL: return gl.NOTEQUAL;
        case DepthFunction.LESS: return gl.LESS;
        case DepthFunction.LEQUAL: return gl.LEQUAL;
        case DepthFunction.GREATER: return gl.GREATER;
        case DepthFunction.GEQUAL: return gl.GEQUAL;
        default: return assert.never(func);
    }
}

function mapGlBlendFunc(
    gl: WebGL2RenderingContext,
    func: BlendFunction,
): number {
    switch (func) {
        case BlendFunction.ZERO: return gl.ZERO;
        case BlendFunction.ONE: return gl.ONE;
        case BlendFunction.SRC_COLOR: return gl.SRC_COLOR;
        case BlendFunction.SRC_ALPHA: return gl.SRC_ALPHA;
        case BlendFunction.ONE_MINUS_SRC_COLOR: return gl.ONE_MINUS_SRC_COLOR;
        case BlendFunction.ONE_MINUS_SRC_ALPHA: return gl.ONE_MINUS_SRC_ALPHA;
        case BlendFunction.DST_COLOR: return gl.DST_COLOR;
        case BlendFunction.DST_ALPHA: return gl.DST_ALPHA;
        case BlendFunction.ONE_MINUS_DST_COLOR: return gl.ONE_MINUS_DST_COLOR;
        case BlendFunction.ONE_MINUS_DST_ALPHA: return gl.ONE_MINUS_DST_ALPHA;
        case BlendFunction.CONSTANT_COLOR: return gl.CONSTANT_COLOR;
        case BlendFunction.CONSTANT_ALPHA: return gl.CONSTANT_ALPHA;
        case BlendFunction.ONE_MINUS_CONSTANT_COLOR:
            return gl.ONE_MINUS_CONSTANT_COLOR;
        case BlendFunction.ONE_MINUS_CONSTANT_ALPHA:
            return gl.ONE_MINUS_CONSTANT_ALPHA;
        default: return assert.never(func);
    }
}

function mapGlBlendEquation(
    gl: WebGL2RenderingContext,
    equation: BlendEquation,
): number {
    switch (equation) {
        case BlendEquation.ADD: return gl.FUNC_ADD;
        case BlendEquation.SUBTRACT: return gl.FUNC_SUBTRACT;
        case BlendEquation.REVERSE_SUBTRACT: return gl.FUNC_REVERSE_SUBTRACT;
        case BlendEquation.MIN: return gl.MIN;
        case BlendEquation.MAX: return gl.MAX;
        default: return assert.never(equation);
    }
}
