import {
    Device,
    BufferBits,
    Command,
    BlendFunc,
    VertexBuffer,
    VertexBufferType,
    AttributeData,
    Primitive,
    BufferUsage,
} from "./lib/webglutenfree.es.js";

const N_PARTICLES = 10000;
const WANDER_FACTOR = 1;
const CAMERA_DISTANCE = 600;
const CUBE_SCALE = 400;
const PARTICLE_SCALE = 1;

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const view = mat4.create();
let flip = 0;

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view;
        // uniform mat3 u_model_local;
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
            // vec3 local_transformed = u_model_local * local;

            // Combine the position with applied right and up
            vec3 position = a_position
                + right * local.x
                + up * local.y;

            gl_Position = u_projection * u_view * vec4(position, 1.0);
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
                    Math.PI / 4,
                    width / height,
                    0.1,
                    1000,
                ),
            },
            u_view: {
                type: "matrix4fv",
                value: time => mat4.lookAt(
                    view,
                    [
                        CAMERA_DISTANCE * Math.cos(time / 10000),
                        1,
                        CAMERA_DISTANCE * Math.sin(time / 10000),
                    ],
                    [0, 0, 0],
                    [0, 1, 0],
                ),
            },
            // u_model_local: {
            //     type: "matrix3fv",
            //     value: mat3.fromScaling(mat3.create(), [
            //         PARTICLE_SCALE,
            //         PARTICLE_SCALE,
            //         PARTICLE_SCALE,
            //     ]),
            // },
            u_flip: {
                type: "1f",
                value: () => flip++ % 2,
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
    particlePositions[i] = Math.random() * CUBE_SCALE / 2 - CUBE_SCALE / 4;
}

const buffer = VertexBuffer.create(
    dev,
    VertexBufferType.FLOAT,
    particlePositions,
    BufferUsage.DYNAMIC_DRAW,
);

const angle = Math.PI * 2 / 3;
const attrs = AttributeData.create(
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

const update = () => {
    for (let i = 0; i < particlePositions.length; i++) {
        particlePositions[i] += Math.random() * WANDER_FACTOR - WANDER_FACTOR / 2;
    }
    buffer.store(particlePositions);
}

const loop = time => {
    update();

    dev.target(rt => {
        rt.clear(BufferBits.COLOR);
        rt.draw(cmd, attrs, time);
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
