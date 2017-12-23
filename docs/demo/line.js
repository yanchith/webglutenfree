import { Device, Command } from "./lib/glutenfree.es.min.js";

const dev = Device.mount();

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec4 a_color;

        out vec4 v_color;

        void main() {
            v_color = a_color;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        in vec4 v_color;

        out vec4 o_color;

        void main() {
            o_color = v_color;
        }
    `,
    data: {
        attributes: {
            a_position: [
                [-0.3, -0.5],
                [0.3, -0.5],
                [0, 0.5],
            ],
            a_color: [
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [0, 0, 1, 1],
            ],
        },
        elements: [
            [0, 1],
            [1, 2],
            [2, 0],
        ],
    },
    primitive: "lines",
});

cmd.execute();