import type { Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface PublishCommandOptions extends BaseCommandOptions {}

class Publish extends BaseCommand<PublishCommandOptions> {
    public command = 'publish';
    public describe = 'publish package';

    public builder(args: Argv): Argv<PublishCommandOptions> {
        return args as Argv<PublishCommandOptions>;
    }

    public async handler() {
        const command = ['npm', 'publish'];
        await exec(command, { cwd: this.ctx.root });
    }
}

export default Publish;
