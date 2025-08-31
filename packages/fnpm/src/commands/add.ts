import consola from 'consola';
import { type AddOptions, commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

export interface AddCommandOptions extends BaseCommandOptions {
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

class Add<U extends AddCommandOptions> extends BaseCommand<U> {
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
                conflicts: [
                    'save-dev',
                    'save-exact',
                    'save-peer',
                    'save-optional',
                ],
            })
            .option('save-dev', {
                alias: ['D'],
                type: 'boolean',
                description: 'Save as devDependencies',
                conflicts: ['save', 'save-exact', 'save-peer', 'save-optional'],
            })
            .option('save-exact', {
                alias: ['E', 'exact'],
                type: 'boolean',
                description: 'Save exact version',
                conflicts: ['save', 'save-dev', 'save-peer', 'save-optional'],
            })
            .option('save-peer', {
                alias: ['P', 'peer'],
                type: 'boolean',
                description: 'Save as peerDependencies',
                conflicts: ['save', 'save-dev', 'save-exact', 'save-optional'],
            })
            .option('save-optional', {
                alias: ['O', 'optional'],
                type: 'boolean',
                description: 'Save as optionalDependencies',
                conflicts: ['save', 'save-dev', 'save-exact', 'save-peer'],
            })
            .option('fixed', {
                alias: ['F'],
                type: 'boolean',
                description: 'Use fixed version',
                default: false,
            })
            .option('workspace', {
                alias: ['W', 'w'],
                type: 'boolean',
                description: 'Add packages to workspace root',
                default: false,
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Install packages globally',
                default: false,
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const {
            packages,
            saveOptional = false,
            saveExact = false,
            saveDev = false,
            savePeer = false,
            fixed = false,
            workspace = false,
            global = false,
            save = true,
        } = args;
        consola.info(`Installing packages with ${this.ctx.pm}`);
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
            ? commands.add.concat(this.ctx.pm, options)
            : commands.install.concat(this.ctx.pm, options);
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Add;
