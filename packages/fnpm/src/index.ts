#!/usr/bin/env node

import { error } from 'node:console';
import consola from 'consola';
import { loadJsonFile } from 'load-json-file';
import { packageUp } from 'package-up';
import { parse as parsePackageName } from 'parse-package-name';
import type { PackageJson } from 'type-fest';
import { commands } from 'unpm';
import type { AddOptions, RemoveOptions } from 'unpm';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pkg from '../package.json';
import { detectPM, exec } from './util';

const cwd = process.cwd();
const pm = await detectPM(cwd);

const args = await yargs(hideBin(process.argv))
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
            await exec(command);
        },
    )
    .command(
        'dlx',
        'run a command',
        (yargs) => yargs.help().alias('help', 'h'),
        async (args) => {
            const [pkg, ...rest] = args._.slice(1) as string[];
            const parsed = parsePackageName(pkg!);
            const command = commands.dlx
                .concat(pm, {
                    package: parsed.version ? pkg! : `${pkg}@latest`,
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
            await exec(command);
            process.exit(0);
        },
    )
    .command(
        '*',
        'run a script',
        () => {},
        async (yargs) => {
            const args = yargs._ as string[];
            const pkgPath = await packageUp({
                cwd,
            });
            if (!pkgPath) {
                error('No package.json found');
            }
            const pkg: PackageJson = await loadJsonFile(pkgPath as string);
            const scripts = pkg.scripts || {};
            const script = args[0] as string;
            if (scripts[script]) {
                await exec(`${pm} run ${args.join(' ')}`);
                process.exit(0);
            } else {
                await exec(`${pm} exec ${args.join(' ')}`);
            }
        },
    )
    .parse();

if (!args._.length) {
    error('No command specified');
}
