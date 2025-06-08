#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import { mount } from './commands';
import { type Context, getContext } from './util';

const _ctx = await getContext(process.cwd());
globalThis.ctx = _ctx;

declare global {
    var ctx: Context;
}

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
).parse();
