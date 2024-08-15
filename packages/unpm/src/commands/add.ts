import type { Command } from './type';

export interface AddOptions {
    packages: string[];
    // npm only, and enabled by default
    save?: boolean;
    saveDev?: boolean;
    savePeer?: boolean;
    saveOptional?: boolean;
    exact?: boolean;
    // yarn, pnpm
    global?: boolean;
    fixed?: boolean;
    // pnpm, yarn-classic
    rootCheck?: boolean;
}

export const add: Command<AddOptions> = {
    concat(pm, options): string[] {
        const args: string[] = [];
        const {
            packages,
            save,
            saveDev,
            savePeer,
            saveOptional,
            exact,
            global,
            fixed,
            rootCheck,
        } = options;

        args.push(pm, 'add');

        args.push(...packages);

        if (save === false && pm === 'npm') {
            args.push('--no-save');
        }

        if (saveDev) {
            args.push('--save-dev');
        }

        if (savePeer) {
            args.push('--save-peer');
        }

        if (saveOptional) {
            args.push('--save-optional');
        }

        if (exact) {
            args.push('--save-exact');
        }

        if (global) {
            args.push('--global');
        }

        if (fixed) {
            args.push('--frozen-lockfile');
        }

        if (rootCheck) {
            switch (pm) {
                case 'pnpm': {
                    args.push('-w');
                    break;
                }
                case 'yarn-classic': {
                    args.push('-W');
                }
            }
        }

        return args;
    },
};
