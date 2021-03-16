import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/es/lab.js',
            format: 'es'
        },
        {
            file: 'dist/cjs/lab.js',
            format: 'cjs'
        },
        {
            file: 'dist/iife/lab.js',
            format: 'iife',
            name: 'Lab',
        },
    ],
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
        copy({
            targets: [
                {
                    src: 'package-cjs.json',
                    dest: 'dist/cjs',
                    rename: 'package.json' 
                }
            ]
        }),
    ],
};