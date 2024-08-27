import { type InstallOptions, install } from './install';
import type { Command } from './type';

export interface AddOptions extends InstallOptions {
    packages: string[];
    // npm only, and enabled by default
    save?: boolean;
    saveDev?: boolean;
    savePeer?: boolean;
    saveOptional?: boolean;
    saveProd?: boolean;
    exact?: boolean;
    // yarn, pnpm
    global?: boolean;
    // pnpm, yarn-classic
    allowRoot?: boolean;
}

export const add: Command<AddOptions> = {
    concat(pm, options): string[] {
        const {
            packages,
            save,
            saveDev,
            savePeer,
            saveOptional,
            saveProd,
            exact,
            global,
            fixed,
            allowRoot = true,
        } = options;

        const args: string[] = install.concat(pm, { fixed });

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

        if (saveProd) {
            if (pm === 'yarn') {
                args.push('--prod');
            } else {
                args.push('--save-prod');
            }
        }

        if (exact) {
            args.push('--save-exact');
        }

        if (global) {
            args.push('--global');
        }

        if (allowRoot) {
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
