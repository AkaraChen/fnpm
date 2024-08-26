// @ts-check

import { execa } from 'execa';
import open from 'open';

/**
 *
 * @param {number} port
 */
export const start = async (port) => {
    const url = new URL('http://localhost');
    url.port = String(port);
    setTimeout(() => {
        open(url.href);
    }, 1000);
    await execa({
        preferLocal: true,
        env: {
            PORT: String(port),
        },
        cwd: import.meta.dirname,
    })`remix-serve ./build/server/index.js`;
};
