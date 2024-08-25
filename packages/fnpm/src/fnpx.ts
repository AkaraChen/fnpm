#!/usr/bin/env node

import { commands } from 'pm-combo';
import yargs from 'yargs';
import pkg from '../package.json';
import { error, exec, getContext, noop, standardizeVersion } from './util';

const ctx = await getContext(process.cwd());

await yargs(ctx.args)
    .scriptName('fnpx')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .command('*', 'download and exec', noop, async (argv) => {
        if (!argv._.length) {
            error('No command specified');
        }
        const [command, ...rest] = ctx.args;
        if (!command) {
            error('No command specified');
        }
        const shell = commands.dlx
            .concat(ctx.pm, {
                package: standardizeVersion(command!),
                args: rest,
            })
            .join(' ');
        await exec(shell);
    })
    .help()
    .alias('help', 'h')
    .usage('Usage: $0 <command> [options]')
    .parse();
