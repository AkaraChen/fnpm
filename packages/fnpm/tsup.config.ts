import { defineConfig } from 'tsup';

export default defineConfig({
    entryPoints: ['./src/fnpm.ts', './src/fnpx.ts'],
    format: ['esm'],
    clean: true,
});
