import * as assert from "./assert";
import * as glutil from "./glutil";
import { VertexArray, VertexArrayProps } from "./vertex-array";
import { Texture } from "./texture";
import { Framebuffer } from "./framebuffer";

const INT_PATTERN = /^0|[1-9]\d*$/;
const UNKNOWN_ATTRIB_LOCATION = -1;

export interface RenderPassProps<P> {
    vert: string;
    frag: string;
    uniforms?: { [key: string]: Uniform<P> };
}

export class RenderPass<P = void> {

    static fromProps<P = void>(
        gl: WebGL2RenderingContext,
        { vert, frag, uniforms = {} }: RenderPassProps<P>,
    ): RenderPass<P> {
        const vertShader = glutil.createShader(gl, gl.VERTEX_SHADER, vert);
        const fragShader = glutil.createShader(gl, gl.FRAGMENT_SHADER, frag);
        const program = glutil.createProgram(gl, vertShader, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        const uniformInfo = Object.entries(uniforms)
            .map(([identifier, uniform]) => {
                const location = gl.getUniformLocation(program, identifier);
                if (!location) {
                    throw new Error(`No location for uniform: ${identifier}`);
                }
                return new UniformInfo(identifier, location, uniform);
            });
        return new RenderPass(gl, program, uniformInfo);
    }


    private gl: WebGL2RenderingContext;
    private glProgram: WebGLProgram;
    private uniformInfo: UniformInfo<P>[];

    private constructor(
        gl: WebGL2RenderingContext,
        program: WebGLProgram,
        uniformInfo: UniformInfo<P>[],
    ) {
        this.gl = gl;
        this.glProgram = program;
        this.uniformInfo = uniformInfo;
    }

    render(
        vao: VertexArray,
        props: P,
        count?: number,
        instanceCount?: number,
    ): void {
        const gl = this.gl;
        const elemCount = typeof count === "undefined"
            ? vao.count
            : Math.min(vao.count, count);
        const instCount = typeof instanceCount === "undefined"
            ? vao.instanceCount
            : Math.min(vao.instanceCount, instanceCount);

        gl.useProgram(this.glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVao);

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.draw(elemCount, instCount);

        gl.bindVertexArray(null);
    }

    renderToFramebuffer(
        vao: VertexArray,
        props: P,
        framebuffer: Framebuffer,
        count?: number,
        instanceCount?: number,
    ): void {
        const gl = this.gl;
        const elemCount = typeof count === "undefined"
            ? vao.count
            : Math.min(vao.count, count);
        const instCount = typeof instanceCount === "undefined"
            ? vao.instanceCount
            : Math.min(vao.instanceCount, instanceCount);

        gl.useProgram(this.glProgram);
        this.updateUniforms(props);
        gl.bindVertexArray(vao.glVao);

        framebuffer.bind();
        gl.drawBuffers(framebuffer.colorAttachments);

        gl.viewport(0, 0, framebuffer.width, framebuffer.height);
        this.draw(elemCount, instCount);

        framebuffer.unbind();

        gl.bindVertexArray(null);
    }

    createVertexArray({ attributes, elements }: VertexArrayProps): VertexArray {
        type VaoAttributes = VertexArrayProps["attributes"];
        const { gl, glProgram } = this;
        const locatedAttributes = Object.entries(attributes)
            .reduce<VaoAttributes>((accum, [identifier, definition]) => {
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
        return VertexArray.fromProps(gl, {
            attributes: locatedAttributes,
            elements,
        });
    }

    private draw(
        elemCount: number,
        instCount: number,
    ): void {
        const gl = this.gl;
        if (instCount) {
            gl.drawElementsInstanced(
                gl.TRIANGLES,
                elemCount,
                gl.UNSIGNED_INT,
                0,
                instCount,
            );
        } else {
            gl.drawElements(gl.TRIANGLES, elemCount, gl.UNSIGNED_INT, 0);
        }
    }

    private updateUniforms(props: P): void {
        const gl = this.gl;

        let textureUnitOffset = 0;

        this.uniformInfo.forEach(({
            identifier: ident,
            location: loc,
            definition: def,
        }) => {
            switch (def.type) {
                case "1f":
                    gl.uniform1f(loc, access(props, def.value));
                    break;
                case "1fv":
                    gl.uniform1fv(loc, access(props, def.value));
                    break;
                case "1i":
                    gl.uniform1i(loc, access(props, def.value));
                    break;
                case "1iv":
                    gl.uniform1iv(loc, access(props, def.value));
                    break;
                case "1ui":
                    gl.uniform1ui(loc, access(props, def.value));
                    break;
                case "1uiv":
                    gl.uniform1uiv(loc, access(props, def.value));
                    break;
                case "2f": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2f(loc, x, y);
                    break;
                }
                case "2fv":
                    gl.uniform2fv(loc, access(props, def.value));
                    break;
                case "2i": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2i(loc, x, y);
                    break;
                }
                case "2iv":
                    gl.uniform2iv(loc, access(props, def.value));
                    break;
                case "2ui": {
                    const [x, y] = access(props, def.value);
                    gl.uniform2ui(loc, x, y);
                    break;
                }
                case "2uiv":
                    gl.uniform2uiv(loc, access(props, def.value));
                    break;
                case "3f": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3f(loc, x, y, z);
                    break;
                }
                case "3fv":
                    gl.uniform3fv(loc, access(props, def.value));
                    break;
                case "3i": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3i(loc, x, y, z);
                    break;
                }
                case "3iv":
                    gl.uniform3iv(loc, access(props, def.value));
                    break;
                case "3ui": {
                    const [x, y, z] = access(props, def.value);
                    gl.uniform3ui(loc, x, y, z);
                    break;
                }
                case "3uiv":
                    gl.uniform3uiv(loc, access(props, def.value));
                    break;
                case "4f": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4f(loc, x, y, z, w);
                    break;
                }
                case "4fv":
                    gl.uniform4fv(loc, access(props, def.value));
                    break;
                case "4i": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4i(loc, x, y, z, w);
                    break;
                }
                case "4iv":
                    gl.uniform4iv(loc, access(props, def.value));
                    break;
                case "4ui": {
                    const [x, y, z, w] = access(props, def.value);
                    gl.uniform4ui(loc, x, y, z, w);
                    break;
                }
                case "4uiv":
                    gl.uniform4uiv(loc, access(props, def.value));
                    break;
                case "matrix2fv":
                    gl.uniformMatrix2fv(loc, false, access(props, def.value));
                    break;
                case "matrix3fv":
                    gl.uniformMatrix3fv(loc, false, access(props, def.value));
                    break;
                case "matrix4fv":
                    gl.uniformMatrix4fv(loc, false, access(props, def.value));
                    break;
                case "texture":
                    // TODO: is this the best way? (is it fast? can we cache?)
                    const texture = access(props, def.value);
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

function access<P, R>(props: P, value: ((props: P) => R) | R): R {
    return typeof value === "function"
        ? value(props)
        : value;
}

class UniformInfo<P> {
    constructor(
        readonly identifier: string,
        readonly location: WebGLUniformLocation,
        readonly definition: Uniform<P>,
    ) { }
}

export type AccessorOrValue<P, R> = Accessor<P, R> | R;
export type Accessor<P, R> = (props: P) => R;

// TODO: support WebGL2 uniforms: unsigneds and XxY matrices

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
