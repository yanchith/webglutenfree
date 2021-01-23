/**
 * This example loads some 3d models and draws them on the screen using goraud
 * shading.
 */

import {
    Device,
    UniformType,
    DepthFunc,
    TargetBufferBitmask,
} from "./lib/webglutenfree.js";
import { mat4 } from "./libx/gl-matrix.js";

import * as cube from "./libx/cube.js";
import * as bunny from "./libx/bunny.js";
import * as teapot from "./libx/teapot.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const dev = Device.createWithCanvasElement(canvas);
const [width, height] = [dev.physicalWidth, dev.physicalHeight];

const viewMatrix = mat4.create();

interface CmdProps {
    time: number;
    modelMatrix: mat4;
}

const cmd = dev.createCommand<CmdProps>(
    `#version 300 es
    precision mediump float;

    uniform mat4 u_proj, u_view, u_model;

    layout (location = 0) in vec3 a_position;
    layout (location = 1) in vec3 a_normal;

    out vec3 v_normal;

    void main() {
        mat4 matrix = u_proj * u_view * u_model;
        v_normal = transpose(inverse(mat3(matrix))) * a_normal;
        gl_Position = matrix * vec4(a_position, 1.0);
    }
    `,
    `#version 300 es
    precision mediump float;

    uniform vec3 u_light;

    in vec3 v_normal;

    out vec4 f_color;

    void main() {
        float brightness = dot(normalize(v_normal), normalize(u_light));
        vec3 dark = vec3(0.3, 0.0, 0.3);
        vec3 bright = vec3(1.0, 0.0, 0.8);
        f_color = vec4(mix(dark, bright, brightness), 1.0);
    }
    `,
    {
        uniforms: {
            u_proj: {
                type: UniformType.FLOAT_MAT4,
                value: mat4.perspective(
                    mat4.create(),
                    Math.PI / 4,
                    width / height,
                    0.1,
                    1000,
                ),
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: ({ time }) => mat4.lookAt(
                    viewMatrix,
                    [
                        30 * Math.cos(time / 1000),
                        2.5,
                        30 * Math.sin(time / 1000),
                    ],
                    [0, 2.5, 0],
                    [0, 1, 0],
                ),
            },
            u_model: {
                type: UniformType.FLOAT_MAT4,
                value: ({ modelMatrix }) => modelMatrix,
            },
            u_light: {
                type: UniformType.FLOAT_VEC3,
                value: [1, 0, 0],
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

const models = [teapot, bunny, cube];

const objs = models.map((m, i) => {
    const angle = i / models.length * 2 * Math.PI;
    const scale = (i + 1) * 0.1;
    const modelMatrix = mat4.fromRotation(mat4.create(), angle, [0, 1, 0]);
    mat4.translate(modelMatrix, modelMatrix, [4, 0, 0]);
    mat4.scale(modelMatrix, modelMatrix, [scale, scale, scale]);
    return {
        modelMatrix,
        attrs: dev.createAttributes(m.elements, {
            0: m.positions,
            1: m.normals,
        }),
    };
});

const loop = (time: number): void => {
    dev.target((rt) => {
        rt.clear(TargetBufferBitmask.COLOR_DEPTH);
        rt.batch(cmd, (draw) => {
            objs.forEach(({ attrs, modelMatrix }) => {
                draw(attrs, { time, modelMatrix });
            });
        });
    });
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
