import { Command, VertexArray } from "./lib/glutenfree.js";

const canvas = document.getElementById("canvas");
const dpr = window.devicePixelRatio;
canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
const gl = canvas.getContext("webgl2");

const cmd = Command.create(gl, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_vertex_position;
        layout (location = 1) in vec4 a_vertex_color;

        out vec4 v_vertex_color;

        void main() {
            v_vertex_color = a_vertex_color;
            gl_Position = vec4(a_vertex_position, 0.0, 1.0);
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
});

const triangle = VertexArray.create(gl, {
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

cmd.execute(triangle);
