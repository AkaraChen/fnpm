#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import { Dlx } from './commands';
import { getContext } from './util';

const ctx = await getContext(process.cwd());

class Fnpx extends Dlx {
    override command = '*';
}

yargs(ctx.args)
    .scriptName('fnpx')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .command(new Fnpx())
    .help()
    .alias('help', 'h')
    .usage('Usage: $0 <command> [options]')
    .parse();
