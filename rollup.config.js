import pluginTypescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'glutenfree',
    },
    plugins: [pluginTypescript({ typescript: require("typescript") })],
    sourcemap: true,
};
