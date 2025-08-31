import consola from 'consola';
import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface CICommandOptions extends BaseCommandOptions {}

class CI extends BaseCommand<CICommandOptions> {
    public command = 'ci';
    public describe = 'run continuous integration';

    public builder(args: Argv): Argv<CICommandOptions> {
        return args as Argv<CICommandOptions>;
    }

    public async handler() {
        const command = commands.install.concat(this.ctx.pm, {
            fixed: true,
        });
        consola.info(`Running CI with ${this.ctx.pm}`);
        await exec(command, { cwd: this.ctx.root });
    }
}

export default CI;
