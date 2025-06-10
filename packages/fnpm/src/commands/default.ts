import consola from 'consola';
import colors from 'picocolors';
import { commands } from 'pm-combo';
import { readPackage } from 'read-pkg';
import type { PackageJson } from 'type-fest';
import type { CommandModule } from 'yargs';
import { error, exec } from '../util';

class Default implements CommandModule {
    public command = '*';
    public describe = 'run a script';

    public async handler(args: any) {
        if (args._.length === 0) {
            consola.info('Installing dependencies');
            const shell = commands.install.concat(globalThis.ctx.pm, {});
            await exec(shell, { cwd: globalThis.ctx.root });
            return;
        }
        const inputs = globalThis.ctx.args;
        let pkg: PackageJson;
        try {
            pkg = await readPackage({
                cwd: globalThis.ctx.root,
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
            await exec(shell, { cwd: globalThis.ctx.root });
            return;
        }
        const shell = commands.exec.concat(globalThis.ctx.pm, {
            args: inputs,
        });
        consola.info(`Running ${colors.green(shell.join(' '))}`);
        await exec(shell, { cwd: globalThis.ctx.root });
    }
}

export default Default;
