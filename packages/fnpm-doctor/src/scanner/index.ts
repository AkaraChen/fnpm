import { eslint } from './eslint';
import { publint } from './publint';
import type { Scanner } from './scanner';
import { update } from './update';
import { versionMismatch } from './version-mismatch';

export const scanners: Scanner[] = [eslint, update, versionMismatch, publint];
