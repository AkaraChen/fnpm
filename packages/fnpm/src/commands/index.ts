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
import Remove from './remove';
import Test from './test';
import UI from './ui';
import Update from './update';
import Use from './use';
import View from './view';
import Why from './why';

export { default as Add } from './add';
export { default as CI } from './ci';
export { default as Config } from './config';
export { default as Create } from './create';
export { default as Default } from './default';
export { default as Dlx } from './dlx';
export { default as Doctor } from './doctor';
export { default as Init } from './init';
export { default as Publish } from './publish';
export { default as Remove } from './remove';
export { default as Test } from './test';
export { default as UI } from './ui';
export { default as Update } from './update';
export { default as Use } from './use';
export { default as View } from './view';
export { default as Why } from './why';

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
        .command(new Config());
}
