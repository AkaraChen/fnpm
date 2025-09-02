#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import { mount } from './commands';
import { getContext } from './util';
import { printRootHelp } from './help';

const ctx = await getContext(process.cwd());

// Manual root help for consistent style
if (ctx.args.length === 0 || ctx.args[0] === '--help' || ctx.args[0] === '-h') {
    printRootHelp('fnpm');
    process.exit(0);
}

mount(
    yargs(ctx.args)
        .scriptName('fnpm')
        .completion()
        .recommendCommands()
        .version(pkg.version)
        .alias('version', 'v')
        .usage('Usage: $0 <command> [options]'),
    ctx
).parse();
