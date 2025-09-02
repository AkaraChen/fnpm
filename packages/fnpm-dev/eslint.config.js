import eslintConfig from 'configs/eslint-react';

export default [
    ...eslintConfig,
    {
        files: ['next-env.d.ts'],
        rules: {
            '@typescript-eslint/triple-slash-reference': 'off',
        },
    },
];
