/**
 * These are examples of bad API usage
 */


import {
    Device,
    Command,
    Attributes,
    Primitive,
} from "./lib/webglutenfree.es.js";

const dev = Device.mount();

const cmd = Command.create(
    dev,
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

        out vec4 f_color;

        void main() {
            f_color = v_color;
        }
    `,
);

const attrs = Attributes.withBuffers(
    dev,
    Primitive.TRIANGLES,
    {
        0: [
            [-0.3, -0.5],
            [0.3, -0.5],
            [0, 0.5],
        ],
        1: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
        ],
    },
);

// BAD usage starts here!

// Stealing (Out of Context) - Very bad, stacks support by being really paranoid

let stolenRT;

dev.target(rt => {
    stolenRT = rt;
});

stolenRT.clear();
stolenRT.draw(cmd, attrs);

let stolenDraw;

dev.target(rt => {
    rt.batch(cmd, draw => {
        stolenDraw = draw;
    });
});

stolenDraw(attrs);
stolenDraw(attrs);
stolenDraw(attrs);

// Nesting - Bad, stacks support it

dev.target(rt => {
    rt.clear();
    rt.batch(cmd, draw => {
        draw(attrs);
        fbo.target(fbort => {
            fbort.clear();
            fbort.batch(cmd, fbodraw => {
                fbodraw(attrs);
            });
        });
    });
});

// Nesting + Out of Context - Bad, stacks support it by being really paranoid

dev.target(rt => {
    rt.clear();
    rt.batch(cmd, draw => {
        draw(attrs);
        fbo.target(fbort => {
            fbort.clear();
            fbort.batch(cmd, fbodraw => {
                draw(attrs);
                fbodraw(attrs);
            });
        });
    });
});

// Creating resources - Bad, stacks support it

dev.target(rt => {
    rt.clear();
    rt.batch(cmd, draw => {
        const anotherCmd = Command.create(null, null, null);
        draw(attrs);
        draw(attrs);
    });

});

