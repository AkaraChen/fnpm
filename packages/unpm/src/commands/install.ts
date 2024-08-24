import type { Command } from './type';

export interface InstallOptions {
    fixed?: boolean;
}

export const install: Command<InstallOptions> = {
    concat(pm, options): string[] {
        const { fixed } = options;

        switch (pm) {
            case 'npm':
                if (fixed) {
                    return ['npm', 'ci'];
                }
                return ['npm', 'install'];
            case 'yarn':
            case 'yarn-classic':
                if (fixed) {
                    return ['yarn', 'add', '--frozen-lockfile'];
                }
                return ['yarn', 'add'];
            case 'pnpm':
                if (fixed) {
                    return ['pnpm', 'install', '--frozen-lockfile'];
                }
                return ['pnpm', 'install'];
        }
    },
};
