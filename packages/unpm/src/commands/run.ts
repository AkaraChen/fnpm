import type { Command } from './type';

export interface RunOptions {
    script: string;
    args?: string[];
}

export const run: Command<RunOptions> = {
    concat(pm, options) {
        return [pm, 'run', options.script, ...(options.args || [])];
    },
};
