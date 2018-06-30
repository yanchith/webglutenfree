/**
 * TODO
 */

import {
    Device,
    BufferBits,
    Command,
    CommandOptions,
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

const N_LIGHTS = 5;
const LIGHT_CONSTANT = 1;
const LIGHT_LINEAR = 0.022;
const LIGHT_QUADRATIC = 0.0019;
const LIGHT_SCATTER = 200;
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

const allLights: Light[] = [];
for (let i = 0; i < N_LIGHTS; ++i) {
    const color = vec3.fromValues(
        Math.random() * 0.2,
        Math.random() * 0.2,
        Math.random() * 0.2,
    );
    allLights.push({
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
    lights: Light[];
}

type UniformOpts = CommandOptions<CmdDrawObjectProps>["uniforms"];
const createUniformOptions = (nLights: number): UniformOpts => {
    const uniforms: UniformOpts = {
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
    };
    for (let i = 0; i < nLights; ++i) {
        uniforms[`u_lights[${i}].position`] = {
            type: "3f",
            value: ({ lights }) => lights[i].position,
        };
        uniforms[`u_lights[${i}].ambient`] = {
            type: "3f",
            value: ({ lights }) => lights[i].ambient,
        };
        uniforms[`u_lights[${i}].diffuse`] = {
            type: "3f",
            value: ({ lights }) => lights[i].diffuse,
        };
        uniforms[`u_lights[${i}].specular`] = {
            type: "3f",
            value: ({ lights }) => lights[i].specular,
        };
        uniforms[`u_lights[${i}].constant`] = {
            type: "1f",
            value: ({ lights }) => lights[i].constant,
        };
        uniforms[`u_lights[${i}].linear`] = {
            type: "1f",
            value: ({ lights }) => lights[i].linear,
        };
        uniforms[`u_lights[${i}].quadratic`] = {
            type: "1f",
            value: ({ lights }) => lights[i].quadratic,
        };
    }
    return uniforms;
};

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

    updateLights(allLights, delta);

    dev.target((rt) => {
        rt.clear(BufferBits.COLOR_DEPTH);
        rt.batch(cmdDrawObject, (draw) => {
            objects.forEach((object) => {
                draw(object.attrs, {
                    proj: projMatrix,
                    view: viewMatrix,
                    material: object.material,
                    lights: allLights,
                });
            });
        });
        rt.batch(cmdDrawLight, (draw) => {
            allLights.forEach((light) => {
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
