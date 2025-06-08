import type { Command } from './type';

type Verb = 'list' | 'get' | 'set' | 'delete';

interface ConfigOptionsBase {
    verb: Verb;
    global?: boolean;
    json?: boolean;
}

export type ConfigOptions =
    | (ConfigOptionsBase & {
          verb: 'list';
      })
    | (ConfigOptionsBase & {
          verb: 'get';
          key: string;
      })
    | (ConfigOptionsBase & {
          verb: 'set';
          key: string;
          value: string;
      })
    | (ConfigOptionsBase & {
          verb: 'delete';
          key: string;
      });

export const config: Command<ConfigOptions> = {
    concat(pm, options): string[] {
        const { verb, global, json } = options;
        switch (verb) {
            case 'list': {
                if (['npm', 'pnpm'].includes(pm)) {
                    return [
                        pm,
                        'config',
                        'list',
                        ...(global ? ['--global'] : ['--location', 'project']),
                        json && '--json',
                    ].filter(Boolean);
                }
                return [
                    'yarn',
                    'config',
                    global && '--global',
                    json && '--json',
                ].filter(Boolean);
            }
            case 'get': {
                return [pm, 'get', options.key];
            }
            case 'delete': {
                if (['npm', 'pnpm'].includes(pm)) {
                    return [
                        pm,
                        'config',
                        'delete',
                        options.key,
                        ...(global ? ['--global'] : ['--location', 'project']),
                    ];
                }
                return [
                    'yarn',
                    'config',
                    'unset',
                    options.key,
                    global && '--home',
                ].filter(Boolean);
            }
            case 'set': {
                if (['npm', 'pnpm'].includes(pm)) {
                    return [
                        pm,
                        'config',
                        'set',
                        options.key,
                        options.value,
                        ...(global ? ['--global'] : ['--location', 'project']),
                    ];
                }
                return [
                    'yarn',
                    'config',
                    'set',
                    `${options.key}=${options.value}`,
                    global && '--home',
                ].filter(Boolean);
            }
        }
    },
};
