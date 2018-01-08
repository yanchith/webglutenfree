# glutenfree

We serve your draw calls type-safe and gluten-free.

Glutenfree is a lightweight declarative abstraction layer on top of WebGL2.
Concepts from WebGL map directly to Glutenfree declarations.

The library provides two abstractions: `Commands` and `Resources`.

`Commands` perform the necessary state transitions related to making a draw call.

`Resources` are handles on raw WebGL resources, such as `WebGLBuffer` or
`WebGLTexture`, with conveniences for construcion and reading/writing data.

Glutenfree tries to be safe and simple to use while adding minimal overhead.
It does so by encouraging init-time resource creation, internally using
VertexArrayObjects to bind Attributes, and performing assertions only in
compile-time or in debug builds.

While it can be consumed directly from JavaScript, using TypeScript adds an
additional layer of safety.

## Current State

Work is underway on stabilizing the features and getting to a first release.
We are mostly missing documentation.

## Gallery

Try looking at our [gallery](https://yanchith.github.io/glutenfree/)
(with an ES module capable browser, eg. Firefox >= 59 or Chrome >= 61).

## The Mandatory Triangle

Drawing with Glutenfree consists of creating a `Command` (which minimally
consists of vertex and fragment shaders), uploading `data` to the GPU, and
executing the command.

```javascript

import { Device, Command } from "glutenfree";

const dev = Device.mount();

const cmd = Command.create(dev, {
    vert: `#version 300 es
        precision mediump float;

        layout (location = 0) in vec2 a_position;

        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    frag: `#version 300 es
        precision mediump float;

        out vec4 f_color;

        void main() {
            f_color = vec4(1);
        }
    `,
    data: {
        attributes: {
            a_position: [
                [-0.3, -0.5],
                [0.3, -0.5],
                [0, 0.5],
            ],
        },
    },
});

cmd.execute();

```

## Acknowledgements

Glutenfree is heavily inspired by the [regl](http://regl.party) library.
Thank you!
