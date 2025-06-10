import consola from 'consola';
import colors from 'picocolors';
import { commands } from 'pm-combo';
import { readPackage } from 'read-pkg';
import type { PackageJson } from 'type-fest';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { error, exec } from '../util';
import { BaseCommand } from './base';
import type { BaseCommandOptions } from './base';

interface DefaultCommandOptions extends BaseCommandOptions {}

class Default extends BaseCommand<DefaultCommandOptions> {
    public command = '*';
    public describe = 'run a script';

    public builder(args: Argv): Argv<DefaultCommandOptions> {
        return args as Argv<DefaultCommandOptions>;
    }

    public async handler(args: ArgumentsCamelCase<DefaultCommandOptions>) {
        if (args._.length === 0) {
            consola.info('Installing dependencies');
            const shell = commands.install.concat(this.ctx.pm, {});
            await exec(shell, { cwd: this.ctx.root });
            return;
        }
        const inputs = this.ctx.args;
        let pkg: PackageJson;
        try {
            pkg = await readPackage({
                cwd: this.ctx.root,
            });
        } catch {
            error(
                'Not in a package workspace, you may running fnpm at incorrect place.',
            );
        }
        const scripts = pkg.scripts || {};
        const [script, ...otherArgs] = inputs;
        if (script && scripts[script]) {
            const shell = ['node', '--run', script, '--', ...otherArgs];
            await exec(shell, { cwd: this.ctx.root });
            return;
        }
        const shell = commands.exec.concat(this.ctx.pm, {
            args: inputs,
        });
        consola.info(`Running ${colors.green(shell.join(' '))}`);
        await exec(shell, { cwd: this.ctx.root });
    }
}

export default Default;
