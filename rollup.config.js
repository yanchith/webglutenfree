import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";

const FMT = process.env.FMT || "umd";
const PROD = process.env.PROD && process.env.PROD === "yes";
const MIN = process.env.MIN && process.env.MIN === "yes";

const plugins = [
    PROD && pluginReplace({ "process.env.NODE_ENV": JSON.stringify("production") }),
    MIN && pluginUglify(),
].filter(plugin => !!plugin);

const fmtPart = FMT === "es" ? "" : `.${FMT}`;
const prodPart = PROD ? ".prod" : "";
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
