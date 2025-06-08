import consola from 'consola';
import { commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

interface InitCommandOptions extends Options {
    y: boolean;
}

class Init<U extends InitCommandOptions>
    implements CommandModule<EmptyObject, U>
{
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
        const command = commands.init.concat(globalThis.ctx.pm, {
            interactively: !y,
        });
        consola.info(`Initializing project with ${globalThis.ctx.pm}`);
        await exec(command);
    }
}

export default Init;
