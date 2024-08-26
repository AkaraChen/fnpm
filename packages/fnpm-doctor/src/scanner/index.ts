import { Effect } from 'effect';
import { eslint } from './eslint';
import { publint } from './publint';
import {
    type Scanner,
    ScannerContextImpl,
    type ScannerDiagnose,
} from './scanner';
import { update } from './update';
import { versionMismatch } from './version-mismatch';

export const scanners: Scanner[] = [eslint, update, versionMismatch, publint];

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
