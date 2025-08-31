import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.jsonc'],
        plugins: { json },
        language: 'json/jsonc',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        language: 'markdown/gfm',
        extends: ['markdown/recommended'],
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        languageOptions: { tolerant: true },
    },
    {
        files: [
            '**/*.test.ts',
            '**/*.spec.ts',
            '**/*.test.tsx',
            '**/*.spec.tsx',
        ],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        ignores: [
            '**/dist/**',
            '**/build/**',
            '**/.react-router/**',
            '**/.next/**',
        ],
    },
]);
