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
    Texture2D,
    UniformType,
    TargetBufferBitmask,
    ElementPrimitive,
    TextureDataType,
    TextureColorStorageFormat,
    TextureFormat,
    TextureWrap,
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
const pingTex = dev.createTexture2D(
    WIDTH,
    HEIGHT,
    TextureColorStorageFormat.RGBA8,
    { wrapS: TextureWrap.REPEAT, wrapT: TextureWrap.REPEAT },
);
const pongTex = dev.createTexture2D(
    WIDTH,
    HEIGHT,
    TextureColorStorageFormat.RGBA8,
    { wrapS: TextureWrap.REPEAT, wrapT: TextureWrap.REPEAT },
);

// Store the initial state
pingTex.store(
    new Uint8Array(createData()),
    TextureFormat.RGBA,
    TextureDataType.UNSIGNED_BYTE,
);

const pingFbo = dev.createFramebuffer(WIDTH, HEIGHT, pingTex);
const pongFbo = dev.createFramebuffer(WIDTH, HEIGHT, pongTex);

// Performs a step by step simulation by reading previous state of the
// universe from one texture and writing the result to another. Only RED channel
// is read, but all RED, GREEN and BLUE channels are written for aesthetics.

interface CmdProps {
    tex: Texture2D<TextureColorStorageFormat>;
}

const cmd = dev.createCommand<CmdProps>(
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

    const int WIDTH = int(${WIDTH});
    const int HEIGHT = int(${HEIGHT});
    const int KERNEL_RADIUS = int(${KERNEL_RADIUS});
    const float INNER_RADIUS = float(${INNER_RADIUS});
    const float OUTER_RADIUS = float(${OUTER_RADIUS});
    const float BIRTH_LO = float(${BIRTH_LO});
    const float BIRTH_HI = float(${BIRTH_HI});
    const float DEATH_LO = float(${DEATH_LO});
    const float DEATH_HI = float(${DEATH_HI});
    const float ALPHA_N = float(${ALPHA_N});
    const float ALPHA_M = float(${ALPHA_M});

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
        float r1 = 0.0;
        float r2 = 0.0;
        float w1 = 0.0;
        float w2 = 0.0;

        for (int i = -KERNEL_RADIUS; i <= KERNEL_RADIUS; ++i) {
            for (int j = -KERNEL_RADIUS; j <= KERNEL_RADIUS; ++j) {
                float s = f(vec2(i, j));
                float r = sqrt(float(i*i + j*j));

                float wi = weight(r, INNER_RADIUS);
                r1 += s * wi;
                w1 += wi;
                float wo = weight(r, OUTER_RADIUS);
                r2 += s * wo;
                w2 += wo;
            }
        }

        float m = r1 / w1;
        float n = (r2 - r1) / (w2 - w1);

        f_next_universe = vec4(S(n, m), m, n, 1);
    }
    `,
    {
        uniforms: {
            u_universe: {
                type: UniformType.SAMPLER_2D,
                value: ({ tex }) => tex,
            },
        },
    },
);

const attrs = dev.createEmptyAttributes(ElementPrimitive.TRIANGLE_LIST, 3);

let ping = { tex: pingTex, fbo: pingFbo };
let pong = { tex: pongTex, fbo: pongFbo };

const loop = (): void => {
    // Compute using previous values in ping, store to pong
    pong.fbo.target((rt) => {
        rt.draw(cmd, attrs, { tex: ping.tex });
    });

    // Update canvas based on pong
    dev.target((rt) => {
        rt.blit(pong.fbo, TargetBufferBitmask.COLOR);
    });

    // ... and swap the pingpong
    const tmp = ping;
    ping = pong;
    pong = tmp;

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

// Create the initial data. Since the simulation is very sensitive to data,
// We create the data in a lower resulution first, and then upscale it. Simplex
// noise could be used instead.
function createData(): Float32Array {
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
