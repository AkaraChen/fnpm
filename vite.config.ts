import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: ['packages/*'],
        include: [
            '**/*.{test,spec}.{ts,tsx}',
            '**/tests/**/*.{test,spec}.{ts,tsx}',
        ],
    },
});
