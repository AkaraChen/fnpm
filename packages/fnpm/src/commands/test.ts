import consola from 'consola';
import { commands } from 'pm-combo';
import type { CommandModule } from 'yargs';
import { exec } from '../util';

class Test implements CommandModule {
    public command = ['test', 't'];
    public describe = 'run tests';
    public builder = {};

    public async handler() {
        const command = commands.test.concat(globalThis.ctx.pm, {
            args: globalThis.ctx.args.slice(1),
        });
        consola.info(`Running tests with ${globalThis.ctx.pm}`);
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Test;
