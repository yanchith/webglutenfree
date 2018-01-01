import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";

const FORMAT = process.env.FORMAT;
const ENV = process.env.NODE_ENV || "development";
const MIN = process.env.MIN === "true";

const plugins = [
    pluginReplace({
        values: { "process.env.NODE_ENV": JSON.stringify(ENV) },
    }),
];

if (MIN) { plugins.push(pluginUglify({}, minify)); }

export default {
    input: "build/index.js",
    output: {
        file: `dist/glutenfree.${ENV}.${FORMAT}.${MIN ? "min." : ""}js`,
        format: FORMAT,
        name: 'glutenfree',
    },
    plugins,
    sourcemap: true,
};
