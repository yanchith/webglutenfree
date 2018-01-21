import {
    Device,
    Command,
    VertexArray,
    DepthFunc,
    StencilFunc,
    StencilOp,
} from "./lib/glutenfree.es.js";
import * as cube from "./lib/cube.js"
import * as bunny from "./lib/bunny.js"

const dev = Device.mount();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const projection = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    width / height,
    0.1,
    1000,
);

const view = mat4.create();

const drawObjects = Command.create(
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
                value: ({ model }) => model,
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

const drawOutlines = Command.create(
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
                value: ({ model }) => model,
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

const cubeGeometry = VertexArray.indexed(
    dev,
    cube.elements,
    drawObjects.locate({ a_position: cube.positions }),
);

const bunnyGeometry = VertexArray.indexed(
    dev,
    bunny.elements,
    drawObjects.locate({ a_position: bunny.positions }),
);

const cubeModel = mat4.fromScaling(mat4.create(), [0.5, 0.5, 0.5]);
const bunnyModel = mat4.fromRotationTranslationScale(
    mat4.create(),
    quat.fromEuler(quat.create(), 0, 120, 0),
    [-3, 0, 0],
    [0.2, 0.2, 0.2],
);

const cubeOutlnModel = mat4.scale(mat4.create(), cubeModel, [1.04, 1.04, 1.04]);
const bunnyOutlnModel = mat4.scale(mat4.create(), bunnyModel, [1.04, 1.04, 1.04]);

const loop = time => {
    dev.target(rt => {
        rt.clear(0, 0, 0, 1, 1, 0);
        rt.batch(drawObjects, draw => {
            draw(cubeGeometry, { time, model: cubeModel });
            draw(bunnyGeometry, { time, model: bunnyModel });
        });
        rt.batch(drawOutlines, draw => {
            draw(cubeGeometry, { time, model: cubeOutlnModel });
            draw(bunnyGeometry, { time, model: bunnyOutlnModel });
        });
    });
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
