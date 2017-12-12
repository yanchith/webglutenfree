import {
    Device,
    Command,
    VertexArray,
    Texture,
    Framebuffer,
} from "./lib/glutenfree.js";
import { positions as bunnyPositions, cells as bunnyCells } from "./lib/bunny.js"

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const newFrameTex = Texture.fromRGBA8(dev, null, width, height);
const newFrameFbo = Framebuffer.create(dev, {
    width,
    height,
    color: newFrameTex,
});

const pingTex = Texture.fromRGBA8(dev, null, width, height);
const pingFbo = Framebuffer.create(dev, {
    width,
    height,
    color: pingTex,
});

const pongTex = Texture.fromRGBA8(dev, null, width, height);
const pongFbo = Framebuffer.create(dev, {
    width,
    height,
    color: pongTex,
});

const view = mat4.create();

const draw = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec3 a_vertex_position;

        void main() {
            gl_Position = u_projection
                * u_model
                * u_view
                * vec4(a_vertex_position, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        out vec4 o_color;

        void main() {
            o_color = vec4(0.0, 1.0, 0.0, 0.3);
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
    blend: {
        src: "constant-alpha",
        dst: "one-minus-constant-alpha",
        color: [0, 0, 0, 0.2],
    },
    framebuffer: ({ target }) => target,
});

const blend = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        uniform sampler2D u_source;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 o_color;

        void main() {
            o_color = texture(u_source, v_tex_coord);
        }
    `,
    uniforms: {
        u_source: {
            type: "texture",
            value: ({ source }) => source,
        }
    },
    blend: {
        src: "constant-alpha",
        dst: "one-minus-constant-alpha",
        color: [0, 0, 0, 0.5],
    },
    framebuffer: ({ target }) => target,
});

const copyToCanvas = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_tex_coord;

        out vec2 v_tex_coord;

        void main() {
            v_tex_coord = a_tex_coord;
            gl_Position = vec4(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        uniform sampler2D u_source;

        in vec2 v_tex_coord;

        layout (location = 0) out vec4 o_color;

        void main() {
            o_color = texture(u_source, v_tex_coord);
        }
    `,
    uniforms: {
        u_source: {
            type: "texture",
            value: ({ source }) => source,
        }
    },
})

const bunny = VertexArray.create(dev, draw.locate({
    attributes: { a_vertex_position: bunnyPositions },
    elements: bunnyCells,
}));

const screenspace = VertexArray.create(dev, {
    attributes: {
        0: [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ],
        1: [
            [1, 1],
            [0, 1],
            [1, 0],
            [0, 0],
        ],
    },
    elements: [
        [0, 3, 2],
        [1, 3, 0],
    ],
});

dev.clearColorBuffer(0, 0, 0, 1, pingFbo);
dev.clearColorBuffer(0, 0, 0, 1, pongFbo);

let source = {
    tex: pingTex,
    fbo: pingFbo,
}

let target = {
    tex: pongTex,
    fbo: pongFbo,
}

const loop = time => {
    dev.clearColorBuffer(0, 0, 0, 1, newFrameFbo);
    dev.clearColorBuffer(0, 0, 0, 1);
    draw.execute(bunny, { time, target: newFrameFbo });
    blend.execute(screenspace, { source: newFrameTex, target: target.fbo });
    blend.execute(screenspace, { source: source.tex, target: target.fbo });
    copyToCanvas.execute(screenspace, { source: target.tex })
    const tmp = source;
    source = target;
    target = tmp;
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
