import {
    Device,
    Extension,
    Command,
    Attributes,
    Primitive,
    Texture,
    TextureInternalFormat as TexIntFmt,
    Framebuffer,
} from "./lib/webglutenfree.es.js";

const MAX_ITERS = 1 << 8;
const ESCAPE_THRESHOLD = 2.0;
const REAL_DOMAIN = [-1.20, -1];
const IMAG_DOMAIN = [0.20, 0.35];

// Use extensions so we can render to 32 bit float textures for values
const dev = Device.create({ extensions: [Extension.EXTColorBufferFloat] });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

// Note: Even with extensions, RGB32F is not renderable (might be a bug),
// so we use RGBA32F even when we only use 3 channels
const pingTex = Texture.create(dev, width, height, TexIntFmt.RGBA32F);
const pongTex = Texture.create(dev, width, height, TexIntFmt.RGBA32F);

const pingFbo = Framebuffer.create(dev, width, height, pingTex);
const pongFbo = Framebuffer.create(dev, width, height, pongTex);

// This vertex shader just renders one huge triangle to cover the screenspace.
const screenspaceVS = `#version 300 es
precision mediump float;

void main() {
    switch (gl_VertexID % 3) {
        case 0:
            gl_Position = vec4(-1, 3, 0, 1);
            break;
        case 1:
            gl_Position = vec4(-1, -1, 0, 1);
            break;
        case 2:
            gl_Position = vec4(3, -1, 0, 1);
            break;
    }
}
`;

// Performs a step by step simulation, whether a pixel converges or diverges.
// The pixel is proven to diverge when its distance from (0,0) exceeds 2.
// In the resulting framebuffer, xy is the current value and z marks the time
// of us being certain of its divergence. This escape time is the value we
// paint to the screen in the next command.
const cmdCompute = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform uint u_tick;
        uniform float u_escape_threshold;
        uniform vec2 u_re_domain, u_im_domain;
        uniform sampler2D u_prev;

        layout (location = 0) out vec3 f_val;

        float remap(float value, vec2 source, vec2 dest) {
            return (((value - source.x)
                / (source.y - source.x))
                * (dest.y - dest.x))
                + dest.x;
        }

        vec2 remap2(
            vec2 value,
            vec2 source_x,
            vec2 source_y,
            vec2 dest_x,
            vec2 dest_y
        ) {
            return vec2(
                remap(value.x, source_x, dest_x),
                remap(value.y, source_y, dest_y)
            );
        }

        vec2 complex_mult(vec2 a, vec2 b) {
            return vec2((a.x * b.x) - (a.y * b.y), (a.x * b.y) + (a.y * b.x));
        }

        vec2 escape(vec2 c, vec2 z) {
            return complex_mult(z, z) + c;
        }

        void main() {
            ivec2 dimensions = textureSize(u_prev, 0);
            vec3 pix_prev = texelFetch(u_prev, ivec2(gl_FragCoord.xy), 0).rgb;

            vec2 prev_val = pix_prev.xy;
            uint prev_esc = uint(pix_prev.z);

            f_val = pix_prev;
            if (prev_esc == 0u) {
                vec2 c = remap2(
                    gl_FragCoord.xy,
                    vec2(0, float(dimensions.x)),
                    vec2(0, float(dimensions.y)),
                    u_re_domain,
                    u_im_domain
                );
                vec2 val = escape(c, prev_val);
                uint esc = 0u;
                if (length(val) > u_escape_threshold) {
                    esc = u_tick;
                }
                f_val = vec3(val, esc);
            }
        }
    `,
    {
        textures: { u_prev: ({ ping }) => ping.tex },
        uniforms: {
            u_tick: {
                type: "1ui",
                value: ({ tick }) => tick,
            },
            u_re_domain: {
                type: "2f",
                value: REAL_DOMAIN,
            },
            u_im_domain: {
                type: "2f",
                value: IMAG_DOMAIN,
            },
            u_escape_threshold: {
                type: "1f",
                value: ESCAPE_THRESHOLD,
            },
        },
    },
);

// Use the texture computed by the previous command to draw the progress.
// Paint black for pixels that are not proven to diverge, and shades of gray
// for divergent pixels. The brighter they are, the sooner they were proven
// to diverge.
const cmdDraw = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform float u_max_iters;
        uniform sampler2D u_val;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec3 pix = texelFetch(u_val, ivec2(gl_FragCoord.xy), 0).rgb;

            float esc = pix.z;
            float greyscale = esc / u_max_iters;
            f_color = vec4(vec3(0), 1);
            if (greyscale > 0.00001) {
                f_color = vec4(vec3(1. - greyscale), 1);
            }
        }
    `,
    {
        textures: { u_val: ({ pong }) => pong.tex },
        uniforms: {
            u_max_iters: {
                type: "1f",
                value: MAX_ITERS,
            },
        },
    },
);

const attrs = Attributes.empty(dev, Primitive.TRIANGLES, 3);

let ping = { tex: pingTex, fbo: pingFbo };
let pong = { tex: pongTex, fbo: pongFbo };

let tick = 0;

const loop = time => {
    tick++;

    // Compute using previous values in ping, store to pong
    pong.fbo.target(rt => {
        rt.draw(cmdCompute, attrs, { tick, ping });
    });

    // Update canvas based on pong
    dev.target(rt => {
        rt.draw(cmdDraw, attrs, { pong });
    });

    // ... and swap the pingpong
    const tmp = ping;
    ping = pong;
    pong = tmp;

    if (tick < MAX_ITERS) {
        window.requestAnimationFrame(loop);
    }
}

window.requestAnimationFrame(loop);
