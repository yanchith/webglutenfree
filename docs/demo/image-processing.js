import { Device, Command, VertexArray, Texture } from "./lib/glutenfree.es.js";
import * as square from "./lib/square.js"
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

const KERNEL = kernels.edgeDetect;

const dev = Device.mount();
const [width, height] = [dev.canvasCSSWidth, dev.canvasCSSHeight];

async function run() {
    const imageData = await loadImage("img/lenna.png", true);
    const imageTexture = Texture.fromImage(dev, imageData);

    const cmd = Command.create(
        dev,
        `#version 300 es
            precision mediump float;

            uniform mat4 u_projection, u_model, u_view;

            layout (location = 0) in vec2 a_position;
            layout (location = 1) in vec2 a_tex_coord;

            out vec2 v_tex_coord;

            void main() {
                v_tex_coord = a_tex_coord;
                gl_Position = u_projection
                    * u_view
                    * u_model
                    * vec4(a_position, 0.0, 1.0);
            }
        `,
        `#version 300 es
            precision mediump float;

            uniform sampler2D u_image;
            uniform float[9] u_kernel;
            uniform float u_kernel_weight;

            in vec2 v_tex_coord;

            out vec4 f_color;

            void main() {
                vec2 pix = vec2(1) / vec2(textureSize(u_image, 0));
                float[9] k = u_kernel;
                vec4 color_sum =
                    texture(u_image, v_tex_coord + pix * vec2(-1, -1)) * k[0] +
                    texture(u_image, v_tex_coord + pix * vec2( 0, -1)) * k[1] +
                    texture(u_image, v_tex_coord + pix * vec2( 1, -1)) * k[2] +
                    texture(u_image, v_tex_coord + pix * vec2(-1,  0)) * k[3] +
                    texture(u_image, v_tex_coord + pix * vec2( 0,  0)) * k[4] +
                    texture(u_image, v_tex_coord + pix * vec2( 1,  0)) * k[5] +
                    texture(u_image, v_tex_coord + pix * vec2(-1,  1)) * k[6] +
                    texture(u_image, v_tex_coord + pix * vec2( 0,  1)) * k[7] +
                    texture(u_image, v_tex_coord + pix * vec2( 1,  1)) * k[8] ;
                f_color = vec4((color_sum / u_kernel_weight).rgb, 1.0);
            }
        `,
        {
            uniforms: {
                u_model: {
                    type: "matrix4fv",
                    value: mat4.fromScaling(mat4.create(), [400, 400, 1]),
                },
                u_view: {
                    type: "matrix4fv",
                    value: mat4.identity(mat4.create()),
                },
                u_projection: {
                    type: "matrix4fv",
                    value: mat4.ortho(
                        mat4.create(),
                        -width / 2,
                        width / 2,
                        -height / 2,
                        height / 2,
                        -0.1,
                        1000.0,
                    ),
                },
                u_kernel: {
                    type: "1fv",
                    value: KERNEL,
                },
                u_kernel_weight: {
                    type: "1f",
                    value: computeKernelWeight(KERNEL),
                },
                u_image: {
                    type: "texture",
                    value: imageTexture,
                },
            },
        },
    );

    const screenspaceGeometry = VertexArray.indexed(
        dev,
        square.elements,
        cmd.locate({
            a_position: square.positions,
            a_tex_coord: square.texCoords,
        }),
    );

    dev.target(rt => {
        rt.clearColor(0, 0, 0, 1);
        rt.draw(cmd, screenspaceGeometry);
    })
}

run();
