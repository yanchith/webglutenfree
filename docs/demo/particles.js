import {
    Device,
    BufferBits,
    Command,
    BlendFunc,
    VertexBuffer,
    Attributes,
    BufferUsage,
    DataType,
    Primitive,
} from "./lib/webglutenfree.js";
import { mat3, mat4 } from "./lib/gl-matrix-min.js";

const N_PARTICLES = 5000;
const WANDER_FACTOR = 0.005;
const CAMERA_DISTANCE = 10000;
const SCALE = 1000;
const PARTICLE_SCALE = 0.015;
const FOV = Math.PI / 4;
const Z_NEAR = 0.1;
const Z_FAR = 1000000;

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const viewBuffer = mat4.create();
let tick = 0;

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view, u_model;
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

            gl_Position = u_projection * u_view * u_model * vec4(position, 1.0);
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
            u_projection: {
                type: "matrix4fv",
                value: mat4.perspective(
                    mat4.create(),
                    FOV,
                    width / height,
                    Z_NEAR,
                    Z_FAR,
                ),
            },
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    viewBuffer,
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
                type: "matrix4fv",
                value: mat4.fromScaling(mat4.create(), [SCALE, SCALE, SCALE]),
            },
            u_model_local: {
                type: "matrix3fv",
                value: mat3.fromScaling(mat3.create(), [
                    PARTICLE_SCALE,
                    PARTICLE_SCALE,
                    PARTICLE_SCALE,
                ]),
            },
            u_flip: {
                type: "1f",
                value: ({ tick }) => tick % 2,
            },
        },
        blend: {
            func: {
                src: BlendFunc.SRC_ALPHA,
                dst: BlendFunc.ONE_MINUS_SRC_ALPHA,
            },
        },
    },
);


const particlePositions = new Float32Array(N_PARTICLES * 3);
for (let i = 0; i < particlePositions.length; i++) {
    particlePositions[i] = Math.random() * 2 - 1;
}

const buffer = VertexBuffer.withTypedArray(
    dev,
    DataType.FLOAT,
    particlePositions,
    { usage: BufferUsage.DYNAMIC_DRAW },
);

const angle = Math.PI * 2 / 3;
const attrs = Attributes.withBuffers(
    dev,
    Primitive.TRIANGLES,
    cmd.locate({
        // a_position is an instanced buffer containing the particles center
        a_position: {
            type: "pointer",
            buffer,
            count: particlePositions.length / 3,  // 3 components per item
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
    }),
);

const loop = time => {
    for (let i = 0; i < particlePositions.length; i++) {
        particlePositions[i] += Math.random() * WANDER_FACTOR - WANDER_FACTOR / 2;
    }
    buffer.store(particlePositions);

    dev.target(rt => {
        rt.clear(BufferBits.COLOR);
        rt.draw(cmd, attrs, { time, tick });
    });

    tick++;
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
