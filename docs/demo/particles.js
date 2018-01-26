import {
    Device,
    Command,
    VertexBuffer,
    VertexBufferType,
    AttributeData,
    Primitive,
    BufferUsage,
} from "./lib/glutenfree.es.js";

const N_PARTICLES = 10000;
const WANDER_FACTOR = 0.01;

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const view = mat4.create();

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_PointSize = 2.0;
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
            f_color = vec4(1.0, 0.1, 0.3, 1.0);
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
            u_model: {
                type: "matrix4fv",
                value: mat4.identity(mat4.create()),
            },
            u_view: {
                type: "matrix4fv",
                value: time => mat4.lookAt(
                    view,
                    [4 * Math.cos(time / 1000), 1, 4 * Math.sin(time / 1000)],
                    [0, 0, 0],
                    [0, 1, 0],
                ),
            },
        },
    },
);

const halfWander = WANDER_FACTOR / 2;
const particlePositions = new Float32Array(N_PARTICLES * 3);
for (let i = 0; i < particlePositions.length; i++) {
    particlePositions[i] = Math.random() * 2 - 1;
}

const buffer = VertexBuffer.create(
    dev,
    VertexBufferType.FLOAT,
    particlePositions,
    BufferUsage.DYNAMIC_DRAW,
);

const attrs = AttributeData.create(
    dev,
    Primitive.POINTS,
    cmd.locate({
        a_position: {
            type: "pointer",
            buffer,
            count: particlePositions.length / 3,  // 3 components per item
            size: 3,  // 3 components per item
        },
    }),
);

const loop = time => {
    for (let i = 0; i < particlePositions.length; i++) {
        particlePositions[i] += Math.random() * WANDER_FACTOR - halfWander;
    }
    buffer.store(particlePositions);
    dev.target(rt => {
        rt.clearColorAndDepth(0, 0, 0, 1, 1);
        rt.draw(cmd, attrs, time);
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
