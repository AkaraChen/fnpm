import { Effect } from 'effect';
import { tryFile } from 'try-files';
import type { Scanner } from './scanner';

const eslintFiles = [
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    '.eslintrc',
];

export const eslint: Scanner = (ctx) => {
    let hasEslintRc = false;
    return Effect.sync(() => {
        for (const project of ctx.projects) {
            const file = tryFile(eslintFiles, {
                root: project.rootDir,
                absolute: false,
            });
            if (file) {
                if (hasEslintRc) {
                    ctx.report({
                        level: 'warning',
                        title: 'Multiple ESLint configurations',
                        description:
                            'Multiple ESLint configurations found in the project, this can lead to unexpected behavior. Consider consolidating them into a single configuration file.',
                        scope: 'configuration',
                    });
                    return;
                }
                hasEslintRc = true;
            }
        }
    });
};
