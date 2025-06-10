import { commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import { BaseCommand } from './base';
import type { BaseCommandOptions } from './base';

interface WhyCommandOptions extends BaseCommandOptions {
    query: string;
}

class Why<U extends WhyCommandOptions> extends BaseCommand<U> {
    public command = ['why <query>', 'explain'];
    public describe = 'explain why a package is installed';
    public builder = (args: Argv): Argv<U> => {
        return args.positional('query', {
            type: 'string',
            description: 'Shared to explain',
            demandOption: true,
        }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { query } = args;
        const command = commands.why.concat(this.ctx.pm, { query });
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Why;
