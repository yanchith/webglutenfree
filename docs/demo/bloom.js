/**
 * Bloom technique inspired by https://learnopengl.com/Advanced-Lighting/Bloom
 * Tron line shader inspired by https://www.youtube.com/watch?v=DI498yX-6XM
 */

import {
    Device,
    BufferBits,
    Command,
    DepthFunc,
    Attributes,
    Primitive,
    Texture,
    TextureInternalFormat as TexIntFmt,
    TextureFilter,
    Framebuffer,
} from "./lib/webglutenfree.js";
import { vec2, mat4 } from "./lib/gl-matrix-min.js";

import * as uvCube from "./lib/uv-cube.js"

const kernels = {
    blur3: [0.27901, 0.44198, 0.27901],
    blur5: [0.06136, 0.24477, 0.38774, 0.24477, 0.06136],
    blur9: [
        0.000229,
        0.005977,
        0.060598,
        0.241732,
        0.382928,
        0.241732,
        0.060598,
        0.005977,
        0.000229,
    ],
}

const N_BLOOM_PASSES = 4;
const KERNEL = kernels.blur3;

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

// We blur smaller textures for better performance
const [bWidth, bHeight] = [width / 2, height / 2];

const initialTex = Texture.create(dev, width, height, TexIntFmt.RGBA8, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const depthTex = Texture.create(dev, width, height, TexIntFmt.DEPTH_COMPONENT24, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const initialFbo = Framebuffer.withColorDepth(
    dev,
    width,
    height,
    initialTex,
    depthTex,
);

const splitColorTex = Texture.create(dev, width, height, TexIntFmt.RGBA8, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const splitBrightTex = Texture.create(dev, width, height, TexIntFmt.RGBA8, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const splitFbo = Framebuffer.withColor(dev, width, height, [
    splitColorTex,
    splitBrightTex,
]);

const bloomPingTex = Texture.create(dev, bWidth, bHeight, TexIntFmt.RGBA8, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const bloomPingFbo = Framebuffer.withColor(dev, bWidth, bHeight, bloomPingTex);

const bloomPongTex = Texture.create(dev, bWidth, bHeight, TexIntFmt.RGBA8, {
    min: TextureFilter.LINEAR,
    mag: TextureFilter.LINEAR,
});
const bloomPongFbo = Framebuffer.withColor(dev, bWidth, bHeight, bloomPongTex);

const view = mat4.create();

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

        in vec2 v_tex_coord;

        out vec4 f_color;

        const vec3 u_color = vec3(0.1, 0.775, 0.189);
        const float u_edge_thickness = 2.0;
        const float u_edge_sharpness = 30.0;
        const float u_edge_subtract	= 0.3;
        const float u_glow_strength = 10.0;

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
                    [200 * Math.cos(time / 9000), 200, 200 * Math.sin(time / 9000)],
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
        },
        depth: { func: DepthFunc.LESS },
    },
);

const cmdSplit = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform sampler2D u_image;

        in vec2 v_tex_coord;

        // Set explicit locations for Framebuffer attachments
        layout (location = 0) out vec4 f_color;
        layout (location = 1) out vec4 f_bright;

        void main() {
            vec4 color = texture(u_image, v_tex_coord);

            // Convert to grayscale and compute brightness
            float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

            f_color = color;
            f_bright = brightness > 0.7 ? color : vec4(0.0, 0.0, 0.0, 1.0);
        }
    `,
    {
        textures: { u_image: initialTex },
    },
);

const cmdBlur = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        #define KERNEL_LENGTH ${KERNEL.length}

        uniform sampler2D u_image;
        uniform float[KERNEL_LENGTH] u_kernel;
        uniform vec2 u_blur_direction;

        in vec2 v_tex_coord;

        out vec4 color;

        void main() {
            vec2 px_direction = vec2(1) / vec2(textureSize(u_image, 0))
                * u_blur_direction;
            int half_length = (KERNEL_LENGTH - 1) / 2;

            vec4 color_sum = vec4(0.0);
            for (int i = 0; i < KERNEL_LENGTH; i++) {
                vec2 offset_coord = px_direction * vec2(i - half_length);
                color_sum += texture(u_image, v_tex_coord + offset_coord)
                    * u_kernel[i];
            }

            color = vec4(color_sum.rgb, 1.0);
        }
    `,
    {
        textures: { u_image: ({ source }) => source },
        uniforms: {
            u_kernel: {
                type: "1fv",
                value: KERNEL,
            },
            u_blur_direction: {
                type: "2f",
                value: ({ direction }) => direction,
            },
        },
    },
);

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
            u_image_color: splitColorTex,
            u_image_bloom: bloomPingTex,
        },
    },
);


const screenspaceAttrs = Attributes.create(dev, Primitive.TRIANGLES, 3);
const modelAttrs = Attributes.withIndexedBuffers(dev, uvCube.elements, {
        0: uvCube.positions,
        1: uvCube.uvs,
    },
);


const nBloomPasses = Math.max(0, N_BLOOM_PASSES);

const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(0, 1);

const loop = time => {
    // Render geometry into texture
    initialFbo.target(rt => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.draw(cmdDraw, modelAttrs, { time });
    });

    // Split color and brightness to 2 textures (splitColor, splitBright)
    splitFbo.target(rt => rt.draw(cmdSplit, screenspaceAttrs));

    if (nBloomPasses) {
        // Do first 2 bloom passes: splitBright -> bloomPong -> bloomPing
        bloomPongFbo.target(rt => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: splitBrightTex,
                direction: HORIZONTAL,
            });
        });
        bloomPingFbo.target(rt => {
            rt.draw(cmdBlur, screenspaceAttrs, {
                source: bloomPongTex,
                direction: VERTICAL,
            });
        });

        // Loop additional bloom passes: bloomRead -> bloomWrite -> bloomRead
        for (let i = 1; i < nBloomPasses; i++) {
            bloomPongFbo.target(rt => {
                rt.draw(cmdBlur, screenspaceAttrs, {
                    source: bloomPingTex,
                    direction: HORIZONTAL,
                });
            });
            bloomPingFbo.target(rt => {
                rt.draw(cmdBlur, screenspaceAttrs, {
                    source: bloomPongTex,
                    direction: VERTICAL,
                });
            });
        }
    }

    // Blend together blurred highlights with original color, perform tonemapping
    dev.target(rt => {
        rt.draw(cmdMerge, screenspaceAttrs);
    });

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
