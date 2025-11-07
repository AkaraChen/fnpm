import type { Argv, CommandModule } from 'yargs';
import type { Context } from '../util';
import { CommandFactory } from './base';

// Define command metadata for lazy loading
const commandMetadata = [
    {
        name: 'add [packages..]',
        aliases: ['a', 'install', 'i'],
        describe: 'add packages',
        loader: () => import('./add'),
    },
    {
        name: 'create [template]',
        aliases: ['c'],
        describe: 'create a new project from template',
        loader: () => import('./create'),
    },
    {
        name: 'dlx [package]',
        aliases: ['x'],
        describe: 'execute a package binary',
        loader: () => import('./dlx'),
    },
    {
        name: 'remove [packages..]',
        aliases: ['rm', 'r', 'uninstall'],
        describe: 'remove packages',
        loader: () => import('./remove'),
    },
    {
        name: 'init',
        aliases: [],
        describe: 'initialize a new project',
        loader: () => import('./init'),
    },
    {
        name: 'test',
        aliases: ['t'],
        describe: 'run tests',
        loader: () => import('./test'),
    },
    {
        name: 'ci',
        aliases: [],
        describe: 'clean install',
        loader: () => import('./ci'),
    },
    {
        name: 'doctor',
        aliases: [],
        describe: 'check environment',
        loader: () => import('./doctor'),
    },
    {
        name: 'ui',
        aliases: [],
        describe: 'start UI server',
        loader: () => import('./ui'),
    },
    {
        name: '$0',
        aliases: [],
        describe: 'default command',
        loader: () => import('./default'),
    },
    {
        name: 'use [version]',
        aliases: [],
        describe: 'use a specific version',
        loader: () => import('./use'),
    },
    {
        name: 'update [packages..]',
        aliases: ['up'],
        describe: 'update packages',
        loader: () => import('./update'),
    },
    {
        name: 'publish',
        aliases: [],
        describe: 'publish package',
        loader: () => import('./publish'),
    },
    {
        name: 'why [package]',
        aliases: [],
        describe: 'show why a package is installed',
        loader: () => import('./why'),
    },
    {
        name: 'config',
        aliases: [],
        describe: 'manage configuration',
        loader: () => import('./config'),
    },
    {
        name: 'registry',
        aliases: [],
        describe: 'manage registry settings',
        loader: () => import('./registry'),
    },
    {
        name: 'scaffold',
        aliases: [],
        describe: 'scaffold a new project',
        loader: () => import('./scaffold'),
    },
    {
        name: 'view [package]',
        aliases: ['v'],
        describe: 'view package information',
        loader: () => import('./view'),
    },
];

export { default as Dlx } from './dlx';

export function mount(argv: Argv, ctx: Context) {
    const factory = new CommandFactory(ctx);

    // Register all commands with lazy loading
    for (const { name, aliases, describe, loader } of commandMetadata) {
        const commandNames = [name, ...aliases];

        argv.command({
            command: commandNames,
            describe,
            builder: async (yargs: Argv) => {
                const module = await loader();
                const Command = module.default;
                const instance = new Command(ctx);

                // Apply the actual builder
                if (instance.builder) {
                    return instance.builder(yargs);
                }
                return yargs;
            },
            handler: async (args) => {
                const module = await loader();
                const Command = module.default;
                const cmd = factory.create(Command);

                // Execute the handler
                if (cmd.handler) {
                    await cmd.handler(args);
                }
            },
        } as CommandModule);
    }

    return argv;
}
