import eslintConfig from 'configs/eslint';

export default [
    ...eslintConfig,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];
