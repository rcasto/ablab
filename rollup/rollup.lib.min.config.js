import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/es/ablab.min.js',
            format: 'es'
        },
        {
            file: 'dist/iife/ablab.min.js',
            format: 'iife',
            name: 'ablab',
        },
    ],
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
        terser()
    ],
};