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


const prodPart = PROD ? ".production" : "";
const fmtPart = FMT === "umd" ? ".umd" : "";
const minPart = MIN ? ".min" : "";

export default {
    input: "build/index.js",
    output: {
        file: `dist/webglutenfree${prodPart}${fmtPart}${minPart}.js`,
        format: FMT,
        name: 'webglutenfree',
        sourcemap: true,
    },
    plugins,
};
