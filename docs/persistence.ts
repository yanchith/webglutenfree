/**
 * This example demonstrates a CRT persistence postprocessing effect.
 *
 * Persistence technique inspired by the excellent talk by Gregg Tavares:
 * https://www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s
 */

import {
    Device,
    Texture2D,
    UniformType,
    DepthFunc,
    TargetBufferBitmask,
    ElementPrimitive,
    TextureColorStorageFormat,
    RenderbufferDepthStorageFormat,
} from "./lib/webglutenfree.js";
import { mat4 } from "./libx/gl-matrix.js";

import * as bunny from "./libx/bunny.js";

const PERSISTENCE_FACTOR = 0.8;

const dev = Device.create({ antialias: false });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const colorTex = dev.createTexture2D(width, height, TextureColorStorageFormat.RGBA8);
const depthBuffer = dev.createRenderbuffer(width, height, RenderbufferDepthStorageFormat.DEPTH_COMPONENT24);
const newFrameFbo = dev.createFramebuffer(width, height, colorTex, depthBuffer);

const pingTex = dev.createTexture2D(width, height, TextureColorStorageFormat.RGBA8);
const pingFbo = dev.createFramebuffer(width, height, pingTex);

const pongTex = dev.createTexture2D(width, height, TextureColorStorageFormat.RGBA8);
const pongFbo = dev.createFramebuffer(width, height, pongTex);

const viewMatrix = mat4.create();

interface CmdDrawProps {
    time: number;
}

const cmdDraw = dev.createCommand<CmdDrawProps>(
    `#version 300 es
    precision mediump float;

    uniform mat4 u_proj, u_view;

    layout (location = 0) in vec3 a_position;
    layout (location = 1) in vec3 a_normal;

    out vec3 v_normal;

    void main() {
        mat4 matrix = u_proj * u_view;
        v_normal = transpose(inverse(mat3(matrix))) * a_normal;
        gl_Position = matrix * vec4(a_position, 1.0);
    }
    `,
    `#version 300 es
    precision mediump float;

    uniform vec3 u_light;

    in vec3 v_normal;

    out vec4 f_color;

    void main() {
        float brightness = dot(normalize(v_normal), normalize(u_light));
        vec3 dark = vec3(0.3, 0.0, 0.3);
        vec3 bright = vec3(1.0, 0.0, 0.8);
        f_color = vec4(mix(dark, bright, brightness), 1.0);
    }
    `,
    {
        uniforms: {
            u_proj: {
                type: UniformType.FLOAT_MAT4,
                value: mat4.perspective(
                    mat4.create(),
                    Math.PI / 4,
                    width / height,
                    0.1,
                    1000.0,
                ),
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: ({ time }) => mat4.lookAt(
                    viewMatrix,
                    [
                        30 * Math.cos(time / 1000),
                        2.5,
                        30 * Math.sin(time / 1000),
                    ],
                    [0, 2.5, 0],
                    [0, 1, 0],
                ),
            },
            u_light: {
                type: UniformType.FLOAT_VEC3,
                value: [1, 1, 0],
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

interface CmdBlendProps {
    newFrame: Texture2D<TextureColorStorageFormat>;
    prevFrame: Texture2D<TextureColorStorageFormat>;
}

const cmdBlend = dev.createCommand<CmdBlendProps>(
    `#version 300 es
    precision mediump float;

    out vec2 v_tex_coord;

    void main() {
        switch (gl_VertexID % 3) {
            case 0:
                gl_Position = vec4(-1, 3, 0, 1);
                v_tex_coord = vec2(0, 2);
                break;
            case 1:
                gl_Position = vec4(-1, -1, 0, 1);
                v_tex_coord = vec2(0, 0);
                break;
            case 2:
                gl_Position = vec4(3, -1, 0, 1);
                v_tex_coord = vec2(2, 0);
                break;
        }
    }
    `,
    `#version 300 es
    precision mediump float;

    uniform sampler2D u_new_frame, u_prev_frame;
    uniform float u_blend_factor;

    in vec2 v_tex_coord;

    out vec4 f_color;

    vec4 blend_alpha(vec4 src_color, vec4 dst_color, float factor) {
        return (src_color * factor) + (dst_color * (1. - factor));
    }

    void main() {
        vec4 c1 = texture(u_new_frame, v_tex_coord);
        vec4 c2 = texture(u_prev_frame, v_tex_coord);
        f_color = blend_alpha(c2, c1, u_blend_factor);
    }
    `,
    {
        uniforms: {
            u_blend_factor: {
                type: UniformType.FLOAT,
                value: PERSISTENCE_FACTOR,
            },
            u_new_frame: {
                type: UniformType.SAMPLER_2D,
                value: ({ newFrame }) => newFrame,
            },
            u_prev_frame: {
                type: UniformType.SAMPLER_2D,
                value: ({ prevFrame }) => prevFrame,
            },
        },
    },
);

const screenspaceAttrs = dev.createEmptyAttributes(
    ElementPrimitive.TRIANGLE_LIST,
    3,
);
const bunnyAttrs = dev.createAttributes(bunny.elements, cmdDraw.locate({
    a_position: bunny.positions,
    a_normal: bunny.normals,
}));


let ping = {
    tex: pingTex,
    fbo: pingFbo,
};

let pong = {
    tex: pongTex,
    fbo: pongFbo,
};

const loop = (time: number): void => {
    // By repeating the following process, we gain a buildup of past frame
    // memory in our ping/pong buffers, with an exponential falloff.

    // First draw the scene to a "newFrame" fbo
    newFrameFbo.target((rt) => {
        rt.clear(TargetBufferBitmask.COLOR_DEPTH);
        rt.draw(cmdDraw, bunnyAttrs, { time });
    });

    // Then blend newFrame and ping to pong proportionate to PERSISTENCE_FACTOR
    pong.fbo.target((rt) => {
        rt.draw(
            cmdBlend,
            screenspaceAttrs,
            { newFrame: colorTex, prevFrame: ping.tex },
        );
    });

    // Lastly copy the contents of pong to canvas
    dev.target((rt) => {
        rt.blit(pong.fbo, TargetBufferBitmask.COLOR);
    });

    // ... and swap the fbos
    const tmp = ping;
    ping = pong;
    pong = tmp;

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
