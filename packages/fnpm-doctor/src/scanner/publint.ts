import { ReadPackage } from '@/lib/pkg';
import type { ProjectManifest } from '@pnpm/types';
import { sentenceCase } from 'change-case';
import { Console, Effect } from 'effect';
import {
    type Message,
    type Options as PublintOptions,
    publint as run,
} from 'publint';
import { formatMessage } from 'publint/utils';
import { match } from 'ts-pattern';
import type { Scanner, ScannerDiagnoseLevel } from './scanner';

function RunPublint(options: PublintOptions) {
    return Effect.tryPromise(() => run(options));
}

function formatDiagnose(message: Message, manifest: ProjectManifest) {
    const level: ScannerDiagnoseLevel = match(message.type)
        .with('suggestion', () => 'info' as const)
        .with('warning', () => 'warning' as const)
        .with('error', () => 'error' as const)
        .exhaustive();
    const title = sentenceCase(message.code);
    const docs = new URL('https://publint.dev/rules');
    docs.hash = message.code.toLowerCase();
    return {
        level,
        title,
        docs,
        description: formatMessage(message, manifest)!,
    };
}

export const publint: Scanner = (ctx) => {
    return Effect.gen(function* () {
        yield* Effect.forEach(ctx.projects, (project) => {
            return Effect.gen(function* () {
                const pkg = yield* ReadPackage({
                    cwd: project.rootDir,
                }).pipe(Effect.catchAll(Effect.fail));

                if (pkg.private) return;

                yield* Effect.gen(function* () {
                    const result = yield* RunPublint({
                        pkgDir: project.rootDir,
                    }).pipe(Effect.catchAll(Effect.fail));

                    for (const message of result.messages) {
                        const formatted = formatDiagnose(
                            message,
                            project.manifest,
                        );
                        ctx.report({
                            id: `publint-${formatted.title}`,
                            ...formatted,
                            workspace: [pkg.name!],
                            scope: 'publishing',
                        });
                    }
                });
            });
        }).pipe(Effect.catchAll(Console.error));
    });
};
