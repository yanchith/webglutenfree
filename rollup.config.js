import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";

const FMT = process.env.FMT || "umd";
const ENV = typeof process.env.ENV === "string" && process.env.ENV.startsWith("p")
    ? "production"
    : "development";

const MIN = typeof process.env.MIN === "string" && process.env.MIN.startsWith("t");

const plugins = [
    pluginReplace({ "process.env.NODE_ENV": JSON.stringify(ENV) }),
    MIN ? pluginUglify() : null,
].filter(plugin => !!plugin);

const fmtPart = `.${FMT}`;
const prodPart = ENV === "production" ? ".prod" : "";
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
