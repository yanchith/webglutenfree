import { Device, Command, VertexArray } from "./lib/glutenfree.es.min.js";
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

        out vec4 o_color;

        void main() {
            o_color = vec4(1.0);
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

const cubeMesh = VertexArray.create(dev, {
    attributes: { 0: cube.positions },
    elements: cube.elements
})

const bunnyMesh = VertexArray.create(dev, {
    attributes: { 0: bunny.positions },
    elements: bunny.elements,
})

const triangleModelMatrix = mat4.fromTranslation(mat4.create(), [200, 0, 0]);
const squareModelMatrix = mat4.fromTranslation(mat4.create(), [-200, 0, 0]);

mat4.scale(triangleModelMatrix, triangleModelMatrix, [500, 500, 1]);
mat4.scale(squareModelMatrix, squareModelMatrix, [500, 500, 1]);

cmd.execute(
    [cubeMesh, bunnyMesh],
    [triangleModelMatrix, squareModelMatrix],
);
