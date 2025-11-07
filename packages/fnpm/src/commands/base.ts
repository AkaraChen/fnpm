import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import type { Context } from '../util';
import { printCommandHelp } from '../help';

/**
 * Base command options that all commands can extend
 */
export type BaseCommandOptions = Options;

/**
 * Base command class that all command classes can extend
 *
 * @template T The command options type
 */
export abstract class BaseCommand<T extends BaseCommandOptions>
    implements CommandModule<EmptyObject, T>
{
    /**
     * Context object
     */
    public ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * Command name and aliases
     * Example: ['add [packages..]', 'a', 'install', 'i']
     */
    public abstract command: string | string[];

    /**
     * Command description
     * Example: 'add packages'
     */
    public abstract describe: string;

    /**
     * Configure command arguments and options
     * @param args Yargs instance
     * @returns Configured Yargs instance
     */
    public abstract builder?(args: Argv): Argv<T>;

    /**
     * Command handler implementation
     * @param args Parsed command arguments
     */
    public abstract handler(args: ArgumentsCamelCase<T>): Promise<void> | void;
}

export class CommandFactory {
    private ctx: Context;
    constructor(ctx: Context) {
        this.ctx = ctx;
    }
    create<T extends BaseCommandOptions>(
        Command: new (ctx: Context) => BaseCommand<T>,
        ctx: Context = this.ctx
    ) {
        const original = new Command(ctx);
        const command: Partial<CommandModule<EmptyObject, T>> = {
            ...original,
        };
        command.builder = original.builder?.bind(original);
        const bound = original.handler?.bind(original);
        command.handler = ((args: ArgumentsCamelCase<T>) => {
            const argv = ctx.args;
            const dashDash = argv.indexOf('--');
            const searchEnd = dashDash === -1 ? argv.length : dashDash;
            const isHelp = (s: string) => s === '--help' || s === '-h';
            const helpIndex = argv.findIndex(
                (t, i) => i < searchEnd && isHelp(String(t))
            );

            if (helpIndex >= 0) {
                // Identify primary command token from pattern, e.g. 'dlx', 'create'
                const patterns = Array.isArray(original.command)
                    ? original.command
                    : [original.command];
                const primary = String(patterns[0]).split(' ')[0];

                // Special-case forwarding commands: allow help after first positional
                if (primary === 'dlx' || primary === 'create') {
                    const firstPosIndex = argv[0] === primary ? 1 : 0;
                    if (helpIndex <= firstPosIndex) {
                        printCommandHelp(original);
                        return;
                    }
                } else {
                    printCommandHelp(original);
                    return;
                }
            }
            return bound?.(args);
        }) as unknown as CommandModule<EmptyObject, T>['handler'];
        return command as CommandModule<EmptyObject, T>;
    }

    /**
     * Create a lazy-loaded command using dynamic imports.
     * The module is loaded on first registration to extract metadata,
     * then the heavy logic (builder/handler) only runs when the command is invoked.
     */
    createLazy<T extends BaseCommandOptions>(
        loader: () => Promise<{
            default: new (ctx: Context) => BaseCommand<T>;
        }>,
        ctx: Context = this.ctx
    ): CommandModule<EmptyObject, T> {
        let cachedModule: {
            default: new (ctx: Context) => BaseCommand<T>;
        } | null = null;
        let metadataInstance: BaseCommand<T> | null = null;

        // Load the module and create an instance to extract metadata
        const initPromise = loader().then((module) => {
            cachedModule = module;
            metadataInstance = new module.default(ctx);
            return metadataInstance;
        });

        // Ensure metadata is available synchronously by blocking
        // This is a necessary compromise for yargs compatibility
        const metadata: { command: string | string[]; describe: string } = {
            command: '*',
            describe: '',
        };

        // Try to load synchronously if possible (will be available on next tick)
        initPromise.then((instance) => {
            metadata.command = instance.command;
            metadata.describe = instance.describe;
        });

        return {
            get command() {
                return metadata.command;
            },
            get describe() {
                return metadata.describe;
            },
            builder: async (yargs: Argv) => {
                await initPromise;
                const instance = metadataInstance!;

                if (instance.builder) {
                    return instance.builder(yargs) as Argv<T>;
                }
                return yargs as Argv<T>;
            },
            handler: async (args: ArgumentsCamelCase<T>) => {
                await initPromise;
                const cmd = this.create(cachedModule!.default, ctx);

                if (cmd.handler) {
                    await cmd.handler(args);
                }
            },
        } as CommandModule<EmptyObject, T>;
    }
}
