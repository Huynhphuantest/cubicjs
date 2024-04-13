import terser from "@rollup/plugin-terser";

export default [
    {
        input: "src/Cubic.js",
        output: {
            file: "build/cubic.cjs",
            format: "cjs"
        }
    },
    {
        input: "src/Cubic.js",
        output: {
            file: "build/cubic.module.js",
            format: "esm"
        }
    },
    {
        input: "src/Cubic.js",
        output: {
            file: "build/cubic.module.min.js",
            format: "esm"
        },
        plugins:[terser()]
    }
];