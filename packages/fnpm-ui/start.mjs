// @ts-check

import { execa } from 'execa';
import open from 'open';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

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
    await execa({
        env: {
            PORT: String(port),
            FNPM_ROOT: root,
        },
        cwd: dirname(fileURLToPath(import.meta.url)),
        stderr: 'inherit',
    })`npm run start`;
};
