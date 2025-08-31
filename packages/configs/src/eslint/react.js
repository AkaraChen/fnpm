import base from './base.js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
    ...base,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react: pluginReact,
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
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/no-unknown-property': ['error', { ignore: ['cmdk-*'] }],
        },
    },
];
