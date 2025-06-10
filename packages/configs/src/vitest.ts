import isCi from 'is-ci';
import type { ViteUserConfig } from 'vitest/config';

export default {
    test: {
        testTimeout: isCi ? 5_000 * 100 : undefined,
    },
} satisfies ViteUserConfig;
