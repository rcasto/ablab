import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/cli.ts',
    output: [
        {
            file: 'dist/cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node',
        }
    ],
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
    ],
};