import {
    Device,
    Command,
    VertexArray,
    Texture,
    Framebuffer,
} from "./lib/glutenfree.es.min.js";
import * as square from "./lib/square.js"
import * as cube from "./lib/cube.js"

const N_BLOOM_PASSES = 3;

const GAUSSIAN = [
    0.000229,
    0.005977,
    0.060598,
    0.241732,
    0.382928,
    0.241732,
    0.060598,
    0.005977,
    0.000229,
]

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const initialTex = Texture.fromRGBA8(dev, null, width, height);
const initialFbo = Framebuffer.create(dev, {
    width,
    height,
    color: initialTex,
});

const splitColorTex = Texture.fromRGBA8(dev, null, width, height);
const splitBrightTex = Texture.fromRGBA8(dev, null, width, height);
const splitFbo = Framebuffer.create(dev, {
    width,
    height,
    color: [splitColorTex, splitBrightTex],
});

const bloomPingTex = Texture.fromRGBA8(dev, null, width, height);
const bloomPingFbo = Framebuffer.create(dev, {
    width,
    height,
    color: bloomPingTex,
});

const bloomPongTex = Texture.fromRGBA8(dev, null, width, height);
const bloomPongFbo = Framebuffer.create(dev, {
    width,
    height,
    color: bloomPongTex,
});

const screenspace = VertexArray.create(dev, {
    attributes: {
        0: square.positions,
        1: square.texCoords,
    },
    elements: square.elements,
});

const view = mat4.create();

const scene = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view, u_model;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_position, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        layout (location = 0) out vec4 o_color;

        void main() {
            o_color = vec4(0.9, 0.8, 0.9, 0.5);
        }
    `,
    uniforms: {
        u_model: {
            type: "matrix4fv",
            value: mat4.fromScaling(mat4.create(), [2, 2, 2]),
        },
        u_view: {
            type: "matrix4fv",
            value: ({ time }) => mat4.lookAt(
                view,
                [30 * Math.cos(time / 1000), 5, 30 * Math.sin(time / 1000)],
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
    data: {
        attributes: { a_position: cube.positions },
        elements: cube.elements,
    },
    framebuffer: ({ target }) => target,
});

const split = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_position, 0.0, 1.0);
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
            o_bright = brightness > 0.7 ? color : vec4(0.0, 0.0, 0.0, 1.0);
        }
    `,
    uniforms: {
        u_image: {
            type: "texture",
            value: initialTex,
        },
    },
    data: screenspace,
    framebuffer: ({ target }) => target,
});

const bloom = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        #define KERNEL_LENGTH ${GAUSSIAN.length}

        uniform sampler2D u_image;
        uniform float[KERNEL_LENGTH] u_kernel;
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

            color = vec4(color_sum.rgb, 1.0);
        }
    `,
    uniforms: {
        u_kernel: {
            type: "1fv",
            value: GAUSSIAN,
        },
        u_blur_direction: {
            type: "2f",
            value: ({ direction }) => direction,
        },
        u_image: {
            type: "texture",
            value: ({ source }) => source,
        },
    },
    data: screenspace,
    framebuffer: ({ target }) => target,
});

const tonemap = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_position, 0.0, 1.0);
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
        u_image_color: {
            type: "texture",
            value: splitColorTex,
        },
        u_image_bloom: {
            type: "texture",
            value: bloomPingTex,
        },
    },
    data: screenspace,
});

const nBloomPasses = Math.max(0, N_BLOOM_PASSES);

const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(0, 1);

const loop = time => {
    // We only need to clear the initial fbo and the BACK buffer, as we always
    // overwrite the others completely
    dev.clearColorBuffer(0, 0, 0, 1);
    dev.clearColorAndDepthBuffers(0, 0, 0, 1, 1, initialFbo);

    // Render geometry into texture
    scene.execute({ time, target: initialFbo });

    // Split color and brightness to 2 render targets (splitColor, splitBright)
    split.execute({ target: splitFbo });

    if (nBloomPasses) {
        // Do first 2 bloom passes: splitBright -> bloomWrite -> bloomRead
        bloom.execute({
            source: splitBrightTex,
            direction: HORIZONTAL,
            target: bloomPongFbo,
        });
        bloom.execute({
            source: bloomPongTex,
            direction: VERTICAL,
            target: bloomPingFbo,
        });

        // Loop additional bloom passes: bloomRead -> bloomWrite -> bloomRead
        for (let i = 1; i < nBloomPasses; i++) {
            bloom.execute({
                source: bloomPingTex,
                direction: HORIZONTAL,
                target: bloomPongFbo,
            });
            bloom.execute({
                source: bloomPongTex,
                direction: VERTICAL,
                target: bloomPingFbo,
            });
        }
    }

    // Blend together blurred highlights with original color and perform tonemapping
    tonemap.execute();

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
