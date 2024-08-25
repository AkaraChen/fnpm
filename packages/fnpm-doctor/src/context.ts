import fs, { promises as fsp } from 'node:fs';
import * as mt from '@akrc/monorepo-tools';
import path from 'pathe';

export type DiagnoseLevel = 'error' | 'warning' | 'info';

export interface Diagnose {
    level: DiagnoseLevel;
    title: string;
    description: string;
    docs?: string;
    workspace?: string;
    scope?: string;
}

export interface Context {
    cwd: string;
    root: string;
    diagnoses: Diagnose[];
    report(...diagnoses: Diagnose[]): void;
    pm: mt.PM;
    projects: Awaited<ReturnType<typeof mt.scanProjects>>;
    resolve(filePath: string): string;
    exists(filePath: string): boolean;
    file(filePath: string): Promise<string>;
    json<T>(jsonPath: string): Promise<T>;
}

class ContextImpl implements Context {
    diagnoses: Diagnose[] = [];
    pm!: mt.PM;
    projects!: Awaited<ReturnType<typeof mt.scanProjects>>;
    root!: string;

    constructor(public cwd: string) {}

    async init() {
        this.root = await mt.findRepoRoot(this.cwd);
        this.pm = mt
            .detectPMByLock(this.root)
            .expect('Could not determine package manager');
        this.projects = await mt.scanProjects(this.root, this.pm);
    }

    report(...diagnoses: Diagnose[]) {
        this.diagnoses.push(...diagnoses);
    }
    resolve(filePath: string) {
        return path.resolve(this.root, filePath);
    }
    exists(filePath: string) {
        return fs.existsSync(filePath);
    }
    async file(filePath: string) {
        return fsp.readFile(filePath, 'utf-8');
    }
    async json<T>(jsonPath: string) {
        return JSON.parse(await this.file(jsonPath)) as T;
    }
}

export async function resolveContext(cwd: string): Promise<Context> {
    const ctx = new ContextImpl(cwd);
    await ctx.init();
    return ctx;
}
