import gitUrlParse from 'git-url-parse';
import open from 'open';
import { readPackage } from 'read-pkg';
import type { EmptyObject } from 'type-fest';
import type { ArgumentsCamelCase, Argv, CommandModule, Options } from 'yargs';
import { error } from '../util';

interface ViewCommandOptions extends Options {
    platform: 'repo' | 'npm';
}

class View<U extends ViewCommandOptions>
    implements CommandModule<EmptyObject, U>
{
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
        const pkgJson = await readPackage({ cwd: globalThis.ctx.root });
        switch (platform) {
            case 'repo': {
                if (pkgJson.repository?.type !== 'git') {
                    error(
                        `The package's repository is hosted on ${pkgJson.repository?.type} which is not supported yet.`,
                    );
                }
                const url = gitUrlParse(pkgJson.repository!.url).toString(
                    'https',
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
