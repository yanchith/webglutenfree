import pluginTypescript from "rollup-plugin-typescript2";

// Generate both es2015 modules and typescript declaration files

export default {
    input: "src/index.ts",
    output: {
        file: 'dist/index.esm.js',
        format: 'es',
        name: 'glutenfree',
    },
    plugins: [pluginTypescript({
        typescript: require("typescript"),
        tsconfigOverride: { compilerOptions: { declaration: true } },
    })],
    sourcemap: true,
};
