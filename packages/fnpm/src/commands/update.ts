import { type AddOptions, commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

interface UpdateCommandOptions extends Options {
    packages?: string[];
    save: boolean;
    saveDev: boolean;
    saveExact: boolean;
    fixed: boolean;
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
            .option('save', {
                alias: ['d'],
                type: 'boolean',
                description: 'Save to dependencies',
                default: true,
            })
            .option('save-dev', {
                alias: ['D'],
                type: 'boolean',
                description: 'Save as devDependencies',
            })
            .option('save-exact', {
                alias: ['E', 'exact'],
                type: 'boolean',
                description: 'Save exact version',
            })
            .option('fixed', {
                alias: ['F'],
                type: 'boolean',
                description: 'Use fixed version',
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Update packages globally',
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { packages, saveDev, saveExact, fixed, save } = args;
        const options: AddOptions = {
            packages: packages!,
            save,
            saveDev,
            exact: saveExact,
            fixed,
        };
        const command = commands.update.concat(globalThis.ctx.pm, options);
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Update;
