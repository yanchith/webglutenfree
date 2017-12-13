import { Device, Command, VertexArray } from "./lib/glutenfree.es.min.js";

const dev = Device.mount();
const [width, height] = [dev.canvasCSSWidth, dev.canvasCSSHeight];

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec4 a_vertex_color;

        out vec4 v_vertex_color;

        void main() {
            v_vertex_color = a_vertex_color;
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_vertex_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        in vec4 v_vertex_color;

        out vec4 o_color;

        void main() {
            o_color = v_vertex_color;
        }
    `,
    uniforms: {
        u_model: {
            type: "matrix4fv",
            value: (props, i) => props[i],
        },
        u_view: {
            type: "matrix4fv",
            value: mat4.identity(mat4.create()),
        },
        u_projection: {
            type: "matrix4fv",
            value: mat4.ortho(
                mat4.create(),
                -width / 2,
                width / 2,
                -height / 2,
                height / 2,
                -0.1,
                1000.0,
            ),
        },
    },
});

const triangle = VertexArray.create(dev, {
    attributes: {
        0: [
            [-0.3, -0.5],
            [0.3, -0.5],
            [0, 0.5],
        ],
        1: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
        ]
    },
});

const square = VertexArray.create(dev, {
    attributes: {
        0: [
            [-0.2, -0.2],
            [-0.2, 0.2],
            [0.2, -0.2],
            [0.2, 0.2],
        ],
        1: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
            [1, 0, 1, 1],
        ]
    },
    elements: [
        [0, 3, 2],
        [1, 3, 0],
    ]
});

const triangleModelMatrix = mat4.fromTranslation(mat4.create(), [200, 0, 0]);
const squareModelMatrix = mat4.fromTranslation(mat4.create(), [-200, 0, 0]);

mat4.scale(triangleModelMatrix, triangleModelMatrix, [500, 500, 1]);
mat4.scale(squareModelMatrix, squareModelMatrix, [500, 500, 1]);

cmd.execute(
    [triangle, square],
    [triangleModelMatrix, squareModelMatrix],
);
