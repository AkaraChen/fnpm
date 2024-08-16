#!/usr/bin/env node

import consola from 'consola';
import type { PackageJson } from 'type-fest';
import { commands } from 'unpm';
import type { AddOptions, RemoveOptions } from 'unpm';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pkg from '../package.json';
import {
    error,
    exec,
    getContext,
    noop,
    normalizePackageVersion,
    readPackageJson,
} from './util';

const { root, pm } = await getContext(process.cwd());

await yargs(hideBin(process.argv))
    .scriptName('fnpm')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .usage('Usage: $0 <command> [options]')
    .command(
        ['add <packages..>', 'a', 'install', 'i'],
        'add packages',
        (yargs) => {
            return yargs
                .help()
                .alias('help', 'h')
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
                    alias: ['E', 'exact'],
                    type: 'boolean',
                    description: 'Save exact version',
                })
                .option('save-peer', {
                    alias: ['P', 'peer'],
                    type: 'boolean',
                    description: 'Save as peerDependencies',
                })
                .option('save-optional', {
                    alias: ['O', 'optional'],
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
        async (args) => {
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
            consola.info(`Installing packages with ${pm}`);
            await exec(command, root);
        },
    )
    .command(
        'dlx',
        'run a command',
        (yargs) => yargs.help().alias('help', 'h'),
        async (args) => {
            const [pkg, ...rest] = args._.slice(1) as string[];
            if (!pkg) {
                error('No package specified');
            }
            const command = commands.dlx
                .concat(pm, {
                    package: normalizePackageVersion(pkg!),
                    args: rest,
                })
                .join(' ');
            consola.info(`Running ${command}`);
            await exec(command);
            process.exit(0);
        },
    )
    .command(
        ['remove <packages..>', 'rm', 'uninstall', 'un'],
        'remove packages',
        (yargs) => {
            return yargs
                .help()
                .alias('help', 'h')
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
        async (args) => {
            const { packages, saveDev, savePeer, saveOptional, global } = args;
            const options: RemoveOptions = {
                packages,
                saveDev,
                savePeer,
                saveOptional,
                global,
            };
            const command = commands.remove.concat(pm, options).join(' ');
            consola.info(`Removing packages with ${pm}`);
            await exec(command, root);
            process.exit(0);
        },
    )
    .command(
        'create',
        'create an new project using package from npm',
        (yargs) => {
            return yargs.help().alias('help', 'h');
        },
        async (args) => {
            const [name, ...argv] = args._.slice(1) as string[];
            if (!name) {
                error('No package name specified');
            }
            const shell = `${pm} create ${normalizePackageVersion(
                name!,
            )} ${argv.join(' ')}`;
            await exec(shell);
        },
    )
    .command(
        'init',
        'initialize a new project',
        (yargs) => {
            return yargs.help().alias('help', 'h').option('y', {});
        },
        async (args) => {
            const { y } = args;
            const command = commands.init
                .concat(pm, { interactively: !y })
                .join(' ');
            consola.info(`Initializing project with ${pm}`);
            await exec(command);
            process.exit(0);
        },
    )
    .command('*', 'run a script', noop, async (args) => {
        if (args._.length === 0) {
            error('No script specified');
        }
        const inputs = args._ as string[];
        const pkg: PackageJson = await readPackageJson(root!);
        const scripts = pkg.scripts || {};
        const script = inputs[0];
        if (script && scripts[script]) {
            await exec(`${pm} run ${inputs.join(' ')}`, root);
        } else {
            await exec(`${pm} exec ${inputs.join(' ')}`, root);
        }
        process.exit(0);
    })

    .parse();
