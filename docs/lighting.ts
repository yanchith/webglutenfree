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
const LIGHT_CONSTANT = 1;
const LIGHT_LINEAR = 0.045;
const LIGHT_QUADRATIC = 0.0075;
const LIGHT_SCATTER = 100;
const NEAR = 0.1;
const FAR = 500;

const dev = Device.create();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const zero = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);

interface Material {
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
    shininess: number;
}

interface Light {
    position: vec3;
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
    constant: number;
    linear: number;
    quadratic: number;
}

const lights: Light[] = [];
for (let i = 0; i < N_LIGHTS; ++i) {
    const color = vec3.fromValues(
        Math.random() * 0.2,
        Math.random() * 0.2,
        Math.random() * 0.2,
    );
    lights.push({
        position: vec3.fromValues(
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
            Math.random() * LIGHT_SCATTER - LIGHT_SCATTER / 2,
        ),
        ambient: color,
        diffuse: vec3.fromValues(color[0] * 5, color[1] * 5, color[2] * 5),
        specular: vec3.fromValues(1, 1, 1),
        constant: LIGHT_CONSTANT,
        linear: LIGHT_LINEAR,
        quadratic: LIGHT_QUADRATIC,
    });
}
const updateLights = (_lights: Light[], delta: number): void => {
    for (const light of _lights) {
        vec3.rotateY(light.position, light.position, zero, delta / 1000);
    }
};

const cameraPosition = vec3.fromValues(0, 2.5, 0);
const viewMatrix = mat4.lookAt(
    mat4.create(),
    cameraPosition,
    [1, 2.5, 0],
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
    material: Material;
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

        struct Material {
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            float shininess;
        };

        struct Light {
            vec3 position;
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            float constant;
            float linear;
            float quadratic;
        };

        uniform Light u_light;
        uniform Material u_material;
        uniform vec3 u_camera_position, u_color;

        in vec3 v_position;
        in vec3 v_normal;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec3 normal = normalize(v_normal);
            float distance = length(u_light.position - v_position);
            vec3 light_dir = normalize(u_light.position - v_position);
            vec3 view_dir = normalize(u_camera_position - v_position);
            vec3 reflect_dir = reflect(-light_dir, normal);

            float diffuse_factor = max(dot(light_dir, normal), 0.0);
            float specular_factor = pow(
                max(dot(reflect_dir, view_dir), 0.0),
                u_material.shininess
            );

            vec3 ambient = u_light.ambient * u_material.ambient;
            vec3 diffuse = diffuse_factor * u_light.diffuse * u_material.diffuse;
            vec3 specular = specular_factor * u_light.specular * u_material.specular;

            float attenuation = 1.0 / (u_light.constant
                + u_light.linear * distance
                + u_light.quadratic * distance * distance
            );

            f_color = vec4(attenuation * (ambient + diffuse + specular), 1);
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
            "u_material.ambient": {
                type: "3f",
                value: ({ material }) => material.ambient,
            },
            "u_material.diffuse": {
                type: "3f",
                value: ({ material }) => material.diffuse,
            },
            "u_material.specular": {
                type: "3f",
                value: ({ material }) => material.specular,
            },
            "u_material.shininess": {
                type: "1f",
                value: ({ material }) => material.shininess,
            },
            "u_light.position": {
                type: "3f",
                value: ({ light }) => light.position,
            },
            "u_light.ambient": {
                type: "3f",
                value: ({ light }) => light.ambient,
            },
            "u_light.diffuse": {
                type: "3f",
                value: ({ light }) => light.diffuse,
            },
            "u_light.specular": {
                type: "3f",
                value: ({ light }) => light.specular,
            },
            "u_light.constant": {
                type: "1f",
                value: ({ light }) => light.constant,
            },
            "u_light.linear": {
                type: "1f",
                value: ({ light }) => light.linear,
            },
            "u_light.quadratic": {
                type: "1f",
                value: ({ light }) => light.quadratic,
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
                value: ({ light }) => light.diffuse,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

const objectMaterial: Material = {
    ambient: vec3.fromValues(0.2, 0.2, 0.2),
    diffuse: vec3.fromValues(0.8, 0.8, 0.8),
    specular: vec3.fromValues(1, 1, 1),
    shininess: 32,
};
const objects = sponza.objects.map(({ positions, normals }) => ({
    material: objectMaterial,
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

    updateLights(lights, delta);

    dev.target((rt) => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.batch(cmdDrawObject, (draw) => {
            objects.forEach((object) => {
                lights.forEach((light) => {
                    draw(object.attrs, {
                        proj: projMatrix,
                        view: viewMatrix,
                        material: object.material,
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
