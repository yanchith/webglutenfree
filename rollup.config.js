import pluginTypescript from "rollup-plugin-typescript2";

export default {
    input: "src/main.ts",
    output: {
        file: 'dist/rend.js',
        format: 'umd',
        name: 'rend'
    },
    plugins: [pluginTypescript({ typescript: require("typescript") })],
    sourcemap: true,
};
