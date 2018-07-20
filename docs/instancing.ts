/**
 * This example demonstrates the use of instancing - using a single draw
 * call to render multiple similar objects.
 *
 * Instancing in WebGL is done using instanced attributes. These are set up to
 * read the underlying buffer elements more than once, causing more objects to
 * be drawn.
 *
 * In this example, there is a single attribute containing the geometry, and
 * two instanced atributes containing instance position offsets and colors.
 */

import {
    Device,
    Command,
    Attributes,
    AttributeType,
    VertexBuffer,
    BufferBits,
    DataType,
} from "./lib/webglutenfree.js";
import { mat4 } from "./libx/gl-matrix.js";

const dev = Device.create();
const [width, height] = [dev.canvasCSSWidth, dev.canvasCSSHeight];

const viewMatrix = mat4.identity(mat4.create());

// There is nothing special about this draw command. It uses 3 attributes and
// does not actually know two of those are instanced.
const cmd = Command.create(
    dev,
    `#version 300 es
    precision mediump float;

    uniform mat4 u_proj;
    uniform mat4 u_model;
    uniform mat4 u_view;

    layout (location = 0) in vec2 a_position;
    layout (location = 1) in vec2 a_offset;
    layout (location = 2) in vec4 a_color;

    out vec4 v_vertex_color;

    void main() {
        v_vertex_color = a_color;
        gl_Position = u_proj
            * u_view
            * u_model
            * vec4(a_position + a_offset, 0.0, 1.0);
    }
    `,
    `#version 300 es
    precision mediump float;

    in vec4 v_vertex_color;

    out vec4 f_color;

    void main() {
        f_color = v_vertex_color;
    }
    `,
    {
        uniforms: {
            u_proj: {
                type: "matrix4fv",
                value: mat4.ortho(
                    mat4.create(),
                    -width / 2,
                    width / 2,
                    -height / 2,
                    height / 2,
                    -0.1,
                    1000.0,
                ),
            },
            u_model: {
                type: "matrix4fv",
                value: mat4.fromScaling(mat4.create(), [50, 50, 100]),
            },
            u_view: {
                type: "matrix4fv",
                value: () => mat4.rotateZ(viewMatrix, viewMatrix, 0.01),
            },
        },
    },
);

// Instancing setup happens here. To have instanced attributes, we need to use
// the complete attribute syntax, describing all of its aspects (type, count,
// size, ...). Instancing is turned on by adding the "divisor" field, which
// means: use a value from this attribute N times for each of the non-instanced
// attributes, before moving on to the next value.
const attrs = Attributes.create(
    dev,
    [
        [0, 3, 2],
        [1, 3, 0],
    ],
    {
        // The quad geometry
        0: [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ],
        // Position offset attributes
        1: {
            type: AttributeType.POINTER,
            buffer: VertexBuffer.withTypedArray(dev, DataType.FLOAT, [
                3, 3,
                0, 3,
                3, 0,
                -3, -3,
                0, -3,
                -3, 0,
                0, 0,
            ]),
            count: 7,
            size: 2,
            // Setting the divisor to 1 makes this an instanced attribute
            divisor: 1,
        },
        // Color attributes
        2: {
            type: AttributeType.POINTER,
            buffer: VertexBuffer.withTypedArray(dev, DataType.UNSIGNED_BYTE, [
                255, 0, 0, 255,
                0, 255, 0, 255,
                0, 0, 255, 255,
                0, 255, 255, 255,
                255, 0, 255, 255,
                255, 255, 0, 255,
                255, 255, 255, 255,
            ]),
            count: 7,
            size: 4,
            normalized: true,
            // Setting the divisor to 1 makes this an instanced attribute
            divisor: 1,
        },
    },
);

const loop = (): void => {
    dev.target((rt) => {
        rt.clear(BufferBits.COLOR);
        rt.draw(cmd, attrs);
    });
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
