import consola from 'consola';
import { commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface InitCommandOptions extends BaseCommandOptions {
    y: boolean;
}

class Init<U extends InitCommandOptions> extends BaseCommand<U> {
    public command = 'init';
    public describe = 'initialize a new project';
    public builder = (args: Argv): Argv<U> => {
        return args.option('y', {
            type: 'boolean',
            default: true,
        }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { y } = args;
        const command = commands.init.concat(this.ctx.pm, {
            interactively: !y,
        });
        consola.info(`Initializing project with ${this.ctx.pm}`);
        await exec(command);
    }
}

export default Init;
