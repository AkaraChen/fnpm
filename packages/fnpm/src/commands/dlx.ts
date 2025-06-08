import consola from 'consola';
import { commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, CommandModule } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';

class Dlx implements CommandModule {
    public command = 'dlx';
    public describe = 'download and exec';

    public async handler(args: ArgumentsCamelCase<EmptyObject>) {
        const pkg =
            args._[0] === 'dlx' ? (args._[1] as string) : (args._[0] as string);
        const rest = globalThis.ctx.args.slice(
            globalThis.ctx.args.indexOf(pkg) + 1,
        );
        if (!pkg) {
            error('No package specified');
        }
        const command = commands.dlx.concat(globalThis.ctx.pm, {
            package: normalizePackageVersion(pkg),
            args: rest,
        });
        consola.info(`Running ${command.join(' ')}`);
        await exec(command);
    }
}

export default Dlx;
