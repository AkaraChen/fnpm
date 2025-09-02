import type { Argv } from 'yargs';
import type { Context } from '../util';
import Add from './add';
import { CommandFactory } from './base';
import CI from './ci';
import Config from './config';
import Default from './default';
import Dlx from './dlx';
import Doctor from './doctor';
import Init from './init';
import Create from './create';
import Publish from './publish';
import Registry from './registry';
import Remove from './remove';
import Scaffold from './scaffold';
import Test from './test';
import UI from './ui';
import Update from './update';
import Use from './use';
import View from './view';
import Why from './why';

export { default as Dlx } from './dlx';

export function mount(argv: Argv, ctx: Context) {
    const factory = new CommandFactory(ctx);
    return argv
        .command(factory.create(Add))
        .command(factory.create(Create))
        .command(factory.create(Dlx))
        .command(factory.create(Remove))
        .command(factory.create(Init))
        .command(factory.create(Test))
        .command(factory.create(CI))
        .command(factory.create(Doctor))
        .command(factory.create(UI))
        .command(factory.create(Default))
        .command(factory.create(Use))
        .command(factory.create(Update))
        .command(factory.create(Publish))
        .command(factory.create(Why))
        .command(factory.create(Config))
        .command(factory.create(Registry))
        .command(factory.create(Scaffold))
        .command(factory.create(View));
}
