import base from './base.js';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

// Use the legacy config which has the rules directly
let reactConfig;
try {
    reactConfig = eslintReact.default.configs['recommended-typescript-legacy'];
} catch {
    // Fallback to basic rules if config is not available
    reactConfig = {
        rules: {
            '@eslint-react/no-missing-key': 'warn',
            '@eslint-react/no-array-index-key': 'warn',
            '@eslint-react/no-children-count': 'warn',
            '@eslint-react/no-children-for-each': 'warn',
            '@eslint-react/no-children-map': 'warn',
            '@eslint-react/no-children-only': 'warn',
            '@eslint-react/no-children-prop': 'warn',
            '@eslint-react/no-children-to-array': 'warn',
        },
    };
}

export default [
    ...base,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            '@eslint-react': eslintReact,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: reactConfig.rules,
    },
];
