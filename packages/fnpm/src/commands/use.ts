import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

interface UseCommandOptions extends Options {
    pattern: string;
}

class Use<U extends UseCommandOptions>
    implements CommandModule<EmptyObject, U>
{
    public command = 'use <pattern>';
    public describe = 'use a different package manager';
    public builder = (args: Argv): Argv<U> => {
        return args.positional('pattern', {
            type: 'string',
            description: 'Pattern to match package manager',
            demandOption: true,
        }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { pattern } = args;
        if (pattern === 'latest') {
            const shell = ['corepack', 'use', `${globalThis.ctx.pm}@latest`];
            await exec(shell, { cwd: globalThis.ctx.root });
            return;
        }
        const shell = ['corepack', 'use', pattern];
        await exec(shell, { cwd: globalThis.ctx.root });
    }
}

export default Use;
