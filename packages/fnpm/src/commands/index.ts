import type { Argv } from 'yargs';
import type { Context } from '../util';
import { CommandFactory } from './base';

export { default as Dlx } from './dlx';

// Lazy-loaded command registry
const commands = [
    () => import('./add'),
    () => import('./create'),
    () => import('./dlx'),
    () => import('./remove'),
    () => import('./init'),
    () => import('./test'),
    () => import('./ci'),
    () => import('./doctor'),
    () => import('./ui'),
    () => import('./default'),
    () => import('./use'),
    () => import('./update'),
    () => import('./publish'),
    () => import('./why'),
    () => import('./config'),
    () => import('./registry'),
    () => import('./scaffold'),
    () => import('./view'),
];

export function mount(argv: Argv, ctx: Context) {
    const factory = new CommandFactory(ctx);
    for (const loader of commands) {
        argv.command(factory.createLazy(loader));
    }
    return argv;
}
