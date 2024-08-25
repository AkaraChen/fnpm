import type { Command } from './type';

export interface TestOptions {
    args?: string[];
}

export const test: Command<TestOptions> = {
    concat(pm, options) {
        return [pm, 'test', ...(options.args || [])];
    },
};
