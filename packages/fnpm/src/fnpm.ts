#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import pkg from '../package.json';
import { mount } from './commands';
import { getContext } from './util';
import { printRootHelp } from './help';

// Fast path: handle help and version without resolving context
const args = hideBin(process.argv);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printRootHelp('fnpm');
    process.exit(0);
}
if (args[0] === '--version' || args[0] === '-v') {
    console.log(pkg.version);
    process.exit(0);
}

// Only resolve context when we need it for actual commands
const ctx = await getContext(process.cwd());

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
