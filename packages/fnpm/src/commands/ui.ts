import consola from 'consola';
import { start } from 'fnpm-ui';
import { getPort } from 'get-port-please';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { BaseCommand } from './base';
import type { BaseCommandOptions } from './base';

interface UICommandOptions extends BaseCommandOptions {
    port?: number;
}

class UI<U extends UICommandOptions> extends BaseCommand<U> {
    public command = 'ui';
    public describe = 'open the package manager UI';
    public builder = (args: Argv): Argv<U> => {
        return args.option('port', {
            alias: ['p', 'P'],
            type: 'number',
            description: 'Port to use',
        }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const port =
            args.port ||
            (await getPort({
                port: 13131,
            }));
        consola.info(`Starting UI on http://localhost:${port}`);
        await start(port, this.ctx.root);
    }
}

export default UI;
