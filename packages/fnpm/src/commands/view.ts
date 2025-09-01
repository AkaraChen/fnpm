import gitUrlParse from 'git-url-parse';
import open from 'open';
import { readPackage } from 'pkg-types';
import type { ArgumentsCamelCase, Argv } from 'yargs';
import { error } from '../util';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

interface ViewCommandOptions extends BaseCommandOptions {
    platform: 'repo' | 'npm';
}

class View<U extends ViewCommandOptions> extends BaseCommand<U> {
    public command = ['view [platform]', 'v'];
    public describe = 'View in other platform';
    public builder = (args: Argv): Argv<U> => {
        return args.positional('platform', {
            choices: ['repo', 'npm'],
            default: 'npm',
        }) as Argv<U>;
    };

    public async handler(args: ArgumentsCamelCase<U>) {
        const { platform } = args;
        const pkgJson = await readPackage(this.ctx.root);
        switch (platform) {
            case 'repo': {
                if (pkgJson.repository?.type !== 'git') {
                    error(
                        `The package's repository is hosted on ${pkgJson.repository?.type} which is not supported yet.`
                    );
                }
                const url = gitUrlParse(pkgJson.repository!.url).toString(
                    'https'
                );
                open(url);
                break;
            }
            case 'npm': {
                open(new URL(pkgJson.name!, 'https://npm.im').href);
                break;
            }
            default: {
                error(`The requested platform ${platform} is not supported`);
            }
        }
    }
}

export default View;
