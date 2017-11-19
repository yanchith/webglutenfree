import { Device, Command, VertexArray } from "./lib/glutenfree.js";
import { positions as bunnyPositions, cells as bunnyCells } from "./lib/bunny.js"

const dev = Device.createAndMount();
const [w, h] = [dev.width, dev.height];

const view = mat4.create();

const cmd = Command.create(dev, {
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
                w / h,
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
            value: time => mat4.lookAt(
                view,
                [30 * Math.cos(time / 1000), 2.5, 30 * Math.sin(time / 1000)],
                [0, 2.5, 0],
                [0, 1, 0]
            ),
        },
    },
    blend: true,
    clear: {
        color: [0, 0, 0, 1],
    }
});

const bunny = VertexArray.create(dev, cmd.locate({
    attributes: {
        a_vertex_position: bunnyPositions,
    },
    elements: bunnyCells,
}));

const loop = time => {
    cmd.execute(bunny, time);
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
