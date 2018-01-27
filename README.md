# glutenfree

We serve your draw calls type-safe and gluten-free.

Glutenfree is a lightweight, high-level abstraction layer on top of WebGL2. The
library encourages init time creation for all drawing resources
(`Command`s, `AttributeData`, `Texture`s, `Framebuffer`s, etc.). Afterwards,
drawing is possible by requesting a `Target` and executing draw commands on it.

Glutenfree tries not only to be safe and simple to use while adding minimal
overhead, but also guide users down the more performant path.

While it can be consumed directly from JavaScript, using TypeScript adds an
additional layer of comfort and safety.

## Current State

Work is underway on stabilizing the features and getting to a first release.
We are mostly missing documentation.

## Gallery

Try looking at our [gallery](https://yanchith.github.io/glutenfree/)
(Firefox >= 59 with modules enabled or Chrome >= 61).

## The Mandatory Triangle

Glutenfree initialization consists acquiring a `Device` (WebGL context),
creating a `Command` (WebGL program), and uploading your data to the GPU.

Afterwards, a render target is obtained from the `Device` (or `Framebuffer`)
and used to execute draw commands.

```javascript
import { Device, Command, AttributeData, Primitive } from "glutenfree";

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

const attrs = AttributeData.create(
    dev,
    Primitive.TRIANGLES,
    cmd.locate({
        a_position: [
            [-0.3, -0.5],
            [0.3, -0.5],
            [0, 0.5],
        ],
        a_color: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
        ],
    }),
);

dev.target(rt => {
    rt.clearColor(0, 0, 0, 1);
    rt.draw(cmd, attrs);
});

```

## Acknowledgements

Glutenfree is inspired by the [regl](http://regl.party) javascript library, and
[glium](https://github.com/glium/glium) rust library. Thank you!

Also, [webgl2fundementals.org](https://webgl2fundamentals.org/) and
[learnopengl.com](https://learnopengl.com/) together with
[mdn](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) proved
invaluable sources of GL lore.
