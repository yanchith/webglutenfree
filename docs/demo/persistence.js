/**
 * Implemented straight from this excellent talk by Gregg Tavares:
 * https://www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s
 */

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
import * as bunny from "./lib/bunny.js"

const PERSISTENCE_FACTOR = 0.8;

const dev = Device.mount({ antialias: false });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const newFrameTex = Texture.create(dev, width, height, TextureInternalFormat.RGBA8);
const newFrameFbo = Framebuffer.withColor(dev, width, height, newFrameTex);

const pingTex = Texture.create(dev, width, height, TextureInternalFormat.RGBA8);
const pingFbo = Framebuffer.withColor(dev, width, height, pingTex);

const pongTex = Texture.create(dev, width, height, TextureInternalFormat.RGBA8);
const pongFbo = Framebuffer.withColor(dev, width, height, pongTex);

const view = mat4.create();

const draw = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_Position = u_projection * u_view * vec4(a_position, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(0.8, 0.3, 0.7, 1.0);
        }
    `,
    {
        uniforms: {
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
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    view,
                    [30 * Math.cos(time / 1000), 2.5, 30 * Math.sin(time / 1000)],
                    [0, 2.5, 0],
                    [0, 1, 0]
                ),
            },
        },
    },
);

const blend = Command.create(
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

        uniform sampler2D u_new_frame, u_ping;
        uniform float u_blend_factor;

        in vec2 v_tex_coord;

        out vec4 f_color;

        vec4 blend_alpha(vec4 src_color, vec4 dst_color, float factor) {
            return (src_color * factor) + (dst_color * (1. - factor));
        }

        void main() {
            vec4 c1 = texture(u_new_frame, v_tex_coord);
            vec4 c2 = texture(u_ping, v_tex_coord);
            f_color = blend_alpha(c2, c1, u_blend_factor);
        }
    `,
    {
        textures: {
            u_new_frame: ({ newFrame }) => newFrame,
            u_ping: ({ ping }) => ping,
        },
        uniforms: {
            u_blend_factor: {
                type: "1f",
                value: PERSISTENCE_FACTOR,
            }
        },
    },
);

const screenspaceAttrs = Attributes.create(dev, Primitive.TRIANGLES, 3);
const bunnyAttrs = Attributes.withIndexedBuffers(
    dev,
    bunny.elements,
    draw.locate({ a_position: bunny.positions }),
);


let ping = {
    tex: pingTex,
    fbo: pingFbo,
}

let pong = {
    tex: pongTex,
    fbo: pongFbo,
}

const loop = time => {
    /*

    By repeating the following process, we gain a buildup of past frame memory
    in our ping/pong buffers, with an exponential falloff.

    */

    // We first draw the scene to a "newFrame" fbo
    newFrameFbo.target(rt => {
        rt.clear(BufferBits.COLOR);
        rt.draw(draw, bunnyAttrs, { time });
    });

    // Then blend newFrame and ping to pong proportionate to PERSISTENCE_FACTOR
    pong.fbo.target(rt => {
        rt.draw(
            blend,
            screenspaceAttrs,
            { newFrame: newFrameTex, ping: ping.tex },
        );
    });

    // Lastly copy the contents of pong to canvas
    dev.target(rt => {
        rt.blit(pong.fbo, BufferBits.COLOR);
    });

    // ... and swap the fbos
    const tmp = ping;
    ping = pong;
    pong = tmp;

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
