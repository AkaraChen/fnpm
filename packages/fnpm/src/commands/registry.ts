import { commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { error, exec } from '../util';
import { BaseCommand } from './base';
import type { BaseCommandOptions } from './base';

interface RegistryOptions extends BaseCommandOptions {
    registry: string;
}

class Registry extends BaseCommand<RegistryOptions> {
    public command = 'registry <registry>';
    public describe = 'Manage the npm registry';
    public builder = (args: Argv): Argv<RegistryOptions> => {
        return args
            .positional('registry', {
                type: 'string',
                description: 'Registry URL',
                demandOption: true,
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Install packages globally',
            }) as Argv<RegistryOptions>;
    };
    public async handler(args: ArgumentsCamelCase<RegistryOptions>) {
        const { global, registry } = args;
        if (!URL.canParse(registry)) {
            error(`Invalid registry URL ${registry}`);
        }
        const command = commands.config.concat(this.ctx.pm, {
            verb: 'set',
            key: 'registry',
            value: registry!,
            global,
        }) as string[];
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Registry;
