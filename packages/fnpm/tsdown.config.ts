import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/fnpm.ts', './src/fnpx.ts'],
    format: ['esm'],
    clean: true,
});
