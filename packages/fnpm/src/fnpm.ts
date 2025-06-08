#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import {
    Add,
    CI,
    Config,
    Create,
    Default,
    Dlx,
    Doctor,
    Init,
    Publish,
    Remove,
    Test,
    UI,
    Update,
    Use,
    View,
    Why,
} from './commands';
import { type Context, getContext } from './util';

const _ctx = await getContext(process.cwd());
globalThis.ctx = _ctx;

declare global {
    var ctx: Context;
}

yargs(ctx.args)
    .scriptName('fnpm')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .usage('Usage: $0 <command> [options]')
    .command(new Add())
    .command(new Dlx())
    .command(new Remove())
    .command(new Create())
    .command(new Init())
    .command(new Test())
    .command(new CI())
    .command(new Doctor())
    .command(new UI())
    .command(new Default())
    .command(new Use())
    .command(new Update())
    .command(new Publish())
    .command(new View())
    .command(new Why())
    .command(new Config())
    .parse();
