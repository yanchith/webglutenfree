import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";

const FMT = process.env.FMT;
const PROD = process.env.PROD === "true";
const MIN = process.env.MIN === "true";

const plugins = [];

if (PROD) {
    plugins.push(pluginReplace({
        values: { "process.env.NODE_ENV": JSON.stringify("production") },
    }));
}
if (MIN) { plugins.push(pluginUglify({}, minify)); }


export default {
    input: "build/index.js",
    output: {
        file: `dist/glutenfree${PROD ? ".production" : ""}.${FMT}${MIN ? ".min" : ""}.js`,
        format: FMT,
        name: 'glutenfree',
        sourcemap: true,
    },
    plugins,
};
