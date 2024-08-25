import type { Command } from './type';

export interface ExecOptions {
    args: string[];
}

export const exec: Command<ExecOptions> = {
    concat(pm, options) {
        return [pm, 'exec', ...(options.args || [])];
    },
};
