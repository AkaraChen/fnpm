import type { Command } from './type';

export interface RemoveOptions {
    saveDev?: boolean;
    savePeer?: boolean;
    saveOptional?: boolean;
    packages: string[];
    global?: boolean;
}

export const remove: Command<RemoveOptions> = {
    concat(pm, options): string[] {
        const args: string[] = [];
        const { saveDev, savePeer, saveOptional, packages, global } = options;

        args.push(pm, pm === 'npm' ? 'uninstall' : 'remove');

        if (saveDev) {
            args.push('--save-dev');
        }

        if (savePeer) {
            args.push('--save-peer');
        }

        if (saveOptional) {
            args.push('--save-optional');
        }

        if (global) {
            args.push('--global');
        }

        args.push(...packages);

        return args;
    },
};
