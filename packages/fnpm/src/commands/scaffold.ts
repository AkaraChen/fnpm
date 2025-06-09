import { commands } from 'pm-combo';
import type { EmptyObject } from 'type-fest';
import type { CommandModule } from 'yargs';
import { exec } from '../util';

class Scaffold implements CommandModule<EmptyObject> {
    aliases = 'sc';
    command = 'scaffold';
    describe = 'Scaffold a new project';
    handler = () => {
        exec(
            commands.create.concat(globalThis.ctx.pm, {
                name: 'akrc',
                args: [],
            }),
            { cwd: globalThis.ctx.root },
        );
    };
}

export default Scaffold;
