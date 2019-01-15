/**
 * This example demonstrates a common postprocessing technique called bloom.
 *
 * Bloom technique inspired by https://learnopengl.com/Advanced-Lighting/Bloom
 * Tron line shader inspired by https://www.youtube.com/watch?v=DI498yX-6XM
 */

import {
    Device,
    Extension,
    DepthFunc,
    ElementPrimitive,
    TargetBufferBitmask,
    UniformType,
    Texture2D,
    TextureColorStorageFormat,
    TextureMinFilter,
    TextureMagFilter,
    RenderbufferDepthStorageFormat,
} from "./lib/webglutenfree.js";
import { vec2, mat4 } from "./libx/gl-matrix.js";

import * as uvCube from "./libx/uv-cube.js";

const kernels = {
    blur3: [0.44198, 0.27901],
    blur5: [0.38774, 0.24477, 0.06136],
    blur9: [0.382928, 0.241732, 0.060598, 0.005977, 0.000229],
};

const N_BLOOM_PASSES = 2;
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

const colorTex = dev.createTexture2D(
    width,
    height,
    TextureColorStorageFormat.RGBA32F,
    { min: TextureMinFilter.LINEAR, mag: TextureMagFilter.LINEAR },
);

const depthBuffer = dev.createRenderbuffer(
    width,
    height,
    RenderbufferDepthStorageFormat.DEPTH_COMPONENT24,
);

const pingTex = dev.createTexture2D(
    blurWidth,
    blurHeight,
    TextureColorStorageFormat.RGBA32F,
    { min: TextureMinFilter.LINEAR, mag: TextureMagFilter.LINEAR },
);

const pongTex = dev.createTexture2D(
    blurWidth,
    blurHeight,
    TextureColorStorageFormat.RGBA32F,
    { min: TextureMinFilter.LINEAR, mag: TextureMagFilter.LINEAR },
);

const sceneFbo = dev.createFramebuffer(width, height, colorTex, depthBuffer);
const pingFbo = dev.createFramebuffer(blurWidth, blurHeight, pingTex);
const pongFbo = dev.createFramebuffer(blurWidth, blurHeight, pongTex);

const viewMatrix = mat4.create();

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

interface CmdDrawProps {
    time: number;
}

// Draw the scene as usual
const cmdDraw = dev.createCommand<CmdDrawProps>(
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

        const vec3 COLOR = vec3(0.1, 0.475, 0.811);
        const float EDGE_THICKNESS = 2.0;
        const float EDGE_SHARPNESS = 30.0;
        const float EDGE_SUBTRACT = 0.3;

        void main() {
            vec2 uv = abs(v_tex_coord - 0.5) * EDGE_THICKNESS;
            uv = pow(uv, vec2(EDGE_SHARPNESS)) - EDGE_SUBTRACT;
            float c = clamp(uv.x + uv.y, 0.0, 1.0) * u_glow_strength;
            f_color	= vec4(COLOR * c, 1.0);
        }
    `,
    {
        uniforms: {
            u_model: {
                type: UniformType.FLOAT_MAT4,
                value: mat4.fromScaling(mat4.create(), [30, 30, 30]),
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: ({ time }) => mat4.lookAt(
                    viewMatrix,
                    [
                        200 * Math.cos(time / 9000),
                        155,
                        200 * Math.sin(time / 9000),
                    ],
                    [0, 0, 0],
                    [0, 1, 0],
                ),
            },
            u_projection: {
                type: UniformType.FLOAT_MAT4,
                value: mat4.perspective(
                    mat4.create(),
                    Math.PI / 4,
                    width / height,
                    0.1,
                    1000.0,
                ),
            },
            u_glow_strength: {
                type: UniformType.FLOAT,
                value: ({ time }) => 10 * (Math.cos(time / 2000) + 1),
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

// Separate btight pixels into a separate framebuffer. Bloom works by blurring
// bright areas.
const cmdSep = dev.createCommand(
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
        uniforms: {
            u_image: {
                type: UniformType.SAMPLER_2D,
                value: colorTex,
            },
        },
    },
);

// Blur the input texture, write results to the output texture. Blur occurs
// along one axis only to save performance. This has to be called twice to
// achieve a full 2d blur.
// Except for the 0-th pixel, we will sample the texture between pixels with
// stride of 2 pixels. Linear sampling will provide interpolated values.
// This extends the reach of blur without adversely affecting output too much,
// allowing us to use fewer blur passes to the same effect.

interface CmdBlurProps {
    source: Texture2D<TextureColorStorageFormat>;
    direction: vec2;
}

const cmdBlur = dev.createCommand<CmdBlurProps>(
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        const int KERNEL_LENGTH = int(${KERNEL.length});

        uniform sampler2D u_image;
        uniform float[KERNEL_LENGTH] u_kernel;
        uniform vec2 u_direction;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec2 two_px = u_direction * vec2(2) / vec2(textureSize(u_image, 0));
            vec2 half_px = two_px / 4.0;

            vec4 color_sum = u_kernel[0] * texture(u_image, v_tex_coord);
            for (int i = 1; i < KERNEL_LENGTH; i++) {
                float k = u_kernel[i];
                vec2 offset = two_px * float(i) - half_px;
                color_sum += k * texture(u_image,  offset + v_tex_coord);
                color_sum += k * texture(u_image, -offset + v_tex_coord);
            }

            f_color = color_sum;
        }
    `,
    {
        uniforms: {
            u_kernel: {
                type: UniformType.FLOAT,
                value: KERNEL,
            },
            u_direction: {
                type: UniformType.FLOAT_VEC2,
                value: ({ direction }) => direction,
            },
            u_image: {
                type: UniformType.SAMPLER_2D,
                value: ({ source }) => source,
            },
        },
    },
);

// Merge the original renderd scene with the blurred highlights, performing
// tonemapping along the way.
const cmdMerge = dev.createCommand(
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
        uniforms: {
            u_image_color: {
                type: UniformType.SAMPLER_2D,
                value: colorTex,
            },
            u_image_bloom: {
                type: UniformType.SAMPLER_2D,
                value: pingTex,
            },
        },
    },
);


const screenspaceAttrs = dev.createEmptyAttributes(
    ElementPrimitive.TRIANGLE_LIST,
    3,
);
const modelAttrs = dev.createAttributes(uvCube.elements, {
    0: uvCube.positions,
    1: uvCube.uvs,
});


const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(0, 1);

const loop = (time: number): void => {
    // Render geometry into texture
    sceneFbo.target((rt) => {
        rt.clear(TargetBufferBitmask.COLOR_DEPTH);
        rt.draw(cmdDraw, modelAttrs, { time });
    });

    // Separate bright colors to ping texture
    pingFbo.target((rt) => rt.draw(cmdSep, screenspaceAttrs));

    // Repeat as many blur passes as wanted...
    for (let i = 0; i < N_BLOOM_PASSES; i++) {
        pongFbo.target((rt) => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: pingTex,
                direction: HORIZONTAL,
            });
        });
        pingFbo.target((rt) => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: pongTex,
                direction: VERTICAL,
            });
        });
    }

    // Blend together blurred highlights with original color, tonemap
    // Since textures are sampled, they can be of different sizes
    dev.target((rt) => {
        rt.draw(cmdMerge, screenspaceAttrs);
    });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
