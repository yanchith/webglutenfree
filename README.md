# webglutenfree

We serve your draw calls type-safe and gluten-free.

Webglutenfree is a lightweight, high-level abstraction layer on top of WebGL2.
We decided to bake this one without internal ~~gluten~~ state, letting everyone
enjoy WebGL without worrying too much about their health.

The library encourages init time creation for all drawing resources (`Command`s,
`Attributes`, `Texture`s, `Framebuffer`s, etc.). Drawing is done by requesting a
render `Target` and executing draw commands with it.

Webglutenfree tries not only to be safe and simple to use while adding minimal
overhead, but also guide users down the more performant path.

While it can be consumed directly from JavaScript, using TypeScript adds an
additional layer of comfort and safety.

## Current State

Work is underway on stabilizing the API and getting to a `0.1.0` release.
We are mostly missing documentation.

## Gallery

Try looking at our [gallery](https://yanchith.github.io/webglutenfree/)
(Firefox >= 59 with `dom.moduleScripts.enabled` or Chrome >= 61).

## Usage

Webglutenfree initialization consists acquiring a `Device` (WebGL context),
creating a `Command` (WebGL program), and uploading your data to the GPU.

Afterwards, a render target is obtained from the `Device` (or `Framebuffer`)
and used to execute draw commands.

```javascript
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

        out vec4 f_color;

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

dev.target(rt => {
    rt.draw(cmd, attrs);
})

```

## Acknowledgements

Webglutenfree is inspired by the [regl](http://regl.party) javascript library, and
[glium](https://github.com/glium/glium) rust library. Thank you!

Also, [webgl2fundementals.org](https://webgl2fundamentals.org/) and
[learnopengl.com](https://learnopengl.com/) together with
[mdn](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) proved
invaluable sources of GL lore.
