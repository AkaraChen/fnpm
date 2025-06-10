import { defineConfig } from 'tsdown';

export default defineConfig({
    entryPoints: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
});
