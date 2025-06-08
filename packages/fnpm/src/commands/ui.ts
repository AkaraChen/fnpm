import consola from 'consola';
import { start } from 'fnpm-ui';
import { getPort } from 'get-port-please';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';

interface UICommandOptions extends Options {
    port?: number;
}

class UI<U extends UICommandOptions> implements CommandModule<EmptyObject, U> {
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
        await start(port, globalThis.ctx.root);
    }
}

export default UI;
