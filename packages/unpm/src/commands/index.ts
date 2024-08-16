import { type AddOptions, add } from './add';
import { type DlxOptions, dlx } from './dlx';
import { type InitOptions, init } from './init';
import { type RemoveOptions, remove } from './remove';

export const commands = {
    add,
    dlx,
    remove,
    init,
};

export type { AddOptions, DlxOptions, RemoveOptions, InitOptions };
