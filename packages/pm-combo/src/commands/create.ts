import type { Command } from './type';

export interface CreateOptions {
    name: string;
    args: string[];
}

export const create: Command<CreateOptions> = {
    concat(pm, options) {
        return [pm, 'create', options.name, ...(options.args || [])];
    },
};
