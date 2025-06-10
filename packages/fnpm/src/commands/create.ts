import { commands } from 'pm-combo';
import type { CommandModule } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';

class Create implements CommandModule {
    public command = 'create';
    public describe = 'create an new project using package from npm';

    public async handler() {
        const [name, ...argv] = globalThis.ctx.args.slice(1);
        if (!name) {
            error('No package [name] specified');
        }
        const shell = commands.create.concat(globalThis.ctx.pm, {
            name: normalizePackageVersion(name!),
            args: argv,
        });
        await exec(shell);
    }
}

export default Create;
