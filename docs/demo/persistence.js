/**
 * Implemented straight from this excellent talk by Gregg Tavares:
 * https://www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s
 */

import {
    Device,
    Command,
    VertexArray,
    Texture,
    TextureInternalFormat,
    Framebuffer,
} from "./lib/glutenfree.es.js";
import * as square from "./lib/square.js"
import * as bunny from "./lib/bunny.js"

const PERSISTENCE_FACTOR = 0.8;

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const newFrameTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const newFrameFbo = Framebuffer.create(dev, { width, height, color: newFrameTex });

const pingTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const pingFbo = Framebuffer.create(dev, { width, height, color: pingTex });

const pongTex = Texture.empty(dev, width, height, TextureInternalFormat.RGBA8);
const pongFbo = Framebuffer.create(dev, { width, height, color: pongTex });

const view = mat4.create();

const screenspaceGeometry = VertexArray.indexed(dev, square.elements, {
    0: square.positions,
    1: square.texCoords,
});

const draw = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_Position = u_projection
                * u_model
                * u_view
                * vec4(a_position, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(0.8, 0.3, 0.7, 1.0);
        }
    `,
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
        u_model: {
            type: "matrix4fv",
            value: mat4.identity(mat4.create()),
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
});

const bunnyGeometry = VertexArray.indexed(dev, bunny.elements, draw.locate({
    a_position: bunny.positions,
}));

const blend = Command.create(dev, {
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
    uniforms: {
        u_new_frame: {
            type: "texture",
            value: ({ newFrame }) => newFrame,
        },
        u_ping: {
            type: "texture",
            value: ({ ping }) => ping,
        },
        u_blend_factor: {
            type: "1f",
            value: PERSISTENCE_FACTOR,
        }
    },
});

const copyToCanvas = Command.create(dev, {
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

        uniform sampler2D u_source;

        in vec2 v_tex_coord;

        out vec4 f_color;

        void main() {
            f_color = texture(u_source, v_tex_coord);
        }
    `,
    uniforms: {
        u_source: {
            type: "texture",
            value: ({ source }) => source,
        }
    },
})


let ping = {
    tex: pingTex,
    fbo: pingFbo,
}

let pong = {
    tex: pongTex,
    fbo: pongFbo,
}

const loop = time => {
    dev.clearColorAndDepth(0, 0, 0, 1, 1, newFrameFbo);
    dev.clearColor(0, 0, 0, 1);

    /*

    By repeating the following process, we gain a buildup of past frame memory
    in our ping/pong buffers, with an exponential falloff.

    */

    // We first draw the scene to a "newFrame" fbo
    draw.batch(execute => {
        execute(bunnyGeometry, { time });
    }, newFrameFbo);

    // Then blend newFrame and ping to pong proportionate to PERSISTENCE_FACTOR
    blend.batch(execute => {
        execute(screenspaceGeometry, { newFrame: newFrameTex, ping: ping.tex });
    }, pong.fbo);

    // Lastly copy the contents of pong to canvas
    copyToCanvas.batch(execute => {
        execute(screenspaceGeometry, { source: pong.tex });
    });

    // ... and swap the fbos
    const tmp = ping;
    ping = pong;
    pong = tmp;

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
