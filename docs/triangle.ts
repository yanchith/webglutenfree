/**
 * This example takes us through a classic rendering API rite of passage -
 * drawing the first triangle. It is heavily commented to explain what is
 * happening at every step.
 */

import { Device, Primitive } from "./lib/webglutenfree.js";

// The device is the entry point to the API, analogous to a WebGL context.
// It has multiple constructors, Device.create() being the most convenient, as
// it creates the canvas and acquires the WebGL context for you. For more
// control, see Device.createWithCanvas() and Device.createWithContext().
// All constructors take an options object, allowing you to customize various
// properties related context acquisition, or other WebGL related properties.
const dev = Device.create();

// Commands are used to draw or compute and consist of a vertex and fragment
// shaders, and optionally can be passed an options object, allowing us to
// control uniform variables, and to customize WebGL graphics pipeline stages,
// such as depth testing or blending.
const cmd = dev.createCommand(
    `#version 300 es
    precision mediump float;

    layout (location = 0) in vec2 a_position;
    layout (location = 1) in vec4 a_color;

    out vec4 v_color;

    void main() {
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `,
    `#version 300 es
    precision mediump float;

    in vec4 v_color;

    layout (location = 0) out vec4 f_color;

    void main() {
        f_color = v_color;
    }
    `,
);

// Attributes represent the data to draw. In most cases this means a WebGL
// vertex array object underneath. The data can be both indexed and not
// (we omit indices in this example for simplicity)
// Attributes can usually infer the size and count of your data, and create
// the neccessary buffers for you, but they can always be passed explicitely,
// when more control is needed (eg for updating buffers during runtime)
const attrs = dev.createAttributes(Primitive.TRIANGLES, {
    // The 0-th attribute is the vertex position (a_position)
    0: [
        [-0.3, -0.5],
        [0.3, -0.5],
        [0, 0.5],
    ],
    // The 1-st attribute is the vertex color (a_color)
    1: [
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1],
    ],
});

// Finally we get to drawing! We always need a target to draw to. Luckilly,
// the device instance has one handy! There are also other operations you can
// do with the target, such as clearing or blitting subrects. It is important
// to first ask for a render target and then draw to it in batch, as switching
// framebuffers can be fairly costly.
dev.target((rt) => {
    // The target is ready for drawing
    rt.draw(cmd, attrs);
});
