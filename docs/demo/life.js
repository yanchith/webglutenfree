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

/*
Game of life simulates a grid world, where the state of each cell in time T + 1
can be determined by rules applied to the cell's surroundings at time T.

The rules are:
- If the cell is alive and 2-3 surrounding cells are alive, the cell stays alive
- If the cell is alive and 0-1 surrounding cells are alive, the cell dies
- If the cell is alive and 4-8 surrounding cells are alive, the cell dies
- If the cell is dead and 3 surrounding cells are alive, the cell comes to life
*/

const dev = Device.create({ antialias: false });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];
const [lifeWidth, lifeHeight] = [
    Math.round(width / 4),
    Math.round(height / 4),
];

// Use textures with only one channel
const pingTex = Texture.create(dev, lifeWidth, lifeHeight, TexIntFmt.R8, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});
const pongTex = Texture.create(dev, lifeWidth, lifeHeight, TexIntFmt.R8, {
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT,
});

const data = Array(lifeWidth * lifeHeight);
for (let i = 0; i < lifeWidth * lifeHeight; ++i) {
    data[i] = Math.random() > 0.5 ? 0 : 255;
}
pingTex.store(
    new Uint8Array(data),
    TexFmt.RED,
    DataType.UNSIGNED_BYTE,
    { width: lifeWidth, height: lifeHeight },
);

const pingFbo = Framebuffer.create(dev, lifeWidth, lifeHeight, pingTex);
const pongFbo = Framebuffer.create(dev, lifeWidth, lifeHeight, pongTex);

// This vertex shader just renders one huge triangle to cover the screenspace.
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

// Performs a step by step simulation by reading previous state of the
// universe from one texture and writing the result to another.
const cmd = Command.create(
    dev,
    screenspaceVS,
    `#version 300 es
        precision mediump float;

        uniform sampler2D u_universe;

        in vec2 v_tex_coord;

        layout (location = 0) out float f_next_universe;

        void main() {
            vec2 px = vec2(1) / vec2(textureSize(u_universe, 0));
            float current = texture(u_universe, v_tex_coord).r;
            float neighbors = 0.0;
            neighbors += texture(u_universe, px * vec2( 1,  1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2( 0,  1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2(-1,  1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2(-1,  0) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2(-1, -1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2( 0, -1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2( 1, -1) + v_tex_coord).r;
            neighbors += texture(u_universe, px * vec2( 1,  0) + v_tex_coord).r;

            if (current == 0.0) {
                f_next_universe = neighbors == 3.0 ? 1.0 : 0.0;
            } else {
                if (neighbors >= 4.0) {
                    f_next_universe = 0.0;
                } else if (neighbors >= 2.0) {
                    f_next_universe = 1.0;
                } else {
                    f_next_universe = 0.0;
                }
            }
        }
    `,
    { textures: { u_universe: ({ ping }) => ping.tex } },
);

const attrs = Attributes.empty(dev, Primitive.TRIANGLES, 3);

let ping = { tex: pingTex, fbo: pingFbo };
let pong = { tex: pongTex, fbo: pongFbo };

let tick = 0;
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
