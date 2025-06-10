import consola from 'consola';
import { type AddOptions, commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { exec } from '../util';

export interface AddCommandOptions extends Options {
    packages: string[];
    saveDev: boolean;
    saveExact: boolean;
    savePeer: boolean;
    saveOptional: boolean;
    fixed: boolean;
    workspace: boolean;
    global: boolean;
    save: boolean;
}

class Add<U extends AddCommandOptions>
    implements CommandModule<EmptyObject, U>
{
    public command = ['add [packages..]', 'a', 'install', 'i'];
    public describe = 'add packages';
    public builder = (args: Argv): Argv<U> => {
        return args
            .positional('packages', {
                type: 'string',
                array: true,
                description: 'Packages to install',
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
            .option('save-peer', {
                alias: ['P', 'peer'],
                type: 'boolean',
                description: 'Save as peerDependencies',
            })
            .option('save-optional', {
                alias: ['O', 'optional'],
                type: 'boolean',
                description: 'Save as optionalDependencies',
            })
            .option('fixed', {
                alias: ['F'],
                type: 'boolean',
                description: 'Use fixed version',
            })
            .option('workspace', {
                alias: ['W', 'w'],
                type: 'boolean',
                description: 'Add packages to workspace root',
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Install packages globally',
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const {
            packages,
            saveDev,
            saveExact,
            savePeer,
            saveOptional,
            fixed,
            workspace,
            global,
            save,
        } = args;
        consola.info(`Installing packages with ${ctx.pm}`);
        const options: AddOptions = {
            packages: packages!,
            save,
            saveDev,
            savePeer,
            saveOptional,
            exact: saveExact,
            global,
            fixed,
            allowRoot: workspace,
        };
        const command = options.packages
            ? commands.add.concat(globalThis.ctx.pm, options)
            : commands.install.concat(globalThis.ctx.pm, options);
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Add;
