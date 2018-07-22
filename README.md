# webglutenfree

[![Build Status](https://travis-ci.com/yanchith/webglutenfree.svg?branch=master)](https://travis-ci.com/yanchith/webglutenfree)

We serve your draw calls type-safe and gluten-free.

Webglutenfree is a lightweight, comfort focused abstraction on top of WebGL2.
The API completely abstracts away the GL state machine. Parameters are used
instead of state-setting calls, and all user-visible state is encapsulated in
resource objects.

On the scale from low-level and flexible to high-level and
opinionated, Webglutenfree leans towards flexibility. In general, 80-90% of
the *sensible* things possible with raw WebGL should be possible in Webglutenfree.
If you think a feature is missing, please file an issue.

However, Webglutenfree *is* opinionated in the sense that some things are just "not
a good idea". Therefore, the library encourages init time creation for resources.
Its API ergonomics aligns with performance penalties - a weird looking
code in the render loop should be indicative of potential issues.

While it can be consumed directly from JavaScript, using TypeScript adds an
additional layer of comfort and safety. More concretely, instead of loose `GLenum`
values, all function parameters are strictly typed and invalid values are rejected
at compile time.

## Current State

We want to get to a `0.1.0` (meaning generally usable) eventually,
but there are still things missing:

- Documentation: we need a tutorial and API documentation,
- API stability: the API is still not the where we want it to be and will change,
- Features: we are missing at least Texture Arrays, 3d Textures, Cubemaps,
  Renderbuffers, and Transform Feedback.

## Gallery

Have a look at our [gallery](https://yanchith.github.io/webglutenfree/)
(Firefox and Chrome only, due to being WebGL2 only for the moment).

## Hello Triangle

Usually, you would acquire a `Device` (aka WebGL context) and create `Command`s
at init time. To draw, request a render target from the device and execute
draw commands with it.

```typescript
import { Device, Command, Attributes, Primitive } from "webglutenfree";

const dev = Device.create();

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

        layout (location = 0) out vec4 f_color;

        void main() {
            f_color = v_color;
        }
    `,
);

const attrs = Attributes.create(dev, Primitive.TRIANGLES, {
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

dev.target((rt) => {
    rt.draw(cmd, attrs);
});

```

## Installation

`npm install --save webglutenfree` or `yarn add webglutenfree`

## Sources

Webglutenfree is inspired by:

- [regl](http://regl.party)
- [glium](https://github.com/glium/glium)

We found the following docs and tutorials helpful:

- [mdn](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [learnopengl.com](https://learnopengl.com/)
- [webgl2fundementals.org](https://webgl2fundamentals.org/)
