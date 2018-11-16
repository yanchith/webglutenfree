/**
 * This example demonstrates the use of cubemaps to draw a skybox and
 * (static) environment reflections and refractions.
 *
 * Inspired by learnopengl.com
 */

import {
    Device,
    UniformType,
    DepthFunc,
    TargetBufferBitmask,
    TextureMinFilter,
    TextureMagFilter,
} from "./lib/webglutenfree.js";
import { vec3, mat4 } from "./libx/gl-matrix.js";
import { loadImage } from "./libx/load-image.js";

import * as cube from "./libx/cube.js";
import * as bunny from "./libx/bunny.js";

const dev = Device.create();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const projMatrix = mat4.perspective(
    mat4.create(),
    Math.PI / 2,
    width / height,
    0.1,
    1000,
);

const cameraPosition = vec3.set(
    vec3.create(),
    30 * Math.cos(Math.PI * 0.85),
    2.5,
    30 * Math.sin(Math.PI * 0.85),
);

const viewMatrix = mat4.lookAt(
    mat4.create(),
    cameraPosition,
    [0, 2.5, 0],
    [0, 1, 0],
);

const viewMatrixSkybox = mat4DiscardTranslation(mat4.create(), viewMatrix);

const modelMatrix = mat4.create();

async function run(): Promise<void> {
    const [
        imgRight,
        imgLeft,
        imgUp,
        imgDown,
        imgFront,
        imgBack,
    ] = await Promise.all([
        loadImage("img/drakeq_rt.png", false),
        loadImage("img/drakeq_lf.png", false),
        loadImage("img/drakeq_up.png", false),
        loadImage("img/drakeq_dn.png", false),
        loadImage("img/drakeq_ft.png", false),
        loadImage("img/drakeq_bk.png", false),
    ]);

    const cubemap = dev.createTextureCubeMapWithImage(
        imgRight,
        imgLeft,
        imgUp,
        imgDown,
        imgFront,
        imgBack,
        { min: TextureMinFilter.LINEAR, mag: TextureMagFilter.LINEAR },
    );

    interface CmdDrawModelProps {
        delta: number;
        camera: vec3;
        view: mat4;
    }

    const cmdDrawModel = dev.createCommand<CmdDrawModelProps>(
        `#version 300 es
        precision mediump float;

        uniform mat4 u_proj, u_view, u_model;

        layout (location = 0) in vec3 a_position;
        layout (location = 1) in vec3 a_normal;

        out vec3 v_position;
        out vec3 v_normal;

        void main() {
            v_position = vec3(u_model * vec4(a_position, 1.0));
            v_normal = transpose(inverse(mat3(u_model))) * a_normal;
            gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
        }
        `,
        `#version 300 es
        precision mediump float;

        uniform vec3 u_camera_position;
        uniform samplerCube u_skybox;

        in vec3 v_position;
        in vec3 v_normal;

        out vec4 f_color;

        const float REFRACTION_RATIO = 1.00 / 1.52; // air to glass

        void main() {
            vec3 normal = normalize(v_normal);
            vec3 view_dir = normalize(v_position - u_camera_position);

            vec3 reflection_dir = reflect(view_dir, normal);
            vec3 refraction_dir = refract(view_dir, normal, REFRACTION_RATIO);

            vec3 reflection = texture(u_skybox, reflection_dir).rgb;
            vec3 refraction = texture(u_skybox, refraction_dir).rgb;

            f_color = vec4(mix(reflection, refraction, 0.8), 1.0);
        }
        `,
        {
            uniforms: {
                u_camera_position: {
                    type: UniformType.FLOAT_VEC3,
                    value: ({ camera }) => camera,
                },
                u_proj: {
                    type: UniformType.FLOAT_MAT4,
                    value: projMatrix,
                },
                u_view: {
                    type: UniformType.FLOAT_MAT4,
                    value: ({ view }) => view,
                },
                u_model: {
                    type: UniformType.FLOAT_MAT4,
                    value: ({ delta }) => mat4.rotateY(
                        modelMatrix,
                        modelMatrix,
                        delta * 0.0001,
                    ),
                },
                u_skybox: {
                    type: UniformType.SAMPLER_CUBE,
                    value: cubemap,
                },
            },
            depth: { func: DepthFunc.LESS },
        },
    );

    interface CmdDrawSkyboxProps {
        view: mat4;
    }

    const cmdDrawSkybox = dev.createCommand<CmdDrawSkyboxProps>(
        `#version 300 es
        precision mediump float;

        uniform mat4 u_proj, u_view, u_model;

        layout (location = 0) in vec3 a_position;

        out vec3 v_tex_coord;

        void main() {
            v_tex_coord = a_position;
            vec4 position = u_proj * u_view * u_model * vec4(a_position, 1.0);
            // Set the max possible depth that still fits into our depth range
            // after perspective division, w / w == 1 will always be true
            gl_Position = position.xyww;
        }
        `,
        `#version 300 es
        precision mediump float;

        uniform samplerCube u_skybox;

        in vec3 v_tex_coord;

        out vec4 f_color;

        void main() {
            f_color = texture(u_skybox, v_tex_coord);
        }
        `,
        {
            uniforms: {
                u_proj: {
                    type: UniformType.FLOAT_MAT4,
                    value: projMatrix,
                },
                u_view: {
                    type: UniformType.FLOAT_MAT4,
                    value: ({ view }) => view,
                },
                u_model: {
                    type: UniformType.FLOAT_MAT4,
                    value: mat4.identity(mat4.create()),
                },
                u_skybox: {
                    type: UniformType.SAMPLER_CUBE,
                    value: cubemap,
                },
            },
            // Depth func must be LEQUAL because the skybox's depth values will
            // always be 1.0, so to be able to update them we need to relax the
            // comparison
            depth: { func: DepthFunc.LEQUAL },
        },
    );

    const attrsModel = dev.createAttributes(bunny.elements, {
        0: bunny.positions,
        1: bunny.normals,
    });

    const attrsSkybox = dev.createAttributes(cube.elements, { 0: cube.positions });

    let t = window.performance.now();
    const loop = (time: number): void => {
        const delta = time - t;
        t = time;

        dev.target((rt) => {
            rt.clear(TargetBufferBitmask.COLOR_DEPTH);
            rt.draw(cmdDrawModel, attrsModel, {
                delta,
                view: viewMatrix,
                camera: cameraPosition,
            });
            rt.draw(cmdDrawSkybox, attrsSkybox, { view: viewMatrixSkybox });
        });
        window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
}

run();

function mat4DiscardTranslation(out: mat4, a: mat4): mat4 {
    // Keep only upper 3x3 matrix to discard translation, because we want the
    // skybox to always be centered around the camera
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    return out;
}
