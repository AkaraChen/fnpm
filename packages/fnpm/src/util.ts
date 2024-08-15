import { execa } from 'execa';
import { packageUp } from 'package-up';

export function exec(shell: string) {
    return execa({
        shell: true,
        stdio: 'inherit',
    })`${shell}`;
}

export async function findProjectRoot() {
    const pkgDir = await packageUp();
    if (!pkgDir) {
        throw new Error('No package.json found');
    }
    return pkgDir;
}
