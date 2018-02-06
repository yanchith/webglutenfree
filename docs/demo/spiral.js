import {
    Device,
    BufferBits,
    Command,
    BlendFunc,
    Attributes,
    Primitive,
} from "./lib/webglutenfree.es.js";
import * as spiral from "./lib/spiral.js"

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const view = mat4.create();

const cmd = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_model, u_view;

        layout (location = 0) in vec3 a_position;
        layout (location = 1) in vec3 a_normal;

        out vec4 v_color;

        void main() {
            v_color = vec4(a_normal, 1.0);
            gl_Position = u_projection
                * u_view
                * u_model
                * vec4(a_position, 1.0);
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
                value: mat4.fromRotation(mat4.create(), Math.PI / 2, [0.4, 1, 0]),
            },
            u_view: {
                type: "matrix4fv",
                value: time => mat4.lookAt(
                    view,
                    [50 * Math.cos(time / 5000), 2.5, 50 * Math.sin(time / 5000)],
                    [0, 0, 0],
                    [0, 1, 0]
                ),
            },
        },
        blend: {
            func: {
                src: BlendFunc.CONSTANT_ALPHA,
                dst: BlendFunc.ONE_MINUS_CONSTANT_ALPHA,
            },
            color: [0, 0, 0, 0.4],
        },
    },
);

const attrs = Attributes.withBuffers(
    dev,
    Primitive.TRIANGLES,
    cmd.locate({
        a_position: spiral.positions,
        a_normal: spiral.normals,
    }),
);

const loop = time => {
    dev.target(rt => {
        rt.clear(BufferBits.COLOR);
        rt.draw(cmd, attrs, time);
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
