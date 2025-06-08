import { commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';
import { error, exec } from '../util';
import type { ConfigCommandOptions } from './config';

interface RegistryOptions extends Pick<ConfigCommandOptions, 'global'> {
    registry: string;
}

class Registry implements CommandModule<EmptyObject, RegistryOptions> {
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
        const command = commands.config.concat(globalThis.ctx.pm, {
            verb: 'set',
            key: 'registry',
            value: registry!,
            global,
        }) as string[];
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Registry;
