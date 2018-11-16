/**
 * This example uses deferred shading to illuminate a scene with multiple
 * point lights with the Phong lighting model.
 *
 * learnopengl.com provides an excellent explanation of both Blinn-Phong
 * lighting and deferred shading.
 *
 * Sponza modeled by Marko Dabrovic, with UVs and crack errors fixed by Kenzie
 * amar at Vicarious Visions.
 */

import {
    Device,
    Extension,
    TargetBufferBitmask,
    Uniforms,
    UniformType,
    DepthFunc,
    ElementPrimitive,
    Texture2D,
    TextureColorStorageFormat,
    TextureDepthStorageFormat,
} from "./lib/webglutenfree.js";
import { mat4, vec3 } from "./libx/gl-matrix.js";

import * as sponza from "./libx/sponza.js";
import * as cube from "./libx/cube.js";

const N_LIGHTS = 10;
const DRAW_LIGHTS = false;
const LIGHT_ATTENUATION_CONSTANT = 1;
const LIGHT_ATTENUATION_LINEAR = 0.14;
const LIGHT_ATTENUATION_QUADRATIC = 0.07;
const LIGHT_SCATTER_XZ_NEAR = 5;
const LIGHT_SCATTER_XZ_FAR = 8;
const LIGHT_MIN_Y = 0;
const LIGHT_MAX_Y = 10;
const CAMERA_Y = 10;
const PROJ_NEAR = 0.1;
const PROJ_FAR = 500;
const PROJ_FOV = Math.PI / 2;

const dev = Device.create({ extensions: [Extension.EXTColorBufferFloat] });
const [width, height] = [dev.bufferWidth, dev.bufferHeight];

const gAlbedoSpecular = dev. createTexture2D(
    width,
    height,
    TextureColorStorageFormat.RGBA8,
);
const gPosition = dev.createTexture2D(
    width,
    height,
    TextureColorStorageFormat.RGBA32F,
);
const gNormal = dev.createTexture2D(
    width,
    height,
    TextureColorStorageFormat.RGBA32F,
);
const gDepth = dev.createTexture2D(
    width,
    height,
    TextureDepthStorageFormat.DEPTH_COMPONENT24,
);
const gBuffer = dev.createFramebuffer(width, height, [
    gAlbedoSpecular,
    gPosition,
    gNormal,
], gDepth);

const identity = mat4.identity(mat4.create());
const zero = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);

const projMatrix = mat4.perspective(
    mat4.create(),
    PROJ_FOV,
    width / height,
    PROJ_NEAR,
    PROJ_FAR,
);

const cameraPosition = vec3.fromValues(0, CAMERA_Y, 0);
const viewMatrix = mat4.lookAt(
    mat4.create(),
    cameraPosition,
    [10, 1, 0],
    up,
);

/**
 * Material properties as described by Phong lighting model.
 */
interface Material {
    diffuse: vec3;
    specular: number;
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
    minY: number,
    maxY: number,
): Light => {
    const mask = [
        Math.random() > 0.5 ? 0.15 : 0,
        Math.random() > 0.5 ? 0.15 : 0,
        Math.random() > 0.5 ? 0.15 : 0,
    ];
    const color = vec3.fromValues(
        mask[0] + Math.random() * 0.05,
        mask[1] + Math.random() * 0.05,
        mask[2] + Math.random() * 0.05,
    );
    const distance = vec3.fromValues(
        scatterXZNear + Math.random() * (scatterXZFar - scatterXZNear),
        minY + Math.random() * (maxY - minY),
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
        LIGHT_MIN_Y,
        LIGHT_MAX_Y,
    ));
}

interface CmdDrawGeometryProps {
    projMatrix: mat4;
    viewMatrix: mat4;
    modelMatrix: mat4;
    material: Material;
}

const cmdDrawGeometry = dev.createCommand<CmdDrawGeometryProps>(
    `#version 300 es
    precision mediump float;

    uniform mat4 u_proj, u_view, u_model;

    layout (location = 0) in vec3 a_position;
    layout (location = 1) in vec3 a_normal;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
        v_position = (u_model * vec4(a_position, 1)).xyz;
        v_normal = transpose(inverse(mat3(u_model))) * a_normal;
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1);
    }
    `,
    `#version 300 es
    precision mediump float;

    struct Material {
        vec3 diffuse;
        float specular;
    };

    uniform Material u_material;

    in vec3 v_position;
    in vec3 v_normal;

    layout (location = 0) out vec4 f_color;
    layout (location = 1) out vec4 f_position;
    layout (location = 2) out vec4 f_normal;

    void main() {
        f_color = vec4(u_material.diffuse, u_material.specular);
        f_position = vec4(v_position, 1);
        f_normal = vec4(normalize(v_normal), 0);
    }
    `,
    {
        uniforms: {
            u_proj: {
                type: UniformType.FLOAT_MAT4,
                value: (props) => props.projMatrix,
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: (props) => props.viewMatrix,
            },
            u_model: {
                type: UniformType.FLOAT_MAT4,
                value: (props) => props.modelMatrix,
            },
            "u_material.diffuse": {
                type: UniformType.FLOAT_VEC3,
                value: (props) => props.material.diffuse,
            },
            "u_material.specular": {
                type: UniformType.FLOAT,
                value: (props) => props.material.specular,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

interface CmdDrawLightingProps {
    cameraPosition: vec3;
    lights: Light[];
}

// Dynamically create uniform options, as the number of lights is not known
// beforehand.
const createUniformOptions = (nLights: number): Uniforms<CmdDrawLightingProps> => {
    // TODO: consider SoA instead of AoS to get rid of this madness...
    // ... or uniform buffers

    // Add statically known uniforms
    const uniforms: Uniforms<CmdDrawLightingProps> = {
        u_camera_position: {
            type: UniformType.FLOAT_VEC3,
            value: (props) => props.cameraPosition,
        },
    };

    // Add uniforms for each light
    for (let i = 0; i < nLights; ++i) {
        uniforms[`u_lights[${i}].position`] = {
            type: UniformType.FLOAT_VEC3,
            value: (props) => props.lights[i].position,
        };
        uniforms[`u_lights[${i}].ambient`] = {
            type: UniformType.FLOAT_VEC3,
            value: (props) => props.lights[i].ambient,
        };
        uniforms[`u_lights[${i}].diffuse`] = {
            type: UniformType.FLOAT_VEC3,
            value: (props) => props.lights[i].diffuse,
        };
        uniforms[`u_lights[${i}].specular`] = {
            type: UniformType.FLOAT_VEC3,
            value: (props) => props.lights[i].specular,
        };
        uniforms[`u_lights[${i}].constant`] = {
            type: UniformType.FLOAT,
            value: (props) => props.lights[i].constant,
        };
        uniforms[`u_lights[${i}].linear`] = {
            type: UniformType.FLOAT,
            value: (props) => props.lights[i].linear,
        };
        uniforms[`u_lights[${i}].quadratic`] = {
            type: UniformType.FLOAT,
            value: (props) => props.lights[i].quadratic,
        };
    }

    return uniforms;
};

const cmdDrawLighting = dev.createCommand<CmdDrawLightingProps>(
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

    const int N_LIGHTS = int(${N_LIGHTS});

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
    uniform vec3 u_camera_position;
    uniform sampler2D u_g_albedo_specular;
    uniform sampler2D u_g_position;
    uniform sampler2D u_g_normal;

    out vec4 f_color;

    void main() {
        ivec2 coords = ivec2(gl_FragCoord.xy);

        vec3 diffuse = texelFetch(u_g_albedo_specular, coords, 0).rgb;
        float specular = texelFetch(u_g_albedo_specular, coords, 0).a;
        vec3 position = texelFetch(u_g_position, coords, 0).xyz;
        vec3 normal = texelFetch(u_g_normal, coords, 0).xyz;

        vec3 view_dir = normalize(u_camera_position - position);

        vec3 lighting = diffuse * 0.1; // Hardcoded ambient

        for (int i = 0; i < N_LIGHTS; ++i) {
            Light light = u_lights[i];

            float distance = length(light.position - position);
            vec3 light_dir = normalize(light.position - position);
            vec3 halfway_dir = normalize(view_dir + light_dir);

            float diffuse_f = max(dot(light_dir, normal), 0.0);
            float specular_f = pow(
                max(dot(normal, halfway_dir), 0.0),
                16.0 // Hardcoded shininess
            );

            float attenuation = 1.0 / (light.constant
                + light.linear * distance
                + light.quadratic * distance * distance
            );

            lighting += attenuation * diffuse_f * light.diffuse * diffuse;
            lighting += attenuation * specular_f * light.specular * specular;
        }

        f_color = vec4(lighting, 1);
    }
    `,
    {
        uniforms: {
            ...createUniformOptions(N_LIGHTS),
            u_g_albedo_specular: {
                type: UniformType.SAMPLER_2D,
                value: gAlbedoSpecular,
            },
            u_g_position: {
                type: UniformType.SAMPLER_2D,
                value: gPosition,
            },
            u_g_normal: {
                type: UniformType.SAMPLER_2D,
                value: gNormal,
            },
        },
    },
);

interface CmdDrawLightProps {
    proj: mat4;
    view: mat4;
    model: mat4;
    light: Light;
}

// Draw each light as it's own geometry centered on position, use diffuse color
const cmdDrawLight = dev.createCommand<CmdDrawLightProps>(
    `#version 300 es
    precision mediump float;

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
                type: UniformType.FLOAT_MAT4,
                value: ({ proj }) => proj,
            },
            u_view: {
                type: UniformType.FLOAT_MAT4,
                value: ({ view }) => view,
            },
            u_model: {
                type: UniformType.FLOAT_MAT4,
                value: ({ model }) => model,
            },
            u_position: {
                type: UniformType.FLOAT_VEC3,
                value: ({ light }) => light.position,
            },
            u_color: {
                type: UniformType.FLOAT_VEC3,
                value: ({ light }) => light.diffuse,
            },
        },
        depth: { func: DepthFunc.LESS },
    },
);

// Material used for all objects
const material: Material = {
    diffuse: vec3.fromValues(0.4, 0.4, 0.4),
    specular: 0.5,
};

const objects = sponza.objects.map(({ positions, normals }) => ({
    material,
    attrs: dev.createAttributes(ElementPrimitive.TRIANGLE_LIST, {
        0: positions,
        1: normals,
    }),
}));

const lightAttrs = dev.createAttributes(
    cube.elements,
    { 0: cube.positions.map(([x, y, z]) => [x / 50, y / 50, z / 50]) },
);
const screenspaceAttrs = dev.createEmptyAttributes(ElementPrimitive.TRIANGLE_LIST, 3);

let t = window.performance.now();
const loop = (time: number): void => {
    const delta = time - t;
    t = time;

    // Update lights
    for (const light of lights) {
        vec3.rotateY(light.position, light.position, zero, delta / 5000);
    }

    gBuffer.target((rt) => {
        rt.clear(TargetBufferBitmask.COLOR_DEPTH);
        // Perform geometry pass - output gBuffer for all objects
        rt.batch(cmdDrawGeometry, (draw) => {
            objects.forEach((object) => {
                draw(object.attrs, {
                    projMatrix,
                    viewMatrix,
                    modelMatrix: identity,
                    material: object.material,
                });
            });
        });
    });

    dev.target((rt) => {
        if (DRAW_LIGHTS) {
            // Need to blit depth buffer into the back buffer first so that
            // depth test can work
            rt.blit(gBuffer, TargetBufferBitmask.DEPTH);
            // Draw each light as a small cube
            rt.batch(cmdDrawLight, (draw) => {
                lights.forEach((light) => {
                    draw(lightAttrs, {
                        proj: projMatrix,
                        view: viewMatrix,
                        model: identity,
                        light,
                    });
                });
            });
        }
        // Perform lighting pass - use gBuffer to compute per-pixel lighting
        rt.draw(cmdDrawLighting, screenspaceAttrs, {
            cameraPosition,
            lights,
        });
    });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
