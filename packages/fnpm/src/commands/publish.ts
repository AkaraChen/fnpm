import type { CommandModule } from 'yargs';
import { exec } from '../util';

class Publish implements CommandModule {
    public command = 'publish';
    public describe = 'publish package';
    public builder = {};

    public async handler() {
        const command = ['npm', 'publish'];
        await exec(command, { cwd: globalThis.ctx.root });
    }
}

export default Publish;
