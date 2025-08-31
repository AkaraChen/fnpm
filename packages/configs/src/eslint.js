import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        ignores: [
            'node_modules',
            'dist',
            'build',
            '.turbo',
            'coverage',
            '*.d.ts',
            'reset.d.ts',
            'next-env.d.ts',
            'packages/fnpm-dev/src/components/ui/**',
            'packages/fnpm-test-suite/generated/**',
            'packages/npm-registry-client/generated/**',
            'patches/**',
            'pnpm-lock.yaml',
            '.idea',
            '.github',
            '.husky',
            'vite.config.ts',
            '**/dist/**',
            '**/.turbo/**',
            '**/.next/**',
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                project: true,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
            ],
        },
    }
);
