import { type AddOptions, add } from './add';
import { type DlxOptions, dlx } from './dlx';
import { type RemoveOptions, remove } from './remove';

export const commands = {
    add,
    dlx,
    remove,
};

export type { AddOptions, DlxOptions, RemoveOptions };
