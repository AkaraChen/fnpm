import consola from 'consola';
import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface TestCommandOptions extends BaseCommandOptions {}

class Test extends BaseCommand<TestCommandOptions> {
    public command = ['test', 't'];
    public describe = 'run tests';

    public builder(args: Argv): Argv<TestCommandOptions> {
        return args as Argv<TestCommandOptions>;
    }

    public async handler() {
        const command = commands.test.concat(this.ctx.pm, {
            args: this.ctx.args.slice(1),
        });
        consola.info(`Running tests with ${this.ctx.pm}`);
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Test;
