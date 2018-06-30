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
    Framebuffer,
    InternalFormat,
} from "./lib/webglutenfree.js";
import { mat4, vec3 } from "./libx/gl-matrix.js";

import * as sponza from "./libx/sponza.js";
import * as cube from "./libx/cube.js";

const N_LIGHTS = 10;
const LIGHT_SCATTER = 5;
const NEAR = 0.1;
const FAR = 500;

const dev = Device.create();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const zero = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);

interface Light {
    position: vec3;
    color: vec3;
    ambientStrength: number;
    specularStrength: number;
}

let lights: Light[] = [];
for (let i = 0; i < N_LIGHTS; ++i) {
    lights.push({
        position: vec3.fromValues(
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
        ),
        color: vec3.fromValues(
            Math.random(),
            Math.random(),
            Math.random(),
        ),
        ambientStrength: 0.1,
        specularStrength: 0.5,
    });
}
const updateLights = (_lights: Light[], delta: number): Light[] => {
    return _lights.map((light) => ({
        ...light,
        position: vec3.rotateY(
            light.position,
            light.position,
            zero,
            delta / 1000,
        ),
    }));
};

const cameraPosition = vec3.fromValues(0, 2.5, 0);
let viewMatrix = mat4.create();
const updateViewMatrix = (mat: mat4, time: number): mat4 => mat4.lookAt(
    mat,
    cameraPosition,
    [Math.cos(time / 10000), 2.5, Math.sin(time / 10000)],
    up,
);

const projMatrix = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    width / height,
    NEAR,
    FAR,
);

interface CmdDrawObjectProps {
    proj: mat4;
    view: mat4;
    color: vec3;
    light: Light;
}

const cmdDrawObject = Command.create<CmdDrawObjectProps>(
    dev,
    `#version 300 es
        precision mediump float;

        uniform mat4 u_proj, u_view, u_model;

        layout (location = 0) in vec3 a_position;
        layout (location = 1) in vec3 a_normal;

        out vec3 v_position;
        out vec3 v_normal;

        void main() {
            v_position = a_position;
            v_normal = transpose(inverse(mat3(u_model))) * a_normal;
            gl_Position = u_proj * u_view * u_model * vec4(a_position, 1);
        }
    `,
    `#version 300 es
        precision mediump float;

        uniform vec3 u_camera_position, u_color, u_light_color, u_light_position;
        uniform float u_light_ambient_strength, u_light_specular_strength;

        in vec3 v_position;
        in vec3 v_normal;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec3 normal = normalize(v_normal);
            vec3 light_dir = normalize(u_light_position - v_position);
            vec3 view_dir = normalize(u_camera_position - v_position);
            vec3 reflect_dir = reflect(-light_dir, normal);

            float diffuse_factor = max(dot(light_dir, normal), 0.0);
            float specular_factor = pow(max(dot(reflect_dir, view_dir), 0.0), 32.0);

            vec3 ambient = u_light_ambient_strength * u_light_color;
            vec3 diffuse = diffuse_factor * u_light_color;
            vec3 specular = u_light_specular_strength * specular_factor * u_light_color;

            f_color = vec4((ambient + diffuse + specular) * u_color, 1);
        }
    `,
    {
        uniforms: {
            u_proj: {
                type: "matrix4fv",
                value: ({ proj }) => proj,
            },
            u_view: {
                type: "matrix4fv",
                value: ({ view }) => view,
            },
            u_model: {
                type: "matrix4fv",
                value: mat4.identity(mat4.create()),
            },
            u_camera_position: {
                type: "3f",
                value: cameraPosition,
            },
            u_color: {
                type: "3f",
                value: ({ color }) => color,
            },
            u_light_position: {
                type: "3f",
                value: ({ light }) => light.position,
            },
            u_light_color: {
                type: "3f",
                value: ({ light }) => light.color,
            },
            u_light_ambient_strength: {
                type: "1f",
                value: ({ light }) => light.ambientStrength,
            },
            u_light_specular_strength: {
                type: "1f",
                value: ({ light }) => light.specularStrength,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

interface CmdDrawLightProps {
    proj: mat4;
    view: mat4;
    light: Light;
}

const cmdDrawLight = Command.create<CmdDrawLightProps>(
    dev,
    `#version 300 es

        uniform mat4 u_proj, u_view, u_model;
        uniform vec3 u_position;

        layout (location = 0) in vec3 a_position;

        void main() {
            gl_Position = u_proj
                * u_view
                * u_model
                * vec4(a_position + u_position, 1.0);
        }
    `,
    `#version 300 es
        precision mediump float;

        uniform vec3 u_color;

        layout (location = 0) out vec4 f_color;

        void main() {
            f_color = vec4(u_color, 0.5);
        }
    `,
    {
        uniforms: {
            u_proj: {
                type: "matrix4fv",
                value: ({ proj }) => proj,
            },
            u_view: {
                type: "matrix4fv",
                value: ({ view }) => view,
            },
            u_model: {
                type: "matrix4fv",
                value: mat4.fromScaling(mat4.create(), [0.1, 0.1, 0.1]),
            },
            u_position: {
                type: "3f",
                value: ({ light }) => light.position,
            },
            u_color: {
                type: "3f",
                value: ({ light }) => light.color,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

const objects = sponza.objects.map(({ positions, normals }) => ({
    color: vec3.fromValues(0.9, 0.9, 0.9),
    attrs: Attributes.create(dev, Primitive.TRIANGLES, {
        0: positions,
        1: normals,
    }),
}));

const lightAttrs = Attributes.create(
    dev,
    cube.elements,
    { 0: cube.positions },
);

let t = window.performance.now();
const loop = (time: number): void => {
    const delta = time - t;
    t = time;

    viewMatrix = updateViewMatrix(viewMatrix, time);
    lights = updateLights(lights, delta);

    dev.target((rt) => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.batch(cmdDrawObject, (draw) => {
            objects.forEach((object) => {
                lights.forEach((light) => {
                    draw(object.attrs, {
                        proj: projMatrix,
                        view: viewMatrix,
                        color: object.color,
                        light,
                    });
                });
            });
        });
        rt.batch(cmdDrawLight, (draw) => {
            lights.forEach((light) => {
                draw(lightAttrs, {
                    proj: projMatrix,
                    view: viewMatrix,
                    light,
                });
            });
        });
    });
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
