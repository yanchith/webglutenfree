import {
    Device,
    BufferBits,
    Command,
    Attributes,
    DepthFunc,
    StencilFunc,
    StencilOp,
} from "./lib/webglutenfree.js";
import { mat4 } from "./lib/gl-matrix-min.js";

import * as cube from "./lib/cube.js";
import * as bunny from "./lib/bunny.js";
import * as teapot from "./lib/teapot.js";

const dev = Device.create();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const projection = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    width / height,
    0.1,
    1000,
);

const view = mat4.create();

const cmdDraw = Command.create(
    dev,
    `#version 300 es
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
    `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float factor = 1.0 - 1.0 / depth * 5.0;
            f_color = mix(
                vec4(0.2, 0.0, 0.8, 1.0),
                vec4(0.2, 0.0, 0.0, 1.0),
                factor
            );
        }
    `,
    {
        uniforms: {
            u_model: {
                type: "matrix4fv",
                value: ({ matrix }) => matrix,
            },
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    view,
                    [Math.sin(time / 1000) * 10, 5, Math.cos(time / 1000) * 10],
                    [0, 1, 0],
                    [0, 1, 0],
                ),
            },
            u_projection: {
                type: "matrix4fv",
                value: projection,
            },
        },
        depth: { func: DepthFunc.LESS },
        stencil: {
            func: {
                func: StencilFunc.ALWAYS,
                ref: 1,
                mask: 0xFF,
            },
            mask: 0xFF,
            op: {
                fail: StencilOp.KEEP,
                zfail: StencilOp.KEEP,
                zpass: StencilOp.REPLACE,
            },
        },
    },
);

const cmdDrawOutlines = Command.create(
    dev,
    `#version 300 es
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
    `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(0.0, 1.0, 0.0, 1.0);
        }
    `,
    {
        uniforms: {
            u_model: {
                type: "matrix4fv",
                value: ({ matrix }) => matrix,
            },
            u_view: {
                type: "matrix4fv",
                value: ({ time }) => mat4.lookAt(
                    view,
                    [Math.sin(time / 1000) * 10, 5, Math.cos(time / 1000) * 10],
                    [0, 1, 0],
                    [0, 1, 0],
                ),
            },
            u_projection: {
                type: "matrix4fv",
                value: projection,
            },
        },
        stencil: {
            func: {
                func: StencilFunc.NOTEQUAL,
                ref: 1,
                mask: 0xFF,
            },
            mask: 0x00,
        },
    },
);

const models = [teapot, bunny, cube];

const objs = models.map((m, i) => {
    const angle = i / models.length * 2 * Math.PI;
    const scale = (i + 1) * 0.1;
    const matrix = mat4.fromRotation(mat4.create(), angle, [0, 1, 0]);
    mat4.translate(matrix, matrix, [2, 0, 0]);
    mat4.scale(matrix, matrix, [scale, scale, scale]);
    return {
        matrix,
        attrs: Attributes.create(dev, m.elements, { 0: m.positions }),
    };
});

const outlineObjs = objs.map(obj => {
    return {
        matrix: mat4.scale(mat4.create(), obj.matrix, [1.04, 1.04, 1.04]),
        attrs: obj.attrs,
    }
});

const loop = time => {
    dev.target(rt => {
        rt.clear(BufferBits.COLOR_DEPTH_STENCIL);
        rt.batch(cmdDraw, draw => {
            objs.forEach(({ attrs, matrix }) => {
                draw(attrs, { time, matrix });
            });
        });
        rt.batch(cmdDrawOutlines, draw => {
            outlineObjs.forEach(({ attrs, matrix }) => {
                draw(attrs, { time, matrix });
            });
        });
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
