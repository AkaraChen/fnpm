import consola from 'consola';
import { commands, type RemoveOptions } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface RemoveCommandOptions extends BaseCommandOptions {
    packages: string[];
    saveDev: boolean;
    savePeer: boolean;
    saveOptional: boolean;
    global: boolean;
}

class Remove<U extends RemoveCommandOptions> extends BaseCommand<U> {
    public command = ['remove <packages..>', 'rm', 'uninstall', 'un'];
    public describe = 'remove packages';
    public builder = (args: Argv): Argv<U> => {
        return args
            .positional('packages', {
                type: 'string',
                array: true,
                demandOption: true,
                description: 'Packages to remove',
            })
            .option('save', {
                alias: ['S'],
                type: 'boolean',
                description: 'Remove from dependencies',
                conflicts: ['save-dev', 'save-peer', 'save-optional', 'global'],
            })
            .option('save-dev', {
                alias: ['D'],
                type: 'boolean',
                description: 'Remove from devDependencies',
                conflicts: ['save', 'save-peer', 'save-optional', 'global'],
            })
            .option('save-peer', {
                alias: ['P'],
                type: 'boolean',
                description: 'Remove from peerDependencies',
                conflicts: ['save', 'save-dev', 'save-optional', 'global'],
            })
            .option('save-optional', {
                alias: ['O'],
                type: 'boolean',
                description: 'Remove from optionalDependencies',
                conflicts: ['save', 'save-dev', 'save-peer', 'global'],
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Remove packages globally',
                conflicts: ['save', 'save-dev', 'save-peer', 'save-optional'],
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { packages, saveDev, savePeer, saveOptional, global } = args;
        const options: RemoveOptions = {
            packages,
            saveDev,
            savePeer,
            saveOptional,
            global,
        };
        const command = commands.remove.concat(this.ctx.pm, options);
        consola.info(`Removing packages with ${this.ctx.pm}`);
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Remove;
