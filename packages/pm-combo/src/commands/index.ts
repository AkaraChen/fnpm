import { type AddOptions, add } from './add';
import { type CreateOptions, create } from './create';
import { type DlxOptions, dlx } from './dlx';
import { type ExecOptions, exec } from './exec';
import { type InitOptions, init } from './init';
import { type InstallOptions, install } from './install';
import { type RemoveOptions, remove } from './remove';
import { type RunOptions, run } from './run';
import { type TestOptions, test } from './test';

export const commands = {
    add,
    dlx,
    remove,
    init,
    install,
    exec,
    run,
    test,
    create,
};

export type {
    AddOptions,
    DlxOptions,
    RemoveOptions,
    InitOptions,
    InstallOptions,
    ExecOptions,
    RunOptions,
    TestOptions,
    CreateOptions,
};