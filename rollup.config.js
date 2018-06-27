import pluginReplace from "rollup-plugin-replace";
import pluginUglify from "rollup-plugin-uglify";

const nyes = /([Yy][Ee]?[Ss]?)|([Tt][Rr]?[Uu]?[Ee]?)/;
const ALL = process.env.ALL && nyes.test(process.env.ALL);

const conf = (file, format, prod, min) => ({
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
        min && pluginUglify(),
    ].filter(plugin => !!plugin),
});

export default [
    conf("dist/webglutenfree.js", "es", false, false),
    ALL && conf("dist/webglutenfree.prod.js", "es", true, false),
    ALL && conf("dist/webglutenfree.prod.min.js", "es", true, true),
    conf("dist/webglutenfree.umd.js", "umd", false, false),
    ALL && conf("dist/webglutenfree.umd.prod.js", "umd", true, false),
    ALL && conf("dist/webglutenfree.umd.prod.min.js", "umd", true, true),
].filter(build => !!build);
