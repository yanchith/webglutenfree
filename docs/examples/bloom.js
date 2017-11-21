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

const splitColorTexture = Texture.RGBA8FromRGBAUint8Array(gl, null, w, h);
const splitBrightTexture = Texture.RGBA8FromRGBAUint8Array(gl, null, w, h);
const splitFbo = Framebuffer.fromTextures(gl, [
    splitColorTexture,
    splitBrightTexture,
]);

const bloomReadTexture = Texture.RGBA8FromRGBAUint8Array(gl, null, w, h);
const bloomReadFbo = Framebuffer.fromTextures(gl, [bloomReadTexture]);

const bloomWriteTexture = Texture.RGBA8FromRGBAUint8Array(gl, null, w, h);
const bloomWriteFbo = Framebuffer.fromTextures(gl, [bloomWriteTexture]);

const split = Command.create(dev, {
    vert: `
        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec2(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `
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
            value: ({ image }) => image,
        },
    },
    clear: { color: [0, 0, 0, 1] },
});

const bloom = Command.create(dev, {
    vert: `
        layout (location = 0) in vec4 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = a_vertex_position;
        }
    `,
    frag: `
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
            value: gaussianBlur.kernel,
        },
        u_kernel_weight: {
            type: "1f",
            value: gaussianBlur.weight,
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

const blend = Command.create(dev, {
    vert: `
        layout (location = 0) in vec4 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = a_vertex_position;
        }
    `,
    frag: `
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
        u_image_color: {
            type: "texture",
            value: sceneColorTexture,
        },
        u_image_bloom: {
            type: "texture",
            value: bloomTexture => bloomTexture,
        },
    },
    clear: { color: [0, 0, 0, 1] },
});

const screenspace = VertexArray.create(dev, bloom.locate({
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

const nAdditionalBloomPasses = 2;

const blurDirection = vec2.create();
const bloomProps = {
    texture: sceneBrightnessTexture,
    direction: blurDirection,
};

async function run() {
    const originalImage = Texture.fromImage(
        dev,
        await Texture.fromImage("img/lenna.png", true),
    );

    const loop = () => {
        split.execute(screenspace, originalImage, splitFbo);

        bloomProps.texture = splitColorTexture;
        bloomProps.direction = vec2.set(blurDirection, 0, 1);
        bloom.execute(screenspace, bloomProps, bloomWriteFbo);

        bloomProps.texture = bloomWriteTexture;
        bloomProps.direction = vec2.set(blurDirection, 1, 0);
        bloom.execute(screenspace, bloomProps, bloomReadFbo);

        for (let i = 0; i < nAdditionalBloomPasses; i++) {
            bloomProps.texture = bloomReadTexture;
            bloomProps.direction = vec2.set(blurDirection, 0, 1);
            bloom.execute(screenspace, bloomProps, bloomWriteFbo);

            bloomProps.texture = bloomWriteTexture;
            bloomProps.direction = vec2.set(blurDirection, 1, 0);
            bloom.execute(screenspace, bloomProps, bloomReadFbo);
        }

        blend.execute(screenspace, bloomReadTexture);

        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}

run();

