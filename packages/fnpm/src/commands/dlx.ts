import consola from 'consola';
import { commands } from 'pm-combo';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

type DlxCommandOptions = BaseCommandOptions;

class Dlx extends BaseCommand<DlxCommandOptions> {
    public command = 'dlx';
    public describe = 'download and exec';

    public builder(args: Argv): Argv<DlxCommandOptions> {
        return args as Argv<DlxCommandOptions>;
    }

    public async handler(args: ArgumentsCamelCase<DlxCommandOptions>) {
        const pkg =
            args._[0] === 'dlx' ? (args._[1] as string) : (args._[0] as string);
        const rest = this.ctx.args.slice(this.ctx.args.indexOf(pkg) + 1);
        if (!pkg) {
            error('No package specified');
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
