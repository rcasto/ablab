import typescript from '@rollup/plugin-typescript';

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
        }
    ],
    plugins: [
        typescript(),
    ],
};