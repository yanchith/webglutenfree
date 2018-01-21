import {
    Device,
    Command,
    VertexArray,
    Texture,
    TextureInternalFormat,
    Framebuffer,
} from "./lib/glutenfree.es.js";
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

const initialTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const initialFbo = Framebuffer.fromColor(dev, width, height, initialTex);

const splitColorTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const splitBrightTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const splitFbo = Framebuffer.fromColor(dev, width, height, [
    splitColorTex,
    splitBrightTex,
]);

const bloomPingTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const bloomPingFbo = Framebuffer.fromColor(dev, width, height, bloomPingTex);

const bloomPongTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const bloomPongFbo = Framebuffer.fromColor(dev, width, height, bloomPongTex);


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

        out vec4 f_color;

        void main() {
            f_color = vec4(0.9, 0.8, 0.9, 0.5);
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
    uniforms: {
        u_image: {
            type: "texture",
            value: initialTex,
        },
    },
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
});


const screenspaceGeometry = VertexArray.indexed(
    dev,
    square.elements,
    {
        0: square.positions,
        1: square.texCoords,
    },
);

const cubeGeometry = VertexArray.indexed(
    dev,
    cube.elements,
    { 0: cube.positions },
);


const nBloomPasses = Math.max(0, N_BLOOM_PASSES);

const HORIZONTAL = vec2.fromValues(1, 0);
const VERTICAL = vec2.fromValues(0, 1);

const loop = time => {
    // Render geometry into texture
    initialFbo.target(rt => {
        rt.clearColorAndDepth(0, 0, 0, 1, 1);
        rt.draw(scene, cubeGeometry, { time });
    });

    // Split color and brightness to 2 render targets (splitColor, splitBright)
    splitFbo.target(rt => rt.draw(split, screenspaceGeometry));

    if (nBloomPasses) {
        // Do first 2 bloom passes: splitBright -> bloomWrite -> bloomRead
        bloomPongFbo.target(rt => {
            rt.draw(bloom, screenspaceGeometry, {
                source: splitBrightTex,
                direction: HORIZONTAL,
            });
        });
        bloomPingFbo.target(rt => {
            rt.draw(bloom, screenspaceGeometry, {
                source: bloomPongTex,
                direction: VERTICAL,
            });
        });

        // Loop additional bloom passes: bloomRead -> bloomWrite -> bloomRead
        for (let i = 1; i < nBloomPasses; i++) {
            bloomPongFbo.target(rt => {
                rt.draw(bloom, screenspaceGeometry, {
                    source: bloomPingTex,
                    direction: HORIZONTAL,
                });
            });
            bloomPingFbo.target(rt => {
                rt.draw(bloom, screenspaceGeometry, {
                    source: bloomPongTex,
                    direction: VERTICAL,
                });
            });
        }
    }

    // Blend together blurred highlights with original color, perform tonemapping
    dev.target(rt => {
        rt.clearColor(0, 0, 0, 1);
        rt.draw(tonemap, screenspaceGeometry);
    });

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
