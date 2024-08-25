#!/usr/bin/env node

import consola from 'consola';
import type { PackageJson } from 'type-fest';
import { commands } from 'pm-combo';
import type { AddOptions, RemoveOptions } from 'unpm';
import yargs from 'yargs';
import pkg from '../package.json';
import {
    error,
    exec,
    getContext,
    noop,
    normalizePackageVersion,
    readPackageJson,
} from './util';

const ctx = await getContext(process.cwd());

await yargs(ctx.args)
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
            consola.info(`Installing packages with ${ctx.pm}`);
            const options: AddOptions = {
                packages: packages!,
                save: true,
                saveDev,
                savePeer,
                saveOptional,
                exact: saveExact,
                global,
                fixed,
                allowRoot: workspace,
            };
            const command = options.packages
                ? commands.add.concat(ctx.pm, options).join(' ')
                : commands.install.concat(ctx.pm, options).join(' ');
            await exec(command, ctx.root);
            process.exit(0);
        },
    )
    .command(
        'dlx',
        'run a command',
        (yargs) => yargs.help().alias('help', 'h'),
        async () => {
            const [pkg, ...rest] = ctx.args.slice(1);
            if (!pkg) {
                error('No package specified');
            }
            const command = commands.dlx
                .concat(ctx.pm, {
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
            const command = commands.remove.concat(ctx.pm, options).join(' ');
            consola.info(`Removing packages with ${ctx.pm}`);
            await exec(command, ctx.root);
            process.exit(0);
        },
    )
    .command(
        'create',
        'create an new project using package from npm',
        (yargs) => {
            return yargs.help().alias('help', 'h');
        },
        async () => {
            const [name, ...argv] = ctx.args.slice(1);
            if (!name) {
                error('No package name specified');
            }
            const shell = commands.create
                .concat(ctx.pm, {
                    name: normalizePackageVersion(name!),
                    args: argv,
                })
                .join(' ');
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
                .concat(ctx.pm, { interactively: !y })
                .join(' ');
            consola.info(`Initializing project with ${ctx.pm}`);
            await exec(command);
            process.exit(0);
        },
    )
    .command(['test', 't'], 'run tests', noop, async () => {
        const command = commands.test
            .concat(ctx.pm, {
                args: ctx.args.slice(1),
            })
            .join(' ');
        consola.info(`Running tests with ${ctx.pm}`);
        await exec(command, ctx.root);
        process.exit(0);
    })
    .command('ci', 'run continuous integration', noop, async () => {
        const command = commands.install
            .concat(ctx.pm, {
                fixed: true,
            })
            .join(' ');
        consola.info(`Running CI with ${ctx.pm}`);
        await exec(command, ctx.root);
        process.exit(0);
    })
    .command('*', 'run a script', noop, async (args) => {
        if (args._.length === 0) {
            consola.info('Installing dependencies');
            const shell = commands.install.concat(ctx.pm, {});
            await exec(shell.join(' '), ctx.root);
            process.exit(0);
        }
        const inputs = ctx.args;
        const pkg: PackageJson = await readPackageJson(ctx.root!);
        const scripts = pkg.scripts || {};
        const script = inputs[0];
        if (script && scripts[script]) {
            const shell = commands.run
                .concat(ctx.pm, {
                    script: script,
                    args: inputs.slice(1),
                })
                .join(' ');
            await exec(shell, ctx.root);
        } else {
            const shell = commands.exec
                .concat(ctx.pm, {
                    args: inputs,
                })
                .join(' ');
            await exec(shell, ctx.root);
        }
        process.exit(0);
    })

    .parse();
