import type { Command } from './type';

export interface InitOptions {
    interactively: boolean;
}

export const init: Command<InitOptions> = {
    concat(pm, options) {
        const { interactively } = options;
        if (pm === 'pnpm') {
            return ['pnpm', 'init'];
        }
        return interactively ? [pm, 'init'] : [pm, 'init', '-y'];
    },
};
