import type { Argv } from 'yargs';
import type { Context } from '../util';
import { CommandFactory } from './base';

export { default as Dlx } from './dlx';

// Lazy-loaded command registry
const commands = {
    add: () => import('./add'),
    create: () => import('./create'),
    dlx: () => import('./dlx'),
    remove: () => import('./remove'),
    init: () => import('./init'),
    test: () => import('./test'),
    ci: () => import('./ci'),
    doctor: () => import('./doctor'),
    ui: () => import('./ui'),
    default: () => import('./default'),
    use: () => import('./use'),
    update: () => import('./update'),
    publish: () => import('./publish'),
    why: () => import('./why'),
    config: () => import('./config'),
    registry: () => import('./registry'),
    scaffold: () => import('./scaffold'),
    view: () => import('./view'),
};

export function mount(argv: Argv, ctx: Context) {
    const factory = new CommandFactory(ctx);
    for (const loader of Object.values(commands)) {
        argv.command(factory.createLazy(loader));
    }
    return argv;
}
