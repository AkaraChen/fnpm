import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { exec } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface ScaffoldCommandOptions extends BaseCommandOptions {}

class Scaffold extends BaseCommand<ScaffoldCommandOptions> {
    public command = ['scaffold', 'sc'];
    public describe = 'Scaffold a new project';

    public builder(args: Argv): Argv<ScaffoldCommandOptions> {
        return args as Argv<ScaffoldCommandOptions>;
    }

    public handler = () => {
        exec(
            commands.create.concat(this.ctx.pm, {
                name: 'akrc',
                args: [],
            }),
            { cwd: this.ctx.root },
        );
    };
}

export default Scaffold;
