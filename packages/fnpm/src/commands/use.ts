import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface UseCommandOptions extends BaseCommandOptions {
    pattern: string;
}

class Use<U extends UseCommandOptions> extends BaseCommand<U> {
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
            const shell = ['corepack', 'use', `${this.ctx.pm}@latest`];
            await exec(shell, { cwd: this.ctx.root });
            return;
        }
        const shell = ['corepack', 'use', pattern];
        await exec(shell, { cwd: this.ctx.root });
    }
}

export default Use;
