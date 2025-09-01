#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import { mount } from './commands';
import { getContext } from './util';

const ctx = await getContext(process.cwd());

mount(
    yargs(ctx.args)
        .scriptName('fnpm')
        .completion()
        .recommendCommands()
        .version(pkg.version)
        .alias('version', 'v')
        .help()
        .alias('help', 'h')
        .usage('Usage: $0 <command> [options]'),
    ctx
).parse();
