import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/cli.ts',
    output: [
        {
            file: 'dist/cli.js',
            format: 'umd',
            banner: '#!/usr/bin/env node',
        }
    ],
    plugins: [
        typescript(),
    ],
};