/**
 * This example demonstrates a simple particle system using instancing and
 * per-frame buffer updates.
 */

import {
    Device,
    UniformType,
    BlendFunc,
    DepthFunc,
    AttributeType,
    TargetBufferBitmask,
    BufferUsage,
    ElementPrimitive,
    VertexBufferFloatDataType,
} from "./lib/webglutenfree.js";
import { mat3, mat4 } from "./libx/gl-matrix.js";

const N_PARTICLES = 5000;
const CAMERA_DISTANCE = 10000;
const SCALE = 1000;
const PARTICLE_WANDER_FACTOR = 0.005;
const PARTICLE_SCALE = 0.015;

const dev = Device.create();
const [width, height] = [dev.physicalWidth, dev.physicalHeight];

const viewMatrix = mat4.create();

interface CmdProps {
    time: number;
    step: number;
}

const cmd = dev.createCommand<CmdProps>(
    `#version 300 es
    precision mediump float;

    uniform mat4 u_proj, u_view, u_model;
    uniform mat3 u_model_local;
    uniform float u_flip;

    layout (location = 0) in vec3 a_position;
    layout (location = 1) in vec3 a_local_orig;
    layout (location = 2) in vec3 a_local_flip;

    void main() {
        // We need the view matrix right and up vectors to make
        // the particles face screen
        vec3 right = vec3(u_view[0][0], u_view[1][0], u_view[2][0]);
        vec3 up = vec3(u_view[0][1], u_view[1][1], u_view[2][1]);

        // Flip based on u_flip
        vec3 local = a_local_orig + (a_local_flip - a_local_orig) * u_flip;
        vec3 local_transformed = u_model_local * local;

        // Combine the position with applied right and up
        vec3 position = a_position
            + right * local_transformed.x
            + up * local_transformed.y;

        gl_Position = u_proj * u_view * u_model * vec4(position, 1.0);
        }
    `,
    `#version 300 es
    precision mediump float;

    out vec4 f_color;

    void main() {
        f_color = vec4(0.9, 0.9, 1.0, 0.8);
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
                    100000,
                ),
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: ({ time }) => mat4.lookAt(
                    viewMatrix,
                    [
                        CAMERA_DISTANCE * Math.cos(time / 10000),
                        1,
                        CAMERA_DISTANCE * Math.sin(time / 10000),
                    ],
                    [0, 0, 0],
                    [0, 1, 0],
                ),
            },
            u_model: {
                type: UniformType.FLOAT_MAT4,
                value: mat4.fromScaling(mat4.create(), [SCALE, SCALE, SCALE]),
            },
            u_model_local: {
                type: UniformType.FLOAT_MAT3,
                value: mat3.fromScaling(mat3.create(), [
                    PARTICLE_SCALE,
                    PARTICLE_SCALE,
                    PARTICLE_SCALE,
                ]),
            },
            u_flip: {
                type: UniformType.FLOAT,
                value: ({ step }) => step % 2,
            },
        },
        blend: {
            func: {
                src: BlendFunc.SRC_ALPHA,
                dst: BlendFunc.ONE_MINUS_SRC_ALPHA,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);


const positions = new Float32Array(N_PARTICLES * 3);
for (let i = 0; i < positions.length; i++) {
    positions[i] = Math.random() * 2 - 1;
}

const buffer = dev.createVertexBufferWithTypedArray(
    VertexBufferFloatDataType.FLOAT,
    positions,
    { usage: BufferUsage.DYNAMIC_DRAW },
);

const angle = Math.PI * 2 / 3;
const attrs = dev.createAttributes(ElementPrimitive.TRIANGLE_LIST, cmd.locate({
    // a_position is an instanced buffer containing the particles center
    a_position: {
        type: AttributeType.POINTER,
        buffer,
        count: positions.length / 3,  // 3 components per item
        size: 3,  // 3 components per item
        divisor: 1,
    },
    a_local_orig: [
        [Math.sin(angle * 2 + Math.PI), Math.cos(angle * 2 + Math.PI), 0],
        [Math.sin(angle + Math.PI), Math.cos(angle + Math.PI), 0],
        [Math.sin(angle * 3 + Math.PI), Math.cos(angle * 3 + Math.PI), 0],
    ],
    a_local_flip: [
        [Math.sin(angle * 2), Math.cos(angle * 2), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [Math.sin(angle * 3), Math.cos(angle * 3), 0],
    ],
}));

let t = 0;


const loop = (time: number): void => {
    for (let i = 0; i < positions.length; i++) {
        positions[i] += Math.random() * PARTICLE_WANDER_FACTOR
            - PARTICLE_WANDER_FACTOR / 2;
    }
    buffer.store(positions);

    dev.target((rt) => {
        rt.clear(TargetBufferBitmask.COLOR_DEPTH);
        rt.draw(cmd, attrs, { time, step: t });
    });

    t++;
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
