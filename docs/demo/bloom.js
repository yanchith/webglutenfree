/**
 * Bloom technique inspired by https://learnopengl.com/Advanced-Lighting/Bloom
 * Tron line shader inspired by https://www.youtube.com/watch?v=DI498yX-6XM
 */

import {
    Device,
    Extension,
    BufferBits,
    Command,
    DepthFunc,
    Attributes,
    Primitive,
    Texture,
    TextureInternalFormat as TexFmt,
    TextureFilter,
    Framebuffer,
} from "./lib/webglutenfree.js";
import { vec2, mat4 } from "./lib/gl-matrix-min.js";

import * as uvCube from "./lib/uv-cube.js"

const kernels = {
    blur3: [0.44198, 0.27901],
    blur5: [0.38774, 0.24477, 0.06136],
    blur9: [0.382928, 0.241732, 0.060598, 0.005977, 0.000229],
}

const N_BLOOM_PASSES = 4;
const BLUR_TEXTURE_SIZE_FACTOR = 0.5;
const KERNEL = kernels.blur3;

// Use extensions so we can render to 32 bit float textures and use linear
// filtering with them
const dev = Device.create({
    extensions: [
        Extension.EXTColorBufferFloat,
        Extension.OESTextureFloatLinear,
    ],
});
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

// We blur smaller textures for better performance
const [blurWidth, blurHeight] = [
    width * BLUR_TEXTURE_SIZE_FACTOR,
    height * BLUR_TEXTURE_SIZE_FACTOR,
];

const colorTex = Texture.create(dev, width, height, TexFmt.RGBA32F, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});

const depthTex = Texture.create(dev, width, height, TexFmt.DEPTH_COMPONENT24);

const pingTex = Texture.create(dev, blurWidth, blurHeight, TexFmt.RGBA32F, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});

const pongTex = Texture.create(dev, blurWidth, blurHeight, TexFmt.RGBA32F, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});

const sceneFbo = Framebuffer.create(dev, width, height, colorTex, depthTex);
const pingFbo = Framebuffer.create(dev, blurWidth, blurHeight, pingTex);
const pongFbo = Framebuffer.create(dev, blurWidth, blurHeight, pongTex);

const view = mat4.create();

// This vertex shader just renders one huge triangle to cover the screenspace.
const screenspaceVS = `#version 300 es
precision mediump float;

out vec2 v_tex_coord;

void main() {
    switch (gl_VertexID % 3) {
        case 0:
            gl_Position = vec4(-1, 3, 0, 1);
            v_tex_coord = vec2(0, 2);
            break;
        case 1:
            gl_Position = vec4(-1, -1, 0, 1);
            v_tex_coord = vec2(0, 0);
            break;
        case 2:
            gl_Position = vec4(3, -1, 0, 1);
            v_tex_coord = vec2(2, 0);
            break;
    }
}
`;

// Draw the scene as usual
const cmdDraw = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view, u_model;

        layout (location = 0) in vec3 a_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_position, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        uniform float u_glow_strength;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 f_color;

        const vec3 u_color = vec3(0.1, 0.475, 0.811);
        const float u_edge_thickness = 2.0;
        const float u_edge_sharpness = 30.0;
        const float u_edge_subtract	= 0.3;

        void main() {
            vec2 uv = abs(v_tex_coord - 0.5) * u_edge_thickness;
            uv = pow(uv, vec2(u_edge_sharpness)) - u_edge_subtract;
            float c = clamp(uv.x + uv.y, 0.0, 1.0) * u_glow_strength;
            f_color	= vec4(u_color * c, 1.0);
        }
    `,
    {
        uniforms: {
            u_model: {
                type: "matrix4fv",
                value: mat4.fromScaling(mat4.create(), [30, 30, 30]),
            },
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    view,
                    [
                        200 * Math.cos(time / 9000),
                        155,
                        200 * Math.sin(time / 9000),
                    ],
                    [0, 0, 0],
                    [0, 1, 0]
                ),
            },
            u_projection: {
                type: "matrix4fv",
                value: mat4.perspective(
                    mat4.create(),
                    Math.PI / 4,
                    width / height,
                    0.1,
                    1000.0,
                ),
            },
            u_glow_strength: {
                type: "1f",
                value: ({ time }) => 10 * (Math.cos(time / 2000) + 1),
            }
        },
        depth: { func: DepthFunc.LESS },
    },
);

// Separate btight pixels into a separate framebuffer. Bloom works by blurring
// bright areas.
const cmdSep = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform sampler2D u_image;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec4 color = texture(u_image, v_tex_coord);

            // Convert to grayscale and compute brightness
            float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
            f_color = brightness > 0.7 ? color : vec4(0.0, 0.0, 0.0, 1.0);
        }
    `,
    {
        textures: { u_image: colorTex },
    },
);

// Blur the input texture, write results to the output texture. Blur occurs
// along one axis only to save performance. This has to be called twice to
// achieve a full 2d blur.
const cmdBlur = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        #define KERNEL_LENGTH ${KERNEL.length}

        uniform sampler2D u_image;
        uniform float[KERNEL_LENGTH] u_kernel;
        uniform vec2 u_direction;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec2 px_dir = u_direction * vec2(1) / vec2(textureSize(u_image, 0));

            vec4 color_sum = u_kernel[0] * texture(u_image, v_tex_coord);
            for (int i = 1; i < KERNEL_LENGTH; i++) {
                float k = u_kernel[i];
                color_sum += k * texture(u_image,  px_dir * float(i) + v_tex_coord);
                color_sum += k * texture(u_image, -px_dir * float(i) + v_tex_coord);
            }

            f_color = color_sum;
        }
    `,
    {
        textures: { u_image: ({ source }) => source },
        uniforms: {
            u_kernel: {
                type: "1fv",
                value: KERNEL,
            },
            u_direction: {
                type: "2f",
                value: ({ direction }) => direction,
            },
        },
    },
);

// Merge the original renderd scene with the blurred highlights, performing
// tonemapping along the way.
const cmdMerge = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform sampler2D u_image_color;
        uniform sampler2D u_image_bloom;

        in vec2 v_tex_coord;

        out vec4 f_color;

        void main() {
            vec3 color = texture(u_image_color, v_tex_coord).rgb;
            vec3 bloom = texture(u_image_bloom, v_tex_coord).rgb;
            const float gamma = 2.2;

            // Additive blending
            color += bloom;

            // Reinhard tone mapping
            vec3 mapped = color / (color + vec3(1.0));

            // Gamma correction
            mapped = pow(mapped, vec3(1.0 / gamma));

            f_color = vec4(mapped, 1.0);
        }
    `,
    {
        textures: {
            u_image_color: colorTex,
            u_image_bloom: pingTex,
        },
    },
);


const screenspaceAttrs = Attributes.empty(dev, Primitive.TRIANGLES, 3);
const modelAttrs = Attributes.create(dev, uvCube.elements, {
    0: uvCube.positions,
    1: uvCube.uvs,
});


const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(0, 1);

const loop = time => {
    // Render geometry into texture
    sceneFbo.target(rt => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.draw(cmdDraw, modelAttrs, { time });
    });

    // separate bright colors to ping texture
    pingFbo.target(rt => rt.draw(cmdSep, screenspaceAttrs));

    // Repeat as many blur passes as wanted...
    for (let i = 0; i < N_BLOOM_PASSES; i++) {
        pongFbo.target(rt => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: pingTex,
                direction: HORIZONTAL,
            });
        });
        pingFbo.target(rt => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: pongTex,
                direction: VERTICAL,
            });
        });
    }

    // Blend together blurred highlights with original color, tonemap
    // Since textures are sampled, they can be of different sizes
    dev.target(rt => {
        rt.draw(cmdMerge, screenspaceAttrs);
    });

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
