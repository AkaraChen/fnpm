import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface CreateCommandOptions extends BaseCommandOptions {}

class Create extends BaseCommand<CreateCommandOptions> {
    public command = 'create';
    public describe = 'create an new project using package from npm';

    public builder(args: Argv): Argv<CreateCommandOptions> {
        return args as Argv<CreateCommandOptions>;
    }

    public async handler() {
        const [name, ...argv] = this.ctx.args.slice(1);
        if (!name) {
            error('No package [name] specified');
        }
        const shell = commands.create.concat(this.ctx.pm, {
            name: normalizePackageVersion(name!),
            args: argv,
        });
        await exec(shell);
    }
}

export default Create;
