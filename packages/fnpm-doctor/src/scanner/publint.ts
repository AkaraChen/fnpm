import { sentenceCase } from 'change-case';
import { Effect } from 'effect';
import { publint as run } from 'publint';
import { formatMessage } from 'publint/utils';
import { readPackage } from 'read-pkg';
import type { Scanner } from './scanner';

export const publint: Scanner = (ctx) => {
    return Effect.promise(async () => {
        await Promise.all(
            ctx.projects
                .filter((p) => p.manifest.private !== true)
                .map(async (project) => {
                    return run({
                        pkgDir: project.rootDir,
                    }).then(async (result) => {
                        for (const message of result.messages) {
                            const level =
                                message.type === 'suggestion'
                                    ? 'info'
                                    : message.type === 'warning'
                                      ? 'warning'
                                      : 'error';
                            const title = sentenceCase(message.code);
                            const pkg = await readPackage({
                                cwd: project.rootDir,
                            });
                            const docs = new URL('https://publint.dev/rules');
                            docs.hash = message.code.toLowerCase();
                            ctx.report({
                                id: `publint-${title}`,
                                level,
                                title,
                                description: formatMessage(
                                    message,
                                    project.manifest,
                                )!,
                                docs,
                                workspace: [pkg.name],
                                scope: 'publishing',
                            });
                        }
                    });
                }),
        );
    });
};
