// @ts-check

import { execa } from 'execa';
import open from 'open';

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
    process.env.FNPM_ROOT = root;
    await execa({
        env: {
            PORT: String(port),
        },
        cwd: import.meta.dirname,
    })`npm run start`;
};
