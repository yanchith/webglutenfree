import {
    Device,
    Command,
    AttributeData,
    Primitive,
} from "./lib/glutenfree.es.js";

const dev = Device.mount();

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec4 a_color;

        out vec4 v_color;

        void main() {
            v_color = a_color;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        in vec4 v_color;

        out vec4 f_color;

        void main() {
            f_color = v_color;
        }
    `,
);

const attrs = AttributeData.create(
    dev,
    Primitive.TRIANGLES,
    cmd.locate({
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
    }),
);

dev.target(rt => {
    rt.draw(cmd, attrs);
});
