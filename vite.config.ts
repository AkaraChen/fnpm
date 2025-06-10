import isCi from 'is-ci';
import { defineConfig } from 'vitest/config';

if (isCi) {
    console.info('ci detected, scale up test timeout to 500000ms');
}

export default defineConfig({
    test: {
        projects: ['packages/*'],
        testTimeout: isCi ? 5_000 * 100 : undefined,
        include: [
            '**/*.{test,spec}.{ts,tsx}',
            '**/tests/**/*.{test,spec}.{ts,tsx}',
        ],
    },
});
