import { execa } from 'execa';
import { commands } from 'unpm';
import type { AddOptions, RemoveOptions } from 'unpm';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function exec(shell: string) {
    const p = execa(shell, {
        shell: true,
    });
    p.stdout?.pipe(process.stdout);
    p.stderr?.pipe(process.stderr);
    return p;
}

yargs(hideBin(process.argv))
    .command(
        'add',
        'add packages',
        (yargs) => {
            return yargs
                .positional('packages', {
                    type: 'string',
                    array: true,
                    demandOption: true,
                })
                .option('save-dev', {
                    alias: ['D'],
                    type: 'boolean',
                })
                .option('save-exact', {
                    alias: ['E'],
                    type: 'boolean',
                })
                .option('save-peer', {
                    alias: ['P'],
                    type: 'boolean',
                })
                .option('save-optional', {
                    alias: ['O'],
                    type: 'boolean',
                })
                .option('fixed', {
                    alias: ['F'],
                    type: 'boolean',
                })
                .option('workspace', {
                    alias: ['W', 'w'],
                    type: 'boolean',
                })
                .option('global', {
                    alias: ['G', 'g'],
                    type: 'boolean',
                });
        },
        (args) => {
            const {
                packages,
                saveDev,
                saveExact,
                savePeer,
                saveOptional,
                fixed,
                workspace,
                global,
            } = args;
            const options: AddOptions = {
                packages,
                save: true,
                saveDev,
                savePeer,
                saveOptional,
                exact: saveExact,
                global,
                fixed,
                rootCheck: workspace,
            };
            const command = commands.add.concat('npm', options).join(' ');
            exec(command);
        },
    )
    .command(
        'dlx',
        'run a command',
        (yargs) => yargs,
        (args) => {
            const [pkg, ...rest] = args._.slice(1) as string[];
            const command = commands.dlx
                .concat('npm', {
                    package: pkg!,
                    args: rest,
                })
                .join(' ');
            exec(command);
        },
    )
    .command(
        'remove',
        'remove packages',
        (yargs) => {
            return yargs
                .positional('packages', {
                    type: 'string',
                    array: true,
                    demandOption: true,
                })
                .option('save-dev', {
                    alias: ['D'],
                    type: 'boolean',
                })
                .option('save-peer', {
                    alias: ['P'],
                    type: 'boolean',
                })
                .option('save-optional', {
                    alias: ['O'],
                    type: 'boolean',
                })
                .option('global', {
                    alias: ['G', 'g'],
                    type: 'boolean',
                });
        },
        (args) => {
            const { packages, saveDev, savePeer, saveOptional, global } = args;
            const options: RemoveOptions = {
                packages,
                saveDev,
                savePeer,
                saveOptional,
                global,
            };
            const command = commands.remove.concat('npm', options).join(' ');
            exec(command);
        },
    )
    .parse();
