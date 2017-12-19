import { Device, Command, VertexArray } from "./lib/glutenfree.es.min.js";
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

const view = mat4.lookAt(
    mat4.create(),
    [3, 5, 10],
    [0, 1, 0],
    [0, 1, 0],
);

const drawObjects = Command.create(dev, {
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
            value: ({ model }) => model,
        },
        u_view: {
            type: "matrix4fv",
            value: view,
        },
        u_projection: {
            type: "matrix4fv",
            value: projection,
        },
    },
    data: ({ geometry }) => geometry,
    depth: { func: "less" },
    stencil: {
        func: {
            func: "always",
            ref: 1,
            mask: 0xFF,
        },
        mask: 0xFF,
        op: {
            fail: "keep",
            zfail: "keep",
            zpass: "replace",
        },
    },
});

const drawOutlines = Command.create(dev, {
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
            o_color = vec4(0.0, 1.0, 0.0, 1.0);
        }
    `,
    uniforms: {
        u_model: {
            type: "matrix4fv",
            value: ({ model }) => model,
        },
        u_view: {
            type: "matrix4fv",
            value: view,
        },
        u_projection: {
            type: "matrix4fv",
            value: projection,
        },
    },
    data: ({ geometry }) => geometry,
    stencil: {
        func: {
            func: "notequal",
            ref: 1,
            mask: 0xFF,
        },
        mask: 0x00,
        op: {
            fail: "keep",
            zfail: "keep",
            zpass: "keep",
        },
    },
});

const cubeMesh = VertexArray.create(dev, drawObjects.locate({
    attributes: { a_position: cube.positions },
    elements: cube.elements
}));

const bunnyMesh = VertexArray.create(dev, drawObjects.locate({
    attributes: { a_position: bunny.positions },
    elements: bunny.elements,
}));

const cubeModel = mat4.fromScaling(mat4.create(), [0.5, 0.5, 0.5]);
const bunnyModel = mat4.fromRotationTranslationScale(
    mat4.create(),
    quat.fromEuler(quat.create(), 0, 120, 0),
    [-3, 0, 0],
    [0.2, 0.2, 0.2],
);

const cubeOutlineModel = mat4.scale(mat4.create(), cubeModel, [1.1, 1.1, 1.1]);
const bunnyOutlineModel = mat4.scale(mat4.create(), bunnyModel, [1.1, 1.1, 1.1]);

dev.clear(0, 0, 0, 1, 1, 0);
drawObjects.execute([
    { geometry: cubeMesh, model: cubeModel },
    { geometry: bunnyMesh, model: bunnyModel },
]);
drawOutlines.execute([
    { geometry: cubeMesh, model: cubeOutlineModel },
    { geometry: bunnyMesh, model: bunnyOutlineModel },
]);
