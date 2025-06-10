import consola from 'consola';
import { commands } from 'pm-combo';
import type { CommandModule } from 'yargs';
import { exec } from '../util';

class CI implements CommandModule {
    public command = 'ci';
    public describe = 'run continuous integration';

    public async handler() {
        const command = commands.install.concat(globalThis.ctx.pm, {
            fixed: true,
        });
        consola.info(`Running CI with ${globalThis.ctx.pm}`);
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default CI;
