/**
 * This example steps computation in SmoothLife, a modification to the Conway's
 * Game of Life by Stephan Rafler. It is a port of a prior implementation
 * by Mikola Lysenko (http://0fps.net).
 *
 * The example is very sensitive to initial data: using a standard random just
 * leads to universe entropy in step 1. Using a smooth random could help,
 * but here we just lower the random's resulution to a similar effect.
 *
 * Sources:
 * https://arxiv.org/abs/1111.1567
 * http://jsfiddle.net/CSyUb/
 */

import {
    Device,
    DataType,
    BufferBits,
    Command,
    Attributes,
    Primitive,
    Texture,
    TextureWrap,
    TextureInternalFormat as TexIntFmt,
    TextureFormat as TexFmt,
    Framebuffer,
} from "./lib/webglutenfree.js";

const [WIDTH, HEIGHT] = [256, 256];
const KERNEL_RADIUS = 23;
const INNER_RADIUS = 7.0;
const OUTER_RADIUS = 21.0;
const BIRTH_LO = 0.278;
const BIRTH_HI = 0.365;
const DEATH_LO = 0.267;
const DEATH_HI = 0.445;
const ALPHA_N = 0.028;
const ALPHA_M = 0.147;

const dev = Device.create({ antialias: false });

// By using REPEAT in both directions, we create a cyclic universe
const pingTex = Texture.create(dev, WIDTH, HEIGHT, TexIntFmt.RGBA8, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});
const pongTex = Texture.create(dev, WIDTH, HEIGHT, TexIntFmt.RGBA8, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});

// Store the initial state
pingTex.store(
    new Uint8Array(createData()),
    TexFmt.RGBA,
    DataType.UNSIGNED_BYTE,
);

const pingFbo = Framebuffer.create(dev, WIDTH, HEIGHT, pingTex);
const pongFbo = Framebuffer.create(dev, WIDTH, HEIGHT, pongTex);

// Performs a step by step simulation by reading previous state of the
// universe from one texture and writing the result to another. Only RED channel
// is read, but all RED, GREEN and BLUE channels are written for aesthetics.
const cmd = Command.create(
    dev,
    `#version 300 es
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
    `,
    `#version 300 es
        precision mediump float;

        #define WIDTH ${WIDTH}
        #define HEIGHT ${HEIGHT}
        #define KERNEL_RADIUS ${KERNEL_RADIUS}
        #define INNER_RADIUS ${INNER_RADIUS}
        #define OUTER_RADIUS ${OUTER_RADIUS}
        #define BIRTH_LO ${BIRTH_LO}
        #define BIRTH_HI ${BIRTH_HI}
        #define DEATH_LO ${DEATH_LO}
        #define DEATH_HI ${DEATH_HI}
        #define ALPHA_N ${ALPHA_N}
        #define ALPHA_M ${ALPHA_M}

        uniform sampler2D u_universe;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 f_next_universe;

        float f(vec2 c) {
            return texture(u_universe, v_tex_coord + (c / vec2(WIDTH, HEIGHT))).r;
        }

        float sigma_1(float x, float a, float alpha) {
            return 1.0 / (1.0 + exp(-(x - a) * 4.0 / alpha));
        }

        float sigma_n(float x, float a, float b) {
            return sigma_1(x, a, ALPHA_N) * (1.0 - sigma_1(x, b, ALPHA_N));
        }

        float sigma_m(float x, float y, float m) {
            float s1 = sigma_1(m, 0.5, ALPHA_M);
            return x * (1.0 - s1) + y * s1;
        }

        float S(float n, float m) {
            return sigma_n(
                n,
                sigma_m(BIRTH_LO, DEATH_LO, m),
                sigma_m(BIRTH_HI, DEATH_HI, m)
            );
        }

        float weight(float r, float cutoff) {
            return 1.0 - sigma_1(r, cutoff, 0.5);
        }

        void main() {
            float IR = float(INNER_RADIUS);
            float OR = float(OUTER_RADIUS);

            float r1 = 0.0;
            float r2 = 0.0;
            float w1 = 0.0;
            float w2 = 0.0;

            for (int i = -KERNEL_RADIUS; i <= KERNEL_RADIUS; ++i) {
                for (int j = -KERNEL_RADIUS; j <= KERNEL_RADIUS; ++j) {
                    float s = f(vec2(i, j));
                    float r = sqrt(float(i*i + j*j));

                    float wi = weight(r, IR);
                    r1 += s * wi;
                    w1 += wi;
                    float wo = weight(r, OR);
                    r2 += s * wo;
                    w2 += wo;
                }
            }

            float m = r1 / w1;
            float n = (r2 - r1) / (w2 - w1);

            f_next_universe = vec4(S(n, m), m, n, 1);
        }
    `,
    { textures: { u_universe: ({ ping }) => ping.tex } },
);

const attrs = Attributes.empty(dev, Primitive.TRIANGLES, 3);

let ping = { tex: pingTex, fbo: pingFbo };
let pong = { tex: pongTex, fbo: pongFbo };

const loop = () => {
    // Compute using previous values in ping, store to pong
    pong.fbo.target(rt => {
        rt.draw(cmd, attrs, { ping });
    });

    // Update canvas based on pong
    dev.target(rt => {
        rt.blit(pong.fbo, BufferBits.COLOR);
    });

    // ... and swap the pingpong
    const tmp = ping;
    ping = pong;
    pong = tmp;

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

// Create the initial data. Since the simulation is very sensitive to data,
// We create the data in a lower resulution first, and then upscale it. Simplex
// noise could be used instead.
function createData() {
    const [effectiveWidth, effectiveHeight] = [
        Math.ceil(WIDTH / INNER_RADIUS),
        Math.ceil(HEIGHT / INNER_RADIUS),
    ];
    const lowResolution = new Array(effectiveWidth * effectiveHeight);
    for (let i = 0; i < lowResolution.length; ++i) {
        lowResolution[i] = Math.random() < 0.5 ? 0 : 255;
    }

    const data = new Float32Array(WIDTH * HEIGHT * 4);
    let ptr = 0;
    for (let j = 0; j < HEIGHT; ++j) {
        for (let i = 0; i < WIDTH; ++i) {
            const x = Math.floor(i / INNER_RADIUS);
            const y = Math.floor(j / INNER_RADIUS);

            data[ptr] = lowResolution[x + y * effectiveWidth];
            data[ptr + 1] = 0;
            data[ptr + 2] = 0;
            data[ptr + 3] = 0;
            ptr += 4;
        }
    }
    return data;
}
