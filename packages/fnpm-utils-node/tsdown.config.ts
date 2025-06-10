import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts', 'src/mt.ts', 'src/pkg.ts'],
    format: ['esm', 'cjs'],
});
