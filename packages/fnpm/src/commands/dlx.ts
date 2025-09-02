import consola from 'consola';
import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';
import { printCommandHelp } from '../help';

type DlxCommandOptions = BaseCommandOptions;

class Dlx extends BaseCommand<DlxCommandOptions> {
    public command = 'dlx';
    public describe = 'download and exec';

    public builder(args: Argv): Argv<DlxCommandOptions> {
        // For `dlx`, we want flags like `--help`/`-h` and `-v` to be
        // forwarded to the executed package (e.g., create-next-app), not
        // intercepted by yargs. Disable help/version here and ensure option
        // parsing halts after the command name so subsequent flags are passed through.
        return args.help(false).version(false).parserConfiguration({
            'halt-at-non-option': true,
            'unknown-options-as-args': true,
        }) as Argv<DlxCommandOptions>;
    }

    public async handler() {
        // Determine the package name and rest of args directly from raw argv
        // to avoid yargs interpretation (which we disabled for this command).
        const argv = this.ctx.args;
        const startIndex = argv[0] === 'dlx' ? 1 : 0;
        const pkg = argv[startIndex];
        const rest = argv.slice(startIndex + 1);
        if (!pkg) {
            error('No package specified');
        }
        if (String(pkg).startsWith('-')) {
            printCommandHelp(this);
            return;
        }
        const command = commands.dlx.concat(this.ctx.pm, {
            package: normalizePackageVersion(pkg),
            args: rest,
        });
        consola.info(`Running ${command.join(' ')}`);
        await exec(command);
    }
}

export default Dlx;
