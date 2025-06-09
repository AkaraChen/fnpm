import type { Argv } from 'yargs';
import Add from './add';
import CI from './ci';
import Config from './config';
import Create from './create';
import Default from './default';
import Dlx from './dlx';
import Doctor from './doctor';
import Init from './init';
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

export function mount(argv: Argv) {
    return argv
        .command(new Add())
        .command(new Dlx())
        .command(new Remove())
        .command(new Create())
        .command(new Init())
        .command(new Test())
        .command(new CI())
        .command(new Doctor())
        .command(new UI())
        .command(new Default())
        .command(new Use())
        .command(new Update())
        .command(new Publish())
        .command(new View())
        .command(new Why())
        .command(new Config())
        .command(new Registry())
        .command(new Scaffold());
}
