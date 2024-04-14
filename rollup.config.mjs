import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

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