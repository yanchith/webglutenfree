import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";

import { minify } from "uglify-es";

const FORMAT = process.env.FORMAT;
const PROD = process.env.NODE_ENV && process.env.NODE_ENV === "production";

const plugins = PROD
    ? [
        pluginReplace({
            values: { "process.env.NODE_ENV": JSON.stringify("production") },
        }),
        pluginUglify({}, minify)
    ]
    : [];


export default {
    input: "build/index.js",
    output: {
        file: `dist/glutenfree.${FORMAT}${PROD ? ".min" : ""}.js`,
        format: FORMAT,
        name: 'glutenfree',
    },
    plugins,
    sourcemap: true,
};
