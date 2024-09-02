import { type AddOptions, add } from './add';
import type { Command } from './type';

export interface UpdateOptions
    extends Pick<
        AddOptions,
        'exact' | 'fixed' | 'global' | 'saveProd' | 'saveDev' | 'packages'
    > {}

export const update: Command<UpdateOptions> = {
    concat(pm, options) {
        const args: string[] = [pm, 'up'];
        args.push(...add.concat(pm, options));
        return args;
    },
};
