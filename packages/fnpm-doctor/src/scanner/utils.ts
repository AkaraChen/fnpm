import pc from 'picocolors';
import type { Formatter } from 'picocolors/types';
import { match } from 'ts-pattern';
import type { ScannerDiagnose } from './scanner';

function getLevelColor(level: ScannerDiagnose['level']): Formatter {
    return match(level)
        .with('error', () => pc.red)
        .with('warning', () => pc.yellow)
        .with('info', () => pc.blue)
        .exhaustive();
}

function getMethod(level: ScannerDiagnose['level']) {
    return match(level)
        .with('error', () => console.error)
        .with('warning', () => console.warn)
        .with('info', () => console.log)
        .exhaustive();
}

export function writeToConsole(diagnose: ScannerDiagnose): void {
    const workspace = diagnose.workspace ?? ['root'];
    const method = getMethod(diagnose.level);
    const level = getLevelColor(diagnose.level)(diagnose.level.toUpperCase());
    method(
        `${pc.cyan(workspace.join(','))}[${pc.dim(diagnose.scope)}]`,
        pc.bold(level),
        pc.bold(diagnose.title),
    );
    method(diagnose.description);
    console.log();
}
