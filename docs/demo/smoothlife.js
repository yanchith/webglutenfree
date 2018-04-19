/**
 * TODO
 */

import {
    Device,
    Extension,
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
} from "./lib/webglutenfree.es.js";

const WIDTH = 256;
const HEIGHT = 256;
const KERNEL_RADIUS = 23;
const INNER_RADIUS = 7.0;
const OUTER_RADIUS = 21.0;
const BIRTH_LO = 0.278;
const BIRTH_HI = 0.365;
const DEATH_LO = 0.267;
const DEATH_HI = 0.445;
const ALPHA_N = 0.028;
const ALPHA_M = 0.147;

const dev = Device.create({
    antialias: false,
    extensions: [Extension.EXTColorBufferFloat],
});

// Use textures with only one channel. By using REPEAT in both directions, we
// create a cyclic universe
const pingTex = Texture.create(dev, WIDTH, HEIGHT, TexIntFmt.RGBA32F, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});
const pongTex = Texture.create(dev, WIDTH, HEIGHT, TexIntFmt.RGBA32F, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});


const effective_dims = [
    Math.ceil(WIDTH / INNER_RADIUS),
    Math.ceil(HEIGHT / INNER_RADIUS),
];
const lores = new Array(effective_dims[0] * effective_dims[1]);
for(var i=0; i<lores.length; ++i) {
    lores[i] = (Math.random() < 0.5) ? 0 : 1;
}

//Create initial conditions
const initial_state = new Float32Array(WIDTH * HEIGHT * 4);
var ptr = 0;
for(var j=0; j<HEIGHT; ++j) {
for(var i=0; i<WIDTH; ++i) {
var x = Math.floor(i / INNER_RADIUS);
var y = Math.floor(j / INNER_RADIUS);

//initial_state[ptr]   = (100 < i && i < 114 && 100 < j && j < 114) ? 1 : 0;
initial_state[ptr]   = lores[x + y * effective_dims[0]];
initial_state[ptr+1] = 0;
initial_state[ptr+2] = 0;
initial_state[ptr+3] = 0;
ptr += 4;
}
}


// const dataLength = WIDTH * HEIGHT * 4;
// const data = Array(dataLength);
// for (let i = 0; i < dataLength; ++i) {
//     // data[i] = Math.random();
//     data[i] = Math.random() > 0.5 ? 1 : 0;
// }
pingTex.store(
    new Float32Array(initial_state),
    TexFmt.RGBA,
    DataType.FLOAT,
);

const pingFbo = Framebuffer.create(dev, WIDTH, HEIGHT, pingTex);
const pongFbo = Framebuffer.create(dev, WIDTH, HEIGHT, pongTex);

// Performs a step by step simulation by reading previous state of the
// universe from one texture and writing the result to another.
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

            f_next_universe = vec4(S(n,m), m, n, 1);
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
