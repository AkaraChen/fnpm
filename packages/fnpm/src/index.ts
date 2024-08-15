import path from 'node:path';
import { detectPM } from '@akrc/monorepo-tools';
import { commands } from 'unpm';
import type { AddOptions, RemoveOptions } from 'unpm';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pkg from '../package.json';
import { exec, findProjectRoot } from './util';

const pm = await detectPM(path.dirname(await findProjectRoot()));

await yargs(hideBin(process.argv))
    .version('v', pkg.version)
    .version(pkg.version)
    .command(
        ['add <packages..>', 'a', 'install', 'i'],
        'add packages',
        (yargs) => {
            return yargs
                .help()
                .positional('packages', {
                    type: 'string',
                    array: true,
                    demandOption: true,
                    description: 'Packages to install',
                })
                .option('save-dev', {
                    alias: ['D'],
                    type: 'boolean',
                    description: 'Save as devDependencies',
                })
                .option('save-exact', {
                    alias: ['E'],
                    type: 'boolean',
                    description: 'Save exact version',
                })
                .option('save-peer', {
                    alias: ['P'],
                    type: 'boolean',
                    description: 'Save as peerDependencies',
                })
                .option('save-optional', {
                    alias: ['O'],
                    type: 'boolean',
                    description: 'Save as optionalDependencies',
                })
                .option('fixed', {
                    alias: ['F'],
                    type: 'boolean',
                    description: 'Use fixed version',
                })
                .option('workspace', {
                    alias: ['W', 'w'],
                    type: 'boolean',
                    description: 'Add packages to workspace root',
                })
                .option('global', {
                    alias: ['G', 'g'],
                    type: 'boolean',
                    description: 'Install packages globally',
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
                allowRoot: workspace,
            };
            const command = commands.add.concat(pm, options).join(' ');
            exec(command);
        },
    )
    .command(
        'dlx',
        'run a command',
        (yargs) => yargs.help(),
        (args) => {
            const [pkg, ...rest] = args._.slice(1) as string[];
            const command = commands.dlx
                .concat(pm, {
                    package: pkg!,
                    args: rest,
                })
                .join(' ');
            exec(command);
        },
    )
    .command(
        ['remove <packages..>', 'rm', 'uninstall', 'un'],
        'remove packages',
        (yargs) => {
            return yargs
                .help()
                .positional('packages', {
                    type: 'string',
                    array: true,
                    demandOption: true,
                    description: 'Packages to remove',
                })
                .option('save-dev', {
                    alias: ['D'],
                    type: 'boolean',
                    description: 'Remove from devDependencies',
                })
                .option('save-peer', {
                    alias: ['P'],
                    type: 'boolean',
                    description: 'Remove from peerDependencies',
                })
                .option('save-optional', {
                    alias: ['O'],
                    type: 'boolean',
                    description: 'Remove from optionalDependencies',
                })
                .option('global', {
                    alias: ['G', 'g'],
                    type: 'boolean',
                    description: 'Remove packages globally',
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
            const command = commands.remove.concat(pm, options).join(' ');
            exec(command);
        },
    )
    .parse();
