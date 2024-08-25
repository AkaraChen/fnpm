import { Effect } from 'effect';
import { type Diagnose, resolveContext } from './context';
import { scanners } from './scanner';

export interface Result {
    diagnoses: Diagnose[];
}

export async function scan(searchDir: string): Promise<Result> {
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

export default scan;
