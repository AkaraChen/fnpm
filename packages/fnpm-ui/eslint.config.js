import eslintConfig from 'configs/eslint-react';

export default [
    ...eslintConfig,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
