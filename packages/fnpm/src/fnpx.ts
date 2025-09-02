#!/usr/bin/env node

import yargs from 'yargs';
import pkg from '../package.json';
import { Dlx } from './commands';
import { CommandFactory } from './commands/base';
import { getContext } from './util';

const ctx = await getContext(process.cwd());
const factory = new CommandFactory(ctx);

class Fnpx extends Dlx {
    override command = '*';
}

yargs(ctx.args)
    .scriptName('fnpx')
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias('version', 'v')
    .command(factory.create(Fnpx))
    .parserConfiguration({
        'halt-at-non-option': true,
        'unknown-options-as-args': true,
    })
    .usage('Usage: $0 <command> [options]')
    .parse();
