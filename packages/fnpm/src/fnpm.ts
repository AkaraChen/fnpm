#!/usr/bin/env node

import consola from 'consola';
import * as doctor from 'fnpm-doctor';
import { start } from 'fnpm-ui';
import { getPort } from 'get-port-please';
import { commands } from 'pm-combo';
import type { AddOptions, RemoveOptions } from 'pm-combo';
import { readPackage } from 'read-pkg';
import type { PackageJson } from 'type-fest';
import yargs from 'yargs';
import pkg from '../package.json';
import { error, exec, getContext, noop, normalizePackageVersion } from './util';

const ctx = await getContext(process.cwd());

yargs(ctx.args)
    .scriptName('fnpm')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .usage('Usage: $0 <command> [options]')
    .command(
        ['add [packages..]', 'a', 'install', 'i'],
        'add packages',
        (yargs) =>
            yargs
                .positional('packages', {
                    type: 'string',
                    array: true,
                    description: 'Packages to install',
                })
                .option('save', {
                    alias: ['d'],
                    type: 'boolean',
                    description: 'Save to dependencies',
                    default: true,
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
                }),
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
                save,
            } = args;
            consola.info(`Installing packages with ${ctx.pm}`);
            const options: AddOptions = {
                packages: packages!,
                save,
                saveDev,
                savePeer,
                saveOptional,
                exact: saveExact,
                global,
                fixed,
                allowRoot: workspace,
            };
            const command = options.packages
                ? commands.add.concat(ctx.pm, options)
                : commands.install.concat(ctx.pm, options);
            await exec(command, { cwd: ctx.root });
        },
    )
    .command(
        'dlx',
        'run a command',
        async () => {
            const [pkg, ...rest] = ctx.args.slice(1);
            if (!pkg) {
                error('No package specified');
            }
            const command = commands.dlx.concat(ctx.pm, {
                package: normalizePackageVersion(pkg!),
                args: rest,
            });
            consola.info(`Running ${command}`);
            await exec(command);
        },
    )
    .command(
        ['remove <packages..>', 'rm', 'uninstall', 'un'],
        'remove packages',
        (yargs) =>
            yargs
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
                }),
        async (args) => {
            const { packages, saveDev, savePeer, saveOptional, global } = args;
            const options: RemoveOptions = {
                packages,
                saveDev,
                savePeer,
                saveOptional,
                global,
            };
            const command = commands.remove.concat(ctx.pm, options);
            consola.info(`Removing packages with ${ctx.pm}`);
            await exec(command, { cwd: ctx.root });
        },
    )
    .command(
        'create',
        'create an new project using package from npm',
        async () => {
            const [name, ...argv] = ctx.args.slice(1);
            if (!name) {
                error('No package name specified');
            }
            const shell = commands.create.concat(ctx.pm, {
                name: normalizePackageVersion(name!),
                args: argv,
            });
            await exec(shell);
        },
    )
    .command(
        'init',
        'initialize a new project',
        (yargs) =>
            yargs.option('y', {
                type: 'boolean',
                default: true,
            }),
        async (args) => {
            const { y } = args;
            const command = commands.init.concat(ctx.pm, { interactively: !y });
            consola.info(`Initializing project with ${ctx.pm}`);
            await exec(command);
        },
    )
    .command(['test', 't'], 'run tests', async () => {
        const command = commands.test.concat(ctx.pm, {
            args: ctx.args.slice(1),
        });
        consola.info(`Running tests with ${ctx.pm}`);
        await exec(command, { cwd: ctx.root });
    })
    .command('ci', 'run continuous integration', async () => {
        const command = commands.install.concat(ctx.pm, {
            fixed: true,
        });
        consola.info(`Running CI with ${ctx.pm}`);
        await exec(command, { cwd: ctx.root });
    })
    .command('doctor', 'diagnose common issues', async () => {
        const result = await doctor.scan(ctx.root);
        if (result.diagnoses.length === 0) {
            consola.success('No issues found');
        } else {
            result.diagnoses.forEach(doctor.writeToConsole);
        }
    })
    .command(
        'ui',
        'open the package manager UI',
        (yargs) => {
            return yargs.option('port', {
                alias: ['p', 'P'],
                type: 'number',
                description: 'Port to use',
            });
        },
        async (yargs) => {
            const port =
                yargs.port ||
                (await getPort({
                    port: 13131,
                }));
            consola.info(`Starting UI on http://localhost:${port}`);
            await start(port, ctx.root);
        },
    )
    .command('*', 'run a script', noop, async (args) => {
        if (args._.length === 0) {
            consola.info('Installing dependencies');
            const shell = commands.install.concat(ctx.pm, {});
            await exec(shell, { cwd: ctx.root });
            return;
        }
        const inputs = ctx.args;
        const pkg: PackageJson = await readPackage({ cwd: ctx.root });
        const scripts = pkg.scripts || {};
        const script = inputs[0];
        if (script && scripts[script]) {
            const shell = ['node', '--run', ...inputs];
            await exec(shell, { cwd: ctx.root });
        } else {
            const shell = commands.exec.concat(ctx.pm, {
                args: inputs,
            });
            await exec(shell, { cwd: ctx.root });
        }
    })
    .command(
        'use <pattern>',
        'use a different package manager',
        (yargs) => {
            return yargs.positional('pattern', {
                type: 'string',
                description: 'Pattern to match package manager',
                demandOption: true,
            });
        },
        async (args) => {
            const { pattern } = args;
            if (pattern === 'latest') {
                const shell = ['corepack', 'use', `${ctx.pm}@latest`];
                await exec(shell, { cwd: ctx.root });
                return;
            }
            const shell = ['corepack', 'use', pattern];
            await exec(shell, { cwd: ctx.root });
        },
    )
    .command(
        ['update [packages..]', 'up'],
        'update packages',
        (yargs) =>
            yargs
                .positional('packages', {
                    type: 'string',
                    array: true,
                    description: 'Packages to update',
                })
                .option('save', {
                    alias: ['d'],
                    type: 'boolean',
                    description: 'Save to dependencies',
                    default: true,
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
                .option('fixed', {
                    alias: ['F'],
                    type: 'boolean',
                    description: 'Use fixed version',
                })
                .option('global', {
                    alias: ['G', 'g'],
                    type: 'boolean',
                    description: 'Update packages globally',
                }),
        async (args) => {
            const { packages, saveDev, saveExact, fixed, save } = args;
            const options: AddOptions = {
                packages: packages!,
                save,
                saveDev,
                exact: saveExact,
                fixed,
            };
            const command = commands.update.concat(ctx.pm, options);
            await exec(command, { cwd: ctx.root });
        },
    )
    .command('publish', 'publish package', async () => {
        const command = ['npm', 'publish'];
        await exec(command, { cwd: ctx.root });
    })
    .command(
        ['why <query>', 'explain'],
        'explain why a package is installed',
        (yargs) =>
            yargs.positional('query', {
                type: 'string',
                description: 'Package to explain',
                demandOption: true,
            }),
        async (args) => {
            const { query } = args;
            const command = commands.why.concat(ctx.pm, { query });
            await exec(command, { cwd: ctx.root });
        },
    )
    .parse();
