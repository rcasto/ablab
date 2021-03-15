import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/lab.es.js',
            format: 'es'
        },
        {
            file: 'dist/lab.umd.js',
            format: 'umd',
            name: 'Lab',
        },
    ],
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
    ],
};