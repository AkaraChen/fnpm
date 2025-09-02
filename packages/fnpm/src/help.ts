import pc from 'picocolors';
import type { Argv, CommandModule, Options as YargsOption } from 'yargs';

type Position = {
    name: string;
    description?: string;
    required?: boolean;
    type?: string;
    array?: boolean;
};

type Option = {
    name: string;
    aliases: string[];
    type?: string;
    description?: string;
    required?: boolean;
    array?: boolean;
};

type Collected = {
    positions: Position[];
    options: Option[];
};

type OptEx = Partial<YargsOption> & {
    alias?: string | string[];
    demandOption?: boolean;
    array?: boolean;
    type?: string;
};

type Chain = Argv & { __getCollected: () => Collected };

function createCollector(): Chain {
    const collected: Collected = { positions: [], options: [] };
    const aliasMap = new Map<string, string[]>();

    const target: Record<string, unknown> = {};
    const proxy = new Proxy(target, {
        get(_t, prop: string | symbol) {
            if (prop === '__getCollected') {
                return () => collected;
            }
            if (prop === 'positional') {
                return (name: string, opt?: YargsOption) => {
                    const ex = (opt || {}) as OptEx;
                    collected.positions.push({
                        name,
                        description: ex.description,
                        required: ex.demandOption,
                        type: ex.type,
                        array: ex.array,
                    });
                    return proxy as Chain;
                };
            }
            if (prop === 'option') {
                return (name: string, opt?: YargsOption) => {
                    const ex = (opt || {}) as OptEx;
                    const aliases = ([] as string[]).concat(ex.alias || []);
                    aliasMap.set(name, aliases);
                    collected.options.push({
                        name,
                        aliases,
                        type: ex.type,
                        description: ex.description,
                        required: ex.demandOption,
                        array: ex.array,
                    });
                    return proxy as Chain;
                };
            }
            if (prop === 'alias') {
                return (key: string, alias: string | string[]) => {
                    const list = aliasMap.get(key) || [];
                    aliasMap.set(
                        key,
                        list.concat(Array.isArray(alias) ? alias : [alias])
                    );
                    const found = collected.options.find((o) => o.name === key);
                    if (found) found.aliases = aliasMap.get(key)!;
                    return proxy as Chain;
                };
            }
            return (...args: unknown[]) => {
                void args;
                return proxy as Chain;
            };
        },
    }) as unknown as Chain;
    return proxy;
}

function formatFlag(name: string, aliases: string[]) {
    const shorts = aliases.filter((a) => a.length === 1).map((a) => `-${a}`);
    const longs = [name.length === 1 ? `-${name}` : `--${name}`].concat(
        aliases.filter((a) => a.length > 1).map((a) => `--${a}`)
    );
    return [shorts.join(', '), longs.join(', ')].filter(Boolean).join(', ');
}

type HelpableCommand =
    Pick<CommandModule<unknown, unknown>, 'command' | 'describe'> & {
        builder?: (a: Argv) => Argv | undefined;
    };

export function printCommandHelp(cmd: HelpableCommand, bin = 'fnpm') {
    const collector = createCollector();
    const builder = cmd.builder;
    if (builder) builder(collector);
    const { positions, options } = collector.__getCollected();

    const commands = Array.isArray(cmd.command) ? cmd.command : [cmd.command];
    const first = commands[0];

    console.log(pc.bold(`${bin} ${first}`));
    if (cmd.describe) console.log(`\n${cmd.describe}`);

    console.log(`\n${pc.cyan('Usage:')} ${bin} ${first}`);

    if (positions.length) console.log(`\n${pc.cyan('Positionals:')}`);
    for (const p of positions) {
        const label = [pc.bold(p.name), p.array ? pc.dim('(array)') : '']
            .filter(Boolean)
            .join(' ');
        console.log(
            `  ${label}  ${pc.dim(p.type || '')}  ${p.description || ''}`
        );
    }

    if (options.length) console.log(`\n${pc.cyan('Options:')}`);
    for (const o of options) {
        const flags = formatFlag(o.name, o.aliases);
        const type = o.array ? `${o.type || 'string'}[]` : o.type || 'boolean';
        console.log(`  ${flags}  ${pc.dim(type)}  ${o.description || ''}`);
    }
}

export function printRootHelp(bin = 'fnpm') {
    console.log(pc.bold(bin));
    console.log(`\n${pc.cyan('Usage:')} ${bin} <command> [options]`);
    console.log(`\nRun '${bin} <command> --help' for command-specific help.`);
}
