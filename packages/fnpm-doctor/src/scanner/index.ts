import { Effect } from 'effect';
import { eslint } from './eslint';
import { moduleReplacement } from './module-replacement';
import { publint } from './publint';
import {
    type Scanner,
    ScannerContextImpl,
    type ScannerDiagnose,
} from './scanner';
import { versionMismatch } from './version-mismatch';

const scanners: Scanner[] = [
    eslint,
    versionMismatch,
    publint,
    moduleReplacement,
];

export interface ScanResult {
    diagnoses: ScannerDiagnose[];
}

export async function scan(searchDir: string): Promise<ScanResult> {
    const context = new ScannerContextImpl(searchDir);
    await context.init();
    await Promise.all(
        scanners.map(
            async (scanner) => await Effect.runPromise(scanner(context)),
        ),
    );
    return {
        diagnoses: context.diagnoses,
    };
}
