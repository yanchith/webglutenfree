import {
    Device,
    Command,
    VertexArray,
    Texture,
    Framebuffer,
} from "./lib/glutenfree.js";
import { loadImage } from "./lib/load-image.js";

function kernelWeight(kernel) {
    return kernel.reduce((prev, curr) => prev + curr);
}

const gaussianKernel = [
    0.003028,
    0.0117,
    0.037751,
    0.101722,
    0.22889,
    0.4301,
    0.674906,
    0.884398,
    0.967794,
    0.884398,
    0.674906,
    0.4301,
    0.22889,
    0.101722,
    0.037751,
    0.0117,
    0.003028,
];

const dev = Device.createAndMount();
const [w, h] = [dev.bufferWidth, dev.bufferHeight];

const splitColorTexture = Texture.RGBA8FromRGBAUint8Array(dev, null, w, h);
const splitBrightTexture = Texture.RGBA8FromRGBAUint8Array(dev, null, w, h);
const splitFbo = Framebuffer.fromTextures(dev, [
    splitColorTexture,
    splitBrightTexture,
]);

const bloomReadTexture = Texture.RGBA8FromRGBAUint8Array(dev, null, w, h);
const bloomReadFbo = Framebuffer.fromTextures(dev, [bloomReadTexture]);

const bloomWriteTexture = Texture.RGBA8FromRGBAUint8Array(dev, null, w, h);
const bloomWriteFbo = Framebuffer.fromTextures(dev, [bloomWriteTexture]);

const split = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        uniform sampler2D u_image;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 o_color;
        layout (location = 1) out vec4 o_bright;

        void main() {
            vec4 color = texture(u_image, v_tex_coord);

            // Convert to grayscale and compute brightness
            float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

            o_color = color;
            o_bright = brightness > 0.7 ? color : vec4(0.0);
        }
    `,
    uniforms: {
        u_image: {
            type: "texture",
            value: image => image,
        },
    },
    clear: { color: [0, 0, 0, 1] },
});

const bloom = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        #define KERNEL_LENGTH ${gaussianKernel.length}

        uniform sampler2D u_image;
        uniform float[KERNEL_LENGTH] u_kernel;
        uniform float u_kernel_weight;
        uniform vec2 u_blur_direction;

        in vec2 v_tex_coord;

        out vec4 color;

        void main() {
            vec2 one_pixel = vec2(1) / vec2(textureSize(u_image, 0));
            int half_length = (KERNEL_LENGTH - 1) / 2;

            vec4 color_sum = vec4(0.0);
            for (int i = 0; i < KERNEL_LENGTH; i++) {
                vec2 offset_coord = one_pixel
                    * vec2(i - half_length)
                    * u_blur_direction;
                color_sum += texture(u_image, v_tex_coord + offset_coord)
                    * u_kernel[i];
            }

            color = vec4((color_sum / u_kernel_weight).rgb, 1.0);
        }
    `,
    uniforms: {
        u_kernel: {
            type: "1fv",
            value: gaussianKernel,
        },
        u_kernel_weight: {
            type: "1f",
            value: kernelWeight(gaussianKernel),
        },
        u_blur_direction: {
            type: "2f",
            value: ({ direction }) => direction,
        },
        u_image: {
            type: "texture",
            value: ({ texture }) => texture,
        },
    },
    clear: { color: [0, 0, 0, 1] },
});

const tonemap = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view, u_model;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

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

        uniform sampler2D u_image_color;
        uniform sampler2D u_image_bloom;

        in vec2 v_tex_coord;

        out vec4 o_color;

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

            o_color = vec4(mapped, 1.0);
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
        u_image_color: {
            type: "texture",
            value: splitColorTexture,
        },
        u_image_bloom: {
            type: "texture",
            value: bloomTexture => bloomTexture,
        },
    },
    clear: { color: [0, 0, 0, 1] },
});

const screenspace = VertexArray.create(dev, {
    attributes: {
        0: [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ],
        1: [
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
});

const nAdditionalBloomPasses = 2;

const blurDirection = vec2.create();
const bloomProps = {
    texture: splitBrightTexture,
    direction: blurDirection,
};

const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(1, 0);

const bloomInitialFirstProps = {
    texture: splitBrightTexture,
    direction: HORIZONTAL,
}

const bloomInitialSecondProps = {
    texture: bloomWriteTexture,
    direction: HORIZONTAL,
}

const bloomLoopFirstProps = {
    texture: bloomReadTexture,
    direction: HORIZONTAL,
}

const bloomLoopSecondProps = {
    texture: bloomWriteTexture,
    direction: VERTICAL,
}

async function run() {
    const originalImage = Texture.fromImage(
        dev,
        await loadImage("img/lenna.png", true),
    );

    const loop = () => {
        // Split color and brightness to 2 render targets (splitColor, splitBright)
        split.execute(screenspace, originalImage, splitFbo);

        // Do first 2 blur passes: splitBright -> bloomWrite -> bloomRead
        bloom.execute(screenspace, bloomInitialFirstProps, bloomWriteFbo);
        bloom.execute(screenspace, bloomInitialSecondProps, bloomReadFbo);

        // Loop additional bloom passes: bloomRead -> bloomWrite -> bloomRead
        for (let i = 0; i < nAdditionalBloomPasses; i++) {
            bloom.execute(screenspace, bloomLoopFirstProps, bloomWriteFbo);
            bloom.execute(screenspace, bloomLoopSecondProps, bloomReadFbo);
        }

        // Blend together blurred highlights with original color and perform tonemapping
        tonemap.execute(screenspace, bloomReadTexture);

        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}

run();
