import {
    Device,
    Command,
    AttributeData,
    Primitive,
} from "./lib/gluten-free.es.js";

const dev = Device.mount();

const cmd = Command.create(
    dev,
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

const attrs = AttributeData.empty(dev, Primitive.TRIANGLES, 150);

dev.target(rt => {
    rt.draw(cmd, attrs);
});
