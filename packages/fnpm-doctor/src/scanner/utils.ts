import pc from 'picocolors';
import type { Formatter } from 'picocolors/types';
import terminalLink from 'terminal-link';
import { match } from 'ts-pattern';
import type { Diagnose } from './rule';

function getLevelColor(level: Diagnose['level']): Formatter {
    return match(level)
        .with('error', () => pc.red)
        .with('warning', () => pc.yellow)
        .with('info', () => pc.blue)
        .exhaustive();
}

function getMethod(level: Diagnose['level']) {
    return match(level)
        .with('error', () => console.error)
        .with('warning', () => console.warn)
        .with('info', () => console.log)
        .exhaustive();
}

export function writeToConsole(diagnose: Diagnose): void {
    const workspace = diagnose.workspace ?? ['root'];
    const method = getMethod(diagnose.level);
    const level = getLevelColor(diagnose.level)(diagnose.level.toUpperCase());
    method(
        `${pc.cyan(workspace.join(','))}[${pc.dim(diagnose.scope)}]`,
        pc.bold(level),
        pc.bold(diagnose.title)
    );
    method(
        diagnose.description,
        ' '.repeat(1),
        diagnose.docs ? terminalLink('Document', diagnose.docs.toString()) : ''
    );
    console.log();
}
