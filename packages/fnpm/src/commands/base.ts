import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import type { Context } from '../util';

/**
 * Base command options that all commands can extend
 */
export interface BaseCommandOptions extends Options {}

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
    ) {
        const original = new Command(this.ctx);
        const command: Partial<CommandModule> = {
            ...original,
        };
        command.builder = original.builder?.bind(original);
        command.handler = original.handler?.bind(original) as unknown as any;
        return command as CommandModule<EmptyObject, T>;
    }
}
