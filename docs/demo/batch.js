import { Device, Command, VertexArray } from "./lib/glutenfree.es.js";
import * as cube from "./lib/cube.js"
import * as bunny from "./lib/bunny.js"

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec3 a_position;

        out vec4 v_vertex_color;

        void main() {
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_position, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(1.0);
        }
    `,
    uniforms: {
        u_model: {
            type: "matrix4fv",
            value: ({ modelMatrix }) => modelMatrix,
        },
        u_view: {
            type: "matrix4fv",
            value: mat4.lookAt(
                mat4.create(),
                [3, 5, 10],
                [0, 1, 0],
                [0, 1, 0],
            ),
        },
        u_projection: {
            type: "matrix4fv",
            value: mat4.perspective(
                mat4.create(),
                Math.PI / 4,
                width / height,
                0.1,
                1000,
            ),
        },
    },
});

const cubeGeometry = VertexArray.indexed(
    dev,
    cube.elements,
    cmd.locate({ a_position: cube.positions }),
);

const bunnyGeometry = VertexArray.indexed(
    dev,
    bunny.elements,
    cmd.locate({ a_position: bunny.positions }),
);

const cubeModelMatrix = mat4.fromScaling(mat4.create(), [0.5, 0.5, 0.5]);
const bunnyModelMatrix = mat4.fromRotationTranslationScale(
    mat4.create(),
    quat.fromEuler(quat.create(), 0, 120, 0),
    [-3, 0, 0],
    [0.2, 0.2, 0.2],
);

dev.clearColor(0, 0, 0, 1);
cmd.batch(execute => {
    execute(cubeGeometry, { modelMatrix: cubeModelMatrix });
    execute(bunnyGeometry, { modelMatrix: bunnyModelMatrix });
})
