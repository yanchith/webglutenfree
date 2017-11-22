import {
    Device,
    Command,
    VertexArray,
    Texture,
    Framebuffer,
} from "./lib/glutenfree.js";
import { loadImage } from "./lib/load-image.js";

const kernels = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0,
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045,
    ],
    unsharpen: [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1,
    ],
    emboss: [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2,
    ],
    edgeDetect: [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1,
    ],
};

function computeKernelWeight(kernel) {
    const weight = kernel.reduce((prev, curr) => prev + curr);
    return weight <= 0 ? 1 : weight;
}

const currentKernel = kernels.edgeDetect;

const dev = Device.createAndMount();
const [w, h] = [dev.bufferWidth, dev.bufferHeight];

async function run() {
    const imageData = await loadImage("img/lenna.png", true);
    const imageTexture = Texture.fromImage(dev, imageData);
    const fboTexture = Texture.RGBA8FromRGBAUint8Array(
        dev,
        null,
        imageData.width,
        imageData.height,
    );
    const fbo = Framebuffer.create(dev, [fboTexture]);

    const texturePass = Command.create(dev, {
        vert: `#version 300 es
            precision mediump float;

            in vec4 a_vertex_position;
            in vec2 a_tex_coord;

            out vec2 v_tex_coord;

            void main() {
                v_tex_coord = a_tex_coord;
                gl_Position = a_vertex_position;
            }
        `,
        frag: `#version 300 es
            uniform sampler2D u_image;
            precision mediump float;

            in vec2 v_tex_coord;

            out vec4 o_color;

            void main() {
                o_color = texture(u_image, v_tex_coord);
            }
        `,
        uniforms: {
            u_image: {
                type: "texture",
                value: imageTexture,
            },
        },
    });

    const texturePassGeometry = VertexArray.create(dev, texturePass.locate({
        attributes: {
            a_vertex_position: [
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1],
            ],
            a_tex_coord: [
                [1, 1],
                [0, 1],
                [1, 0],
                [0, 0],
            ],
        },
        elements: [
            [0, 3, 2],
            [1, 3, 0],
        ],
    }));

    const kernelPass = Command.create(dev, {
        vert: `#version 300 es
            precision mediump float;

            uniform mat4 u_projection, u_model, u_view;

            in vec2 a_vertex_position;
            in vec2 a_tex_coord;

            out vec2 v_tex_coord;

            void main() {
                v_tex_coord = a_tex_coord;
                gl_Position = u_projection
                    * u_view
                    * u_model
                    * vec4(a_vertex_position, 0.0, 1.0);
            }
        `,
        frag: `#version 300 es
            precision mediump float;

            uniform sampler2D u_image;
            uniform float[9] u_kernel;
            uniform float u_kernel_weight;

            in vec2 v_tex_coord;

            out vec4 o_color;

            void main() {
                vec2 pixel = vec2(1) / vec2(textureSize(u_image, 0));
                vec4 color_sum =
                    texture(u_image, v_tex_coord + pixel * vec2(-1, -1)) * u_kernel[0] +
                    texture(u_image, v_tex_coord + pixel * vec2( 0, -1)) * u_kernel[1] +
                    texture(u_image, v_tex_coord + pixel * vec2( 1, -1)) * u_kernel[2] +
                    texture(u_image, v_tex_coord + pixel * vec2(-1,  0)) * u_kernel[3] +
                    texture(u_image, v_tex_coord + pixel * vec2( 0,  0)) * u_kernel[4] +
                    texture(u_image, v_tex_coord + pixel * vec2( 1,  0)) * u_kernel[5] +
                    texture(u_image, v_tex_coord + pixel * vec2(-1,  1)) * u_kernel[6] +
                    texture(u_image, v_tex_coord + pixel * vec2( 0,  1)) * u_kernel[7] +
                    texture(u_image, v_tex_coord + pixel * vec2( 1,  1)) * u_kernel[8] ;
                o_color = vec4((color_sum / u_kernel_weight).rgb, 1.0);
            }
        `,
        uniforms: {
            u_model: {
                type: "matrix4fv",
                value: mat4.fromScaling(mat4.create(), [1000, 1000, 1]),
            },
            u_view: {
                type: "matrix4fv",
                value: mat4.identity(mat4.create()),
            },
            u_projection: {
                type: "matrix4fv",
                value: mat4.ortho(
                    mat4.create(),
                    -w / 2,
                    w / 2,
                    -h / 2,
                    h / 2,
                    -0.1,
                    1000.0,
                ),
            },
            u_kernel: {
                type: "1fv",
                value: currentKernel,
            },
            u_kernel_weight: {
                type: "1f",
                value: computeKernelWeight(currentKernel),
            },
            u_image: {
                type: "texture",
                value: fboTexture,
            },
        },
    });

    const kernelPassGeometry = VertexArray.create(dev, kernelPass.locate({
        attributes: {
            a_vertex_position: [
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1],
            ],
            a_tex_coord: [
                [1, 1],
                [0, 1],
                [1, 0],
                [0, 0],
            ],
        },
        elements: [
            [0, 3, 2],
            [1, 3, 0],
        ],
    }));

    texturePass.execute(texturePassGeometry, undefined, fbo);
    kernelPass.execute(kernelPassGeometry);
}

run();
