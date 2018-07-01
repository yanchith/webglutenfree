/**
 * This example uses Phong lighting model to illuminate a scene with multiple
 * point lights.
 *
 * learnopengl.com provides an excellent explanation of Phong lighting.
 *
 * Sponza modeled by Marko Dabrovic, with UVs and crack errors fixed by Kenzie
 * amar at Vicarious Visions.
 */

import {
    Device,
    BufferBits,
    Command,
    Uniforms,
    DepthFunc,
    Attributes,
    Primitive,
} from "./lib/webglutenfree.js";
import { mat4, vec3 } from "./libx/gl-matrix.js";

import * as sponza from "./libx/sponza.js";
import * as cube from "./libx/cube.js";

const N_LIGHTS = 5;
const DRAW_LIGHTS = false;
const LIGHT_ATTENUATION_CONSTANT = 1;
const LIGHT_ATTENUATION_LINEAR = 0.14;
const LIGHT_ATTENUATION_QUADRATIC = 0.07;
const LIGHT_SCATTER_XZ_NEAR = 10;
const LIGHT_SCATTER_XZ_FAR = 15;
const CAMERA_Y = 2.5;
const PROJ_NEAR = 0.1;
const PROJ_FAR = 500;

const dev = Device.create();
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const zero = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);

/**
 * Material properties as described by Phong lighting model.
 */
interface Material {
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
    shininess: number;
}

/**
 * Light properties as described by Phong lighting model. Also contains
 * attenuation terms for light falloff.
 */
interface Light {
    position: vec3;
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
    constant: number;
    linear: number;
    quadratic: number;
}

const createLight = (
    scatterXZNear: number,
    scatterXZFar: number,
    y: number,
): Light => {
    const color = vec3.fromValues(
        0.15 + Math.random() * 0.05,
        0.15 + Math.random() * 0.05,
        0.15 + Math.random() * 0.05,
    );
    const distance = vec3.fromValues(
        scatterXZNear + Math.random() * (scatterXZFar - scatterXZNear),
        height,
        0,
    );
    return {
        position: vec3.rotateY(
            distance,
            distance,
            zero,
            Math.random() * 2 * Math.PI,
        ),
        ambient: color,
        diffuse: vec3.fromValues(color[0] * 5, color[1] * 5, color[2] * 5),
        specular: vec3.fromValues(1, 1, 1),
        constant: LIGHT_ATTENUATION_CONSTANT,
        linear: LIGHT_ATTENUATION_LINEAR,
        quadratic: LIGHT_ATTENUATION_QUADRATIC,
    };
};

const lights: Light[] = [];
for (let i = 0; i < N_LIGHTS; ++i) {
    lights.push(createLight(
        LIGHT_SCATTER_XZ_NEAR,
        LIGHT_SCATTER_XZ_FAR,
        CAMERA_Y,
    ));
}

const cameraPosition = vec3.fromValues(0, CAMERA_Y, 0);
const viewMatrix = mat4.lookAt(
    mat4.create(),
    cameraPosition,
    [1, CAMERA_Y, 0],
    up,
);

const projMatrix = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    width / height,
    PROJ_NEAR,
    PROJ_FAR,
);

interface CmdDrawObjectProps {
    proj: mat4;
    view: mat4;
    material: Material;
    lights: Light[];
}

// Dynamically create uniform options, as the number of lights is not known
// beforehand.
const createUniformOptions = (nLights: number): Uniforms<CmdDrawObjectProps> => {
    // Add statically known uniforms
    const uniforms: Uniforms<CmdDrawObjectProps> = {
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
            value: (props) => props.material.ambient,
        },
        "u_material.diffuse": {
            type: "3f",
            value: (props) => props.material.diffuse,
        },
        "u_material.specular": {
            type: "3f",
            value: (props) => props.material.specular,
        },
        "u_material.shininess": {
            type: "1f",
            value: (props) => props.material.shininess,
        },
    };

    // Add uniforms for each light
    for (let i = 0; i < nLights; ++i) {
        uniforms[`u_lights[${i}].position`] = {
            type: "3f",
            value: (props) => props.lights[i].position,
        };
        uniforms[`u_lights[${i}].ambient`] = {
            type: "3f",
            value: (props) => props.lights[i].ambient,
        };
        uniforms[`u_lights[${i}].diffuse`] = {
            type: "3f",
            value: (props) => props.lights[i].diffuse,
        };
        uniforms[`u_lights[${i}].specular`] = {
            type: "3f",
            value: (props) => props.lights[i].specular,
        };
        uniforms[`u_lights[${i}].constant`] = {
            type: "1f",
            value: (props) => props.lights[i].constant,
        };
        uniforms[`u_lights[${i}].linear`] = {
            type: "1f",
            value: (props) => props.lights[i].linear,
        };
        uniforms[`u_lights[${i}].quadratic`] = {
            type: "1f",
            value: (props) => props.lights[i].quadratic,
        };
    }

    return uniforms;
};

// Draw an object of concrete material and apply lights to it.
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

        #define N_LIGHTS ${N_LIGHTS}

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

        uniform Light u_lights[N_LIGHTS];
        uniform Material u_material;
        uniform vec3 u_camera_position, u_color;

        in vec3 v_position;
        in vec3 v_normal;

        layout (location = 0) out vec4 f_color;

        void main() {
            vec3 normal = normalize(v_normal);
            vec3 view_dir = normalize(u_camera_position - v_position);

            vec3 ambient = vec3(0);
            vec3 diffuse = vec3(0);
            vec3 specular = vec3(0);

            for (int i = 0; i < N_LIGHTS; ++i) {
                Light light = u_lights[i];

                float distance = length(light.position - v_position);
                vec3 light_dir = normalize(light.position - v_position);
                vec3 reflect_dir = reflect(-light_dir, normal);

                float diffuse_factor = max(dot(light_dir, normal), 0.0);
                float specular_factor = pow(
                    max(dot(reflect_dir, view_dir), 0.0),
                    u_material.shininess
                );

                float attenuation = 1.0 / (light.constant
                    + light.linear * distance
                    + light.quadratic * distance * distance
                );

                ambient += attenuation
                    * light.ambient
                    * u_material.ambient;
                diffuse += attenuation
                    * diffuse_factor
                    * light.diffuse * u_material.diffuse;
                specular += attenuation
                    * specular_factor
                    * light.specular
                    * u_material.specular;
            }

            f_color = vec4(ambient + diffuse + specular, 1);
        }
    `,
    {
        uniforms: createUniformOptions(N_LIGHTS),
        depth: { func: DepthFunc.LESS },
    },
);

interface CmdDrawLightProps {
    proj: mat4;
    view: mat4;
    light: Light;
}

// Draw each light as it's own geometry centered on position, use diffuse color
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
                value: mat4.identity(mat4.create()),
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

// Material used for all objects
const material: Material = {
    ambient: vec3.fromValues(0.4, 0.4, 0.4),
    diffuse: vec3.fromValues(0.4, 0.4, 0.4),
    specular: vec3.fromValues(0.5, 0.5, 0.5),
    shininess: 2,
};

const objects = sponza.objects.map(({ positions, normals }) => ({
    material,
    attrs: Attributes.create(dev, Primitive.TRIANGLES, {
        0: positions,
        1: normals,
    }),
}));

const lightAttrs = Attributes.create(
    dev,
    cube.elements,
    { 0: cube.positions.map(([x, y, z]) => [x / 50,  y / 50, z / 50]) },
);

let t = window.performance.now();
const loop = (time: number): void => {
    const delta = time - t;
    t = time;

    // Update lights
    for (const light of lights) {
        vec3.rotateY(light.position, light.position, zero, delta / 5000);
    }

    dev.target((rt) => {
        rt.clear(BufferBits.COLOR_DEPTH);

        // Draw each object with the lighting program
        rt.batch(cmdDrawObject, (draw) => {
            objects.forEach((object) => {
                draw(object.attrs, {
                    proj: projMatrix,
                    view: viewMatrix,
                    material: object.material,
                    lights,
                });
            });
        });

        if (DRAW_LIGHTS) {
            // Draw each light as a small cube
            rt.batch(cmdDrawLight, (draw) => {
                lights.forEach((light) => {
                    draw(lightAttrs, {
                        proj: projMatrix,
                        view: viewMatrix,
                        light,
                    });
                });
            });
        }

    });
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
