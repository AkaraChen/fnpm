import { commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

interface WhyCommandOptions extends Options {
    query: string;
}

class Why<U extends WhyCommandOptions>
    implements CommandModule<EmptyObject, U>
{
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
        const command = commands.why.concat(globalThis.ctx.pm, { query });
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Why;
