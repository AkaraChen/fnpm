import { defineConfig } from 'taze';

export default defineConfig({
    exclude: ['@pnpm/types'],
    force: true,
    write: true,
});
