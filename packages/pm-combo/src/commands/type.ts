export type Command<TOptions> = {
    concat: (
        pm: 'npm' | 'yarn' | 'yarn-classic' | 'pnpm' | 'deno' | 'bun',
        options: TOptions
    ) => string[];
};
