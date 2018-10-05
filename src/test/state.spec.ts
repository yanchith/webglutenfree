import test from "ava";

import { Device, Target, Command, Attributes, Primitive } from "../index";
import { WebGL2RenderingContextMock } from "./webgl-mock";

function mockContext(): WebGL2RenderingContext {
    return new WebGL2RenderingContextMock({
        width: 800,
        height: 600,
        clientWidth: 800,
        clientHeight: 600,
    });
}

function createDevice(): Device {
    const gl = mockContext();
    return Device.withContext(gl, { pixelRatio: 1 });
}

function createCommand(dev: Device): Command<void> {
    return Command.create(
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

        layout (location = 0) out vec4 f_color;

        void main() {
            f_color = v_color;
        }
        `,
    );
}

function createAttributes(dev: Device): Attributes {
    return Attributes.create(dev, Primitive.TRIANGLES, {
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
    });
}

test("Normal usage does not error", (t) => {
    t.notThrows(() => {
        const dev = createDevice();
        const cmd = createCommand(dev);
        const attrs = createAttributes(dev);
        dev.target((rt) => {
            rt.draw(cmd, attrs);
        });
    });
});

test("Nested bound Command#draw should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    dev.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => rt.draw(cmd, attrs));
        });
    });
});

test("Nested bound Command#batch should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    dev.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => rt.batch(cmd, () => void 0))
        });
    });
});

test("Unbound Command#draw should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.throws(() => sneakyRt!.draw(cmd, attrs));
});

test("Unbound Command#batch should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.throws(() => sneakyRt!.batch(cmd, () => void 0));
});
