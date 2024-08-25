export type Command<TOptions> = {
    concat: (
        pm: 'npm' | 'yarn' | 'yarn-classic' | 'pnpm',
        options: TOptions,
    ) => string[];
};
