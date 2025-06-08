import { type ConfigOptions, commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { error, exec } from '../util';

interface ConfigCommandOptions extends Options {
    verb: string;
    key?: string;
    value?: string;
    global: boolean;
    json: boolean;
}

class Config<U extends ConfigCommandOptions>
    implements CommandModule<EmptyObject, U>
{
    public command = ['config [verb] [key] [value]', 'c'];
    public describe = 'Manage the npm configuration files';
    public builder = (args: Argv): Argv<U> => {
        return args
            .positional('verb', {
                type: 'string',
                description: 'Verb to use',
                demandOption: false,
                default: 'list',
                choices: [
                    ['list', 'ls'],
                    ['get', 'g'],
                    ['set', 's'],
                    ['delete', 'd', 'rm', 'del', 'remove', 'unset'],
                ].flat(),
            })
            .positional('key', {
                type: 'string',
                description: 'Key to get or set',
                demandOption: false,
            })
            .positional('value', {
                type: 'string',
                description: 'Value to set',
                demandOption: false,
            })
            .option('global', {
                alias: ['G', 'g'],
                type: 'boolean',
                description: 'Update packages globally',
            })
            .option('json', {
                alias: ['j'],
                type: 'boolean',
                description: 'Output json',
            }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { global, json, verb, key, value } = args;
        if (
            ![
                ['list', 'ls'],
                ['get', 'g'],
                ['set', 's'],
                ['delete', 'd', 'rm', 'del', 'remove', 'unset'],
            ]
                .flat()
                .includes(verb)
        ) {
            error(`Invalid verb ${verb}`);
        }
        const command = commands.config.concat(globalThis.ctx.pm, {
            verb: ['list', 'ls'].includes(verb)
                ? 'list'
                : ['get', 'g'].includes(verb)
                  ? 'get'
                  : ['set', 's'].includes(verb)
                    ? 'set'
                    : ['delete', 'd', 'rm', 'del', 'remove', 'unset'].includes(
                            verb,
                        )
                      ? 'delete'
                      : (verb as ConfigOptions['verb']),
            global,
            json,
            key: key!,
            value: value!,
        });
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Config;
