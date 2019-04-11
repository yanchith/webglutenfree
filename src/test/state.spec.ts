import test from "ava";

import {
    createDeviceWithContext as gfCreateDeviceWithContext,
    createCommand as gfCreateCommand,
    createAttributes as gfCreateAttributes,
    createTexture2D as gfCreateTexture2D,
    createFramebuffer as gfCreateFramebuffer,
    Device,
    Target,
    TargetBufferBitmask,
    Command,
    Attributes,
    Texture2D,
    TextureColorStorageFormat,
    Framebuffer,
    ElementPrimitive,
} from "../index";
import { WebGL2RenderingContextMock } from "./webgl-mock";

const WIDTH = 800;
const HEIGHT = 600;


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

test("Normal fbo usage does not error", (t) => {
    t.notThrows(() => {
        const dev = createDevice();
        const cmd = createCommand(dev);
        const attrs = createAttributes(dev);
        const tex = createTexture2D(dev);
        const fbo = createFramebuffer(dev, tex);
        fbo.target((rt) => {
            rt.clear(TargetBufferBitmask.COLOR);
            rt.draw(cmd, attrs);
        });
        dev.target((rt) => {
            rt.blit(fbo, TargetBufferBitmask.COLOR);
        });
    });
});

test("Multiple devices can bind Targets (even nested)", (t) => {
    t.notThrows(() => {
        const dev1 = createDevice();
        const dev2 = createDevice();

        dev1.target(() => void 0);
        dev2.target(() => void 0);

        // Not sure why anyone would EVER do this, but these devices are
        // independent and our validations should not interfere
        dev1.target(() => {
            dev2.target(() => void 0);
        });
    });
});

test("Multiple devices can bind Commands (even nested)", (t) => {
    t.notThrows(() => {
        const dev1 = createDevice();
        const dev2 = createDevice();
        const cmd1 = createCommand(dev1);
        const cmd2 = createCommand(dev2);
        const attrs1 = createAttributes(dev1);
        const attrs2 = createAttributes(dev2);

        // Not sure why anyone would EVER do this, but these devices are
        // independent and our validations should not interfere
        dev1.target((rt1) => {
            dev2.target((rt2) => {
                rt1.batch(cmd1, (draw1) => {
                    rt2.draw(cmd2, attrs2, void 0);
                    rt2.batch(cmd2, (draw2) => {
                        draw2(attrs2, void 0);
                        draw1(attrs1, void 0);
                    });
                    draw1(attrs1, void 0);
                });
            });
        });
    });
});

test("Nested bound Command with Target#draw should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    dev.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => rt.draw(cmd, attrs));
        });
    });
});

test("Nested bound Command with Target#batch should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    dev.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => rt.batch(cmd, () => void 0));
        });
    });
});

test("Nested bound Target (device only) should error", (t) => {
    const dev = createDevice();
    dev.target(() => {
        t.throws(() => dev.target(() => void 0));
    });
});

test("Nested bound Target (device + fbo) should error", (t) => {
    const dev = createDevice();
    const tex = createTexture2D(dev);
    const fbo = createFramebuffer(dev, tex);
    dev.target(() => {
        t.throws(() => fbo.target(() => void 0));
    });
});

test("Unbound Target#draw should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.truthy(sneakyRt);
    t.throws(() => sneakyRt!.draw(cmd, attrs));
});

test("Unbound Target#batch should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.truthy(sneakyRt);
    t.throws(() => sneakyRt!.batch(cmd, () => void 0));
});

test("Unbound Target#clear should error", (t) => {
    const dev = createDevice();
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.truthy(sneakyRt);
    t.throws(() => sneakyRt!.clear(TargetBufferBitmask.COLOR));
});

test("Unbound Target#blit should error", (t) => {
    const dev = createDevice();
    const tex = createTexture2D(dev);
    const fbo = createFramebuffer(dev, tex);
    let sneakyRt: Target | null = null;
    dev.target((rt) => {
        sneakyRt = rt;
    });

    t.truthy(sneakyRt);
    t.throws(() => sneakyRt!.blit(fbo, TargetBufferBitmask.COLOR));
});

test("Unbound draw callback should error", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    let sneakyDraw: ((attrs: Attributes, props: void) => void) | null = null;
    dev.target((rt) => {
        rt.batch(cmd, (draw) => {
            sneakyDraw = draw;
        });
    });

    t.truthy(sneakyDraw);
    t.throws(() => (sneakyDraw!)(attrs, void 0));
});

test("Rebinding targets does not work around assertions", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    const attrs = createAttributes(dev);
    const tex = createTexture2D(dev);
    const fbo = createFramebuffer(dev, tex);
    let sneakyDraw: ((attrs: Attributes, props: void) => void) | null = null;
    dev.target((rt) => {
        rt.batch(cmd, (draw) => {
            sneakyDraw = draw;
        });
    });

    t.truthy(sneakyDraw);
    fbo.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => sneakyDraw!(attrs, void 0));
        });
    });
});

test("Rebinding commands does not work around assertions", (t) => {
    const dev = createDevice();
    const cmd1 = createCommand(dev);
    const cmd2 = createCommand(dev);
    const attrs = createAttributes(dev);
    let sneakyDraw: ((attrs: Attributes, props: void) => void) | null = null;
    dev.target((rt) => {
        rt.batch(cmd1, (draw) => {
            sneakyDraw = draw;
        });

        t.truthy(sneakyDraw);
        rt.batch(cmd2, () => {
            t.throws(() => sneakyDraw!(attrs, void 0));
        });
    });
});

test("Creating commands while a command is bound is asserted against", (t) => {
    const dev = createDevice();
    const cmd = createCommand(dev);
    dev.target((rt) => {
        rt.batch(cmd, () => {
            t.throws(() => createCommand(dev));
        });
    });
});

test("Creating framebuffers while a target is bound is asserted against", (t) => {
    const dev = createDevice();
    const tex = createTexture2D(dev);
    dev.target(() => {
        t.throws(() => createFramebuffer(dev, tex));
    });
});

function mockContext(): WebGL2RenderingContext {
    return new WebGL2RenderingContextMock({
        width: WIDTH,
        height: HEIGHT,
        clientWidth: WIDTH,
        clientHeight: HEIGHT,
    });
}

function createDevice(): Device {
    const gl = mockContext();
    return gfCreateDeviceWithContext(gl, { pixelRatio: 1 });
}

function createCommand(dev: Device): Command<void> {
    return gfCreateCommand(
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
    return gfCreateAttributes(dev, ElementPrimitive.TRIANGLE_LIST, {
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

function createTexture2D(dev: Device): Texture2D<TextureColorStorageFormat.RGBA8> {
    return gfCreateTexture2D(dev, WIDTH, HEIGHT, TextureColorStorageFormat.RGBA8);
}

function createFramebuffer(
    dev: Device,
    tex: Texture2D<TextureColorStorageFormat.RGBA8>,
): Framebuffer {
    return gfCreateFramebuffer(dev, WIDTH, HEIGHT, tex);
}
