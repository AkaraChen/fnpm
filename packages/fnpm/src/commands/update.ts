import { type UpdateOptions, commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { exec } from '../util';
import { BaseCommand } from './base';
import type { BaseCommandOptions } from './base';

interface UpdateCommandOptions extends BaseCommandOptions {
    packages?: string[];
    global: boolean;
}

class Update<U extends UpdateCommandOptions> extends BaseCommand<U> {
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
        const command = commands.update.concat(this.ctx.pm, options);
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Update;
