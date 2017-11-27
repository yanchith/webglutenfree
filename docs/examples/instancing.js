import { Device, Command, VertexArray } from "./lib/glutenfree.js";

const dev = Device.createAndMount();
const [w, h] = [dev.bufferWidth, dev.bufferHeight];

const view = mat4.identity(mat4.create());
mat4.translate(view, view, [0, 0, -1])

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection;
        uniform mat4 u_model;
        uniform mat4 u_view;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec2 a_vertex_offset;
        layout (location = 2) in vec4 a_vertex_color;

        out vec4 v_vertex_color;

        void main() {
            v_vertex_color = a_vertex_color;
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_vertex_position + a_vertex_offset, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        in vec4 v_vertex_color;

        layout (location = 0) out vec4 o_color;

        void main() {
            o_color = v_vertex_color;
        }
    `,
    uniforms: {
        u_projection: {
            type: "matrix4fv",
            value: mat4.ortho(
                mat4.create(),
                -w / 2,
                w / 2,
                -h / 2,
                h / 2,
                0.1,
                10.0,
            ),
        },
        u_model: {
            type: "matrix4fv",
            value: mat4.fromScaling(mat4.create(), [100, 100, 100]),
        },
        u_view: {
            type: "matrix4fv",
            value: () => mat4.rotateZ(view, view, 0.01),
        },
    },
    clear: {
        color: [0, 0, 0, 1],
    }
});

const instanced = VertexArray.create(dev, cmd.locate({
    attributes: {
        a_vertex_position: [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ],
        a_vertex_offset: {
            type: "pointer",
            value: {
                type: "f32",
                data: [
                    3, 3,
                    0, 3,
                    3, 0,
                    -3, -3,
                    0, -3,
                    -3, 0,
                    0, 0,
                ],
            },
            count: 7,
            size: 2,
            divisor: 1,
        },
        a_vertex_color: {
            type: "pointer",
            value: {
                type: "u8",
                data: [
                    255, 0, 0, 255,
                    0, 255, 0, 255,
                    0, 0, 255, 255,
                    0, 255, 255, 255,
                    255, 0, 255, 255,
                    255, 255, 0, 255,
                    255, 255, 255, 255,
                ],
            },
            count: 7,
            size: 4,
            normalized: true,
            divisor: 1,
        },
    },
    elements: [
        [0, 3, 2],
        [1, 3, 0],
    ],
}));

const loop = time => {
    cmd.execute(instanced);
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
