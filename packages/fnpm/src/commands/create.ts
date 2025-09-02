import consola from 'consola';
import { commands } from 'pm-combo';
import type { Argv } from 'yargs';
import { error, exec, normalizePackageVersion } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

type CreateCommandOptions = BaseCommandOptions;

class Create extends BaseCommand<CreateCommandOptions> {
    public command = 'create';
    public describe = 'create an new project using package from npm';

    public builder(args: Argv): Argv<CreateCommandOptions> {
        // Similar to `dlx`, forward flags after the template name to the
        // underlying creator CLI (e.g., create-next-app) rather than yargs.
        return args.help(false).version(false).parserConfiguration({
            'halt-at-non-option': true,
            'unknown-options-as-args': true,
        }) as Argv<CreateCommandOptions>;
    }

    public async handler() {
        // Parse from raw argv to avoid yargs help interception
        const argv = this.ctx.args;
        const startIndex = argv[0] === 'create' ? 1 : 0;
        const name = argv[startIndex];
        const rest = argv.slice(startIndex + 1);
        if (!name) {
            error('No package [name] specified');
        }
        if (String(name).startsWith('-')) {
            consola.log('fnpm create\n');
            consola.log('create an new project using package from npm');
            consola.log('\nUsage: fnpm create <name> [args...]');
            consola.log('\nExamples:');
            consola.log('  fnpm create next-app --help');
            consola.log('  fnpm create vite my-app -- --template react-ts');
            return;
        }
        const shell = commands.create.concat(this.ctx.pm, {
            name: normalizePackageVersion(name!),
            args: rest,
        });
        await exec(shell);
    }
}

export default Create;
