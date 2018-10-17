/**
 * This example demonstrates the possibility of drawing without using any vertex
 * buffers at all and instead specifying the number of vertices to draw.
 */

import { Device, ElementPrimitive } from "./lib/webglutenfree.js";

const dev = Device.create();

// This command uses gl_VertexID to determine which vertex are we drawing. We
// can think of the vertex shader as a function that maps the vertex id to
// real vertex (created on demand).
const cmd = dev.createCommand(
    `#version 300 es
    precision mediump float;

    out vec4 v_color;

    const vec4[3] VERTICES = vec4[3] (
        vec4(-0.9, -0.5, 0, 1),
        vec4(-0.3, -0.5, 0, 1),
        vec4(-0.6, 0.5, 0, 1)
    );

    void main() {
        int vid = gl_VertexID % 3;
        int cid = (gl_VertexID + 1) % 3;
        v_color = vec4(0, 0, 0, 1);
        v_color[cid] = 1.0;
        gl_Position = 0.1 * float(gl_VertexID / 3) + VERTICES[vid];
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
);

// .createEmptyAttributes() specifies that there are no attributes to read.
// We still need to tell WebGL the type ond number of primitives to draw, but
// internally no WebGL resources are constructed for empty attributes.
const attrs = dev.createEmptyAttributes(ElementPrimitive.TRIANGLE_LIST, 150);

dev.target((rt) => {
    rt.draw(cmd, attrs);
});
