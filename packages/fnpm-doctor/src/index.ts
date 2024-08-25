import { Effect } from 'effect';
import { type Diagnose, resolveContext } from './context';
import { scanners } from './scanner';

export interface ScanResult {
    diagnoses: Diagnose[];
}

export async function scan(searchDir: string): Promise<ScanResult> {
    const context = await resolveContext(searchDir);
    await Promise.all(
        scanners.map(
            async (scanner) => await Effect.runPromise(scanner(context)),
        ),
    );
    return {
        diagnoses: context.diagnoses,
    };
}

export { writeToConsole } from './utils';
export { resolveContext } from './context';

export default scan;
