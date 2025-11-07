import type { Argv, CommandModule } from 'yargs';
import type { Context } from '../util';
import { CommandFactory } from './base';

// Define command metadata for lazy loading
const commandMetadata = [
    {
        name: 'add [packages..]',
        aliases: ['a', 'install', 'i'],
        loader: () => import('./add'),
    },
    {
        name: 'create [template]',
        aliases: ['c'],
        loader: () => import('./create'),
    },
    { name: 'dlx [package]', aliases: ['x'], loader: () => import('./dlx') },
    {
        name: 'remove [packages..]',
        aliases: ['rm', 'r', 'uninstall'],
        loader: () => import('./remove'),
    },
    { name: 'init', aliases: [], loader: () => import('./init') },
    { name: 'test', aliases: ['t'], loader: () => import('./test') },
    { name: 'ci', aliases: [], loader: () => import('./ci') },
    { name: 'doctor', aliases: [], loader: () => import('./doctor') },
    { name: 'ui', aliases: [], loader: () => import('./ui') },
    { name: '$0', aliases: [], loader: () => import('./default') }, // default command
    { name: 'use [version]', aliases: [], loader: () => import('./use') },
    {
        name: 'update [packages..]',
        aliases: ['up'],
        loader: () => import('./update'),
    },
    { name: 'publish', aliases: [], loader: () => import('./publish') },
    { name: 'why [package]', aliases: [], loader: () => import('./why') },
    { name: 'config', aliases: [], loader: () => import('./config') },
    { name: 'registry', aliases: [], loader: () => import('./registry') },
    { name: 'scaffold', aliases: [], loader: () => import('./scaffold') },
    { name: 'view [package]', aliases: ['v'], loader: () => import('./view') },
];

export { default as Dlx } from './dlx';

export function mount(argv: Argv, ctx: Context) {
    const factory = new CommandFactory(ctx);

    // Register all commands with lazy loading
    for (const { name, aliases, loader } of commandMetadata) {
        const commandNames = [name, ...aliases];

        argv.command({
            command: commandNames,
            describe: '', // Will be filled when module loads
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
                const cmd = factory.create(Command, ctx);

                // Execute the handler
                if (cmd.handler) {
                    await cmd.handler(args);
                }
            },
        } as CommandModule);
    }

    return argv;
}
