import pc from 'picocolors';
import type { ScannerDiagnose } from './scanner';

export function getLevelColor(level: ScannerDiagnose['level']) {
    return level === 'error'
        ? pc.red
        : level === 'warning'
          ? pc.yellow
          : pc.green;
}

export function writeToConsole(diagnose: ScannerDiagnose) {
    const workspace = diagnose.workspace ?? ['root'];
    const method =
        diagnose.level === 'error'
            ? console.error
            : diagnose.level === 'warning'
              ? console.warn
              : console.log;
    const level = getLevelColor(diagnose.level)(diagnose.level.toUpperCase());
    method(
        `${pc.cyan(workspace.join(','))}[${pc.dim(diagnose.scope)}]`,
        pc.bold(level),
        pc.bold(diagnose.title),
    );
    method(diagnose.description);
    console.log();
}
