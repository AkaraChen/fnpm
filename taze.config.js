import { defineConfig } from 'taze';

export default defineConfig({
    exclude: [
        '@pnpm/types',
        '@effect/platform',
        '@effect/platform-node',
        'effect',
    ],
    force: true,
    write: true,
    recursive: true,
    update: true,
});
