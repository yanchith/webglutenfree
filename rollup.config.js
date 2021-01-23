import pluginReplace from "@rollup/plugin-replace";
import { terser as pluginTerser } from "rollup-plugin-terser";

const nyes = /([Yy][Ee]?[Ss]?)|([Tt][Rr]?[Uu]?[Ee]?)/;
const ALL = process.env.ALL && nyes.test(process.env.ALL);

const conf = (file, format, { prod, min }) => ({
    input: "build/index.js",
    output: {
        file,
        format,
        name: "webglutenfree",
        sourcemap: true,
    },
    plugins: [
        prod && pluginReplace({
            "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        min && pluginTerser(),
    ].filter(plugin => !!plugin),
});

export default [
    conf("dist/webglutenfree.js", "es", { prod: false, min: false }),
    ALL && conf("dist/webglutenfree.prod.js", "es", { prod: true, min: false }),
    ALL && conf("dist/webglutenfree.prod.min.js", "es", { prod: true, min: true }),
    conf("dist/webglutenfree.umd.js", "umd", { prod: false, min: false }),
    ALL && conf("dist/webglutenfree.umd.prod.js", "umd", { prod: true, min: false }),
    ALL && conf("dist/webglutenfree.umd.prod.min.js", "umd", { prod: true, min: true }),
].filter(build => !!build);
