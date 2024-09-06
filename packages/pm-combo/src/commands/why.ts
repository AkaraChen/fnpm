import type { Command } from './type';

export interface WhyOptions {
    query: string;
}

export const why: Command<WhyOptions> = {
    concat(pm, options) {
        return [pm, 'why', options.query];
    },
};
