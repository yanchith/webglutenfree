import {
    Device,
    BufferBits,
    Command,
    BlendFunc,
    Attributes,
} from "./lib/webglutenfree.js";
import { mat4 } from "./lib/gl-matrix-min.js";

import * as cube from "./lib/cube.js";
import * as bunny from "./lib/bunny.js";
import * as teapot from "./lib/teapot.js";

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const view = mat4.create();

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view, u_model;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_position, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(0.1, 1.0, 0.3, 1.0);
        }
    `,
    {
        uniforms: {
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
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    view,
                    [30 * Math.cos(time / 1000), 2.5, 30 * Math.sin(time / 1000)],
                    [0, 2.5, 0],
                    [0, 1, 0]
                ),
            },
            u_model: {
                type: "matrix4fv",
                value: ({ matrix }) => matrix,
            }
        },
    },
);

const models = [teapot, bunny, cube];

const objs = models.map((m, i) => {
    const angle = i / models.length * 2 * Math.PI;
    const scale = (i + 1) * 0.1;
    const matrix = mat4.fromRotation(mat4.create(), angle, [0, 1, 0]);
    mat4.translate(matrix, matrix, [4, 0, 0]);
    mat4.scale(matrix, matrix, [scale, scale, scale]);
    return {
        matrix,
        attrs: Attributes.withIndexedBuffers(
            dev,
            m.elements,
            { 0: m.positions },
        ),
    };
});

const loop = time => {
    dev.target(rt => {
        rt.clear(BufferBits.COLOR);
        rt.batch(cmd, draw => {
            objs.forEach(({ attrs, matrix }) => {
                draw(attrs, { time, matrix });
            });
        });
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
