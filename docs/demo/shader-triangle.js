import { Device, Command } from "./lib/glutenfree.es.min.js";

const dev = Device.mount();

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        out vec4 v_color;

        vec4[3] VERTICES = vec4[3] (
            vec4(-0.3, -0.5, 0, 1),
            vec4(0.3, -0.5, 0, 1),
            vec4(0, 0.5, 0, 1)
        );

        vec4[3] COLORS = vec4[3] (
            vec4(1, 0, 0, 1),
            vec4(0, 1, 0, 1),
            vec4(0, 0, 1, 1)
        );

        void main() {
            int id = gl_VertexID % 3;
            v_color = COLORS[id];
            gl_Position = VERTICES[id];
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
    count: 3,
});

cmd.execute();
