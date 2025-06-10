import isCi from 'is-ci';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: ['packages/*'],
        testTimeout: isCi ? 5_000 * 100 : undefined,
    },
});
