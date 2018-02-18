import {
    Device,
    BufferBits,
    Command,
    Attributes,
    Primitive,
    Texture,
    TextureInternalFormat,
    Framebuffer,
} from "./lib/webglutenfree.es.js";

const MAX_ITERS = 1 << 8; // 8 bit colors

const dev = Device.mount({
    antialias: false,
    extensions: ["EXT_color_buffer_float"],
});
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const pingTexVal = Texture.create(dev, width, height, TextureInternalFormat.RG32F);
const pingTexEsc = Texture.create(dev, width, height, TextureInternalFormat.R32UI);
const pingFbo = Framebuffer.withColor(dev, width, height, [
    pingTexVal,
    pingTexEsc,
]);

const pongTexVal = Texture.create(dev, width, height, TextureInternalFormat.RG32F);
const pongTexEsc = Texture.create(dev, width, height, TextureInternalFormat.R32UI);
const pongFbo = Framebuffer.withColor(dev, width, height, [
    pongTexVal,
    pongTexEsc,
]);

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

const cmdCompute = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform uint u_tick;
        uniform vec2 u_re_domain, u_im_domain;
        uniform sampler2D u_prev_val, u_prev_esc;

        in vec2 v_tex_coord;

        layout (location = 0) out vec2 f_val;
        layout (location = 1) out float f_esc;

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
            vec4 pix_prev_val = texture(u_prev_val, v_tex_coord);
            vec4 pix_prev_esc = texture(u_prev_esc, v_tex_coord);

            vec2 prev_val = pix_prev_val.xy;
            uint prev_esc = uint(pix_prev_esc.x);

            ivec2 dimensions = textureSize(u_prev_val, 0);

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
                if (length(val) > 2.0) {
                    esc = u_tick;
                }
                f_val = val;
                f_esc = float(esc);
            } else {
                f_val = prev_val;
                f_esc = float(prev_esc);
            }
        }
    `,
    {
        textures: {
            u_prev_val: ({ ping }) => ping.texVal,
            u_prev_esc: ({ ping }) => ping.texEsc,
        },
        uniforms: {
            u_tick: {
                type: "1ui",
                value: ({ tick }) => tick,
            },
            u_re_domain: {
                type: "2f",
                value: [-1.20, -1],
            },
            u_im_domain: {
                type: "2f",
                value: [0.20, 0.35],
            },
        },
    },
);

const cmdDraw = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform float u_max_iters;
        uniform sampler2D u_esc;

        in vec2 v_tex_coord;

        out vec4 f_color;

        void main() {
            vec4 pix_esc = texture(u_esc, v_tex_coord);
            float greyscale = pix_esc.x / u_max_iters;
            // f_color = vec4(vec3(greyscale), 1);
            f_color = texture(u_esc, v_tex_coord);
            // f_color = gl_FragCoord / 1500.0;
        }
    `,
    {
        textures: {
            u_esc: ({ pong }) => pong.texEsc,
        },
        uniforms: {
            u_max_iters: {
                type: "1f",
                value: MAX_ITERS,
            },
        },
    },
);

const attrs = Attributes.create(dev, Primitive.TRIANGLES, 3);

let ping = {
    texVal: pingTexVal,
    texEsc: pingTexEsc,
    fbo: pingFbo,
}

let pong = {
    texVal: pongTexVal,
    texEsc: pongTexEsc,
    fbo: pongFbo,
}

let tick = 0;

const loop = time => {
    tick++;

    pong.fbo.target(rt => {
        rt.draw(cmdCompute, attrs, { tick, ping });
    });

    // Lastly copy the contents of pong to canvas
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
