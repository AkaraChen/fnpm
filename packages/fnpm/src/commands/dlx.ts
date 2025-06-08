import consola from 'consola';
import { commands } from 'pm-combo';
import type { CommandModule } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';

class Dlx implements CommandModule {
    public command = 'dlx';
    public describe = 'download and exec';
    public builder = {};

    public async handler() {
        const [pkg, ...rest] = globalThis.ctx.args.slice(1);
        if (!pkg) {
            error('No package specified');
        }
        const command = commands.dlx.concat(globalThis.ctx.pm, {
            package: normalizePackageVersion(pkg!),
            args: rest,
        });
        consola.info(`Running ${command}`);
        await exec(command);
    }
}

export default Dlx;
