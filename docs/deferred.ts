/**
 * TODO
 */

import {
    Device,
    BufferBits,
    Command,
    DepthFunc,
    Attributes,
    Primitive,
    Texture,
    TextureInternalFormat as TexIntFmt,
    Framebuffer,
} from "./lib/webglutenfree.js";
import { mat4 } from "./libx/gl-matrix.js";

import * as sponza from "./libx/sponza.js";

const dev = Device.create({ antialias: false });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const colorTex = Texture.create(dev, width, height, TexIntFmt.RGBA8);
const normalTex = Texture.create(dev, width, height, TexIntFmt.RGBA8);
const depthTex = Texture.create(dev, width, height, TexIntFmt.DEPTH_COMPONENT24);
const fbo = Framebuffer.create(dev, width, height, [
    colorTex,
    normalTex,
], depthTex);

const view = mat4.create();
const NEAR = 0.1;
const FAR = 10000.1;

const cmdDraw = Command.create<number>(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_projection, u_view;

        layout (location = 0) in vec3 a_position;
        layout (location = 1) in vec3 a_normal;

        out vec3 v_normal;

        void main() {
            mat4 matrix = u_projection * u_view;
            v_normal = transpose(inverse(mat3(matrix))) * a_normal;
            gl_Position = matrix * vec4(a_position, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        uniform vec3 u_light;

        in vec3 v_normal;

        layout (location = 0) out vec4 f_color;
        layout (location = 1) out vec3 f_normal;

        void main() {
            float brightness = dot(normalize(v_normal), normalize(u_light));
            vec3 dark = vec3(0.3, 0.0, 0.3);
            vec3 bright = vec3(1.0, 0.0, 0.8);
            f_color = vec4(mix(dark, bright, brightness), 1.0);
            f_normal = v_normal;
        }
    `,
    {
        uniforms: {
            u_projection: {
                type: "matrix4fv",
                value: mat4.perspective(
                    mat4.create(),
                    Math.PI / 4,
                    width / height,
                    NEAR,
                    FAR,
                ),
            },
            u_view: {
                type: "matrix4fv",
                value: (time) => mat4.lookAt(
                    view,
                    [
                        5000 * Math.cos(time / 10000),
                        4000,
                        5000 * Math.sin(time / 10000),
                    ],
                    [0, 2.5, 0],
                    [0, 1, 0],
                ),
            },
            u_light: {
                type: "3f",
                value: [1, 1, 0],
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

const cmdDeferred = Command.create(
    dev,
    `#version 300 es
        precision mediump float;

        void main() {
            switch (gl_VertexID % 3) {
                case 0:
                    gl_Position = vec4(-1, 3, 0, 1);
                    break;
                case 1:
                    gl_Position = vec4(-1, -1, 0, 1);
                    break;
                case 2:
                    gl_Position = vec4(3, -1, 0, 1);
                    break;
            }
        }
    `,
    `#version 300 es
        precision mediump float;

        uniform sampler2D u_color_buffer;
        uniform sampler2D u_normal_buffer;
        uniform sampler2D u_depth_buffer;

        out vec4 f_color;

        const float NEAR = ${NEAR};
        const float FAR = ${FAR};

        float linear_depth2(float depth) {
            return (2.0 * NEAR) / (FAR + NEAR - depth * (FAR - NEAR));
        }

        void main() {
            ivec2 coords = ivec2(gl_FragCoord.xy);
            vec4 color = texelFetch(u_color_buffer, coords, 0);
            vec3 normal = texelFetch(u_normal_buffer, coords, 0).xyz;
            float depth = texelFetch(u_depth_buffer, coords, 0).x;

            f_color = color;
            f_color = vec4(normal, 1);
            f_color = vec4(vec3(linear_depth2(depth)), 1);
        }
    `,
    {
        textures: {
            u_color_buffer: colorTex,
            u_normal_buffer: normalTex,
            u_depth_buffer: depthTex,
        },
    },
);

const screenspaceAttrs = Attributes.empty(dev, Primitive.TRIANGLES, 3);
const attrs = sponza.objects.map(({ positions, normals }) => {
    return Attributes.create(dev, Primitive.TRIANGLES, {
        0: positions,
        1: normals,
    });
});

const loop = (time) => {
    fbo.target((rt) => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.batch(cmdDraw, (draw) => {
            attrs.forEach((attr) => {
                draw(attr, time);
            });
        });
    });

    dev.target((rt) => {
        rt.draw(cmdDeferred, screenspaceAttrs);
    });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
