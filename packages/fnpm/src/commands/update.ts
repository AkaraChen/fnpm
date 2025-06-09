import { type UpdateOptions, commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

interface UpdateCommandOptions extends Options {
    packages?: string[];
    global: boolean;
}

class Update<U extends UpdateCommandOptions>
    implements CommandModule<EmptyObject, U>
{
    public command = ['update [packages..]', 'up'];
    public describe = 'update packages';
    public builder = (args: Argv): Argv<U> => {
        return args
            .positional('packages', {
                type: 'string',
                array: true,
                description: 'Packages to update',
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Update packages globally',
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { packages, global } = args;
        const options: UpdateOptions = {
            packages: packages!,
            global,
        };
        const command = commands.update.concat(globalThis.ctx.pm, options);
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Update;
