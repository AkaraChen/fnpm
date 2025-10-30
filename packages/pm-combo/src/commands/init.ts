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
        if (pm === 'deno') {
            // Deno uses 'deno init' for initialization
            return ['deno', 'init'];
        }
        if (pm === 'bun') {
            // Bun uses 'bun init'
            return interactively ? ['bun', 'init'] : ['bun', 'init', '-y'];
        }
        return interactively ? [pm, 'init'] : [pm, 'init', '-y'];
    },
};
