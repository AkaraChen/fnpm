// @ts-check

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';
import { x } from 'tinyexec';

/**
 *
 * @param {number} port
 * @param {string} root
 */
export const start = async (port, root) => {
    const url = new URL('http://localhost');
    url.port = String(port);
    setTimeout(() => {
        open(url.href);
    }, 1000);
    await x('npm', ['run', 'start'], {
        nodeOptions: {
            env: {
                NODE_ENV: 'development',
                PORT: String(port),
                FNPM_ROOT: root,
            },
            cwd: dirname(fileURLToPath(import.meta.url)),
            stdio: ['ignore', 'inherit', 'ignore'],
        },
    });
};
