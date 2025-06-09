import { api } from './api';
import { registry } from './registry';

export type NpmjsClient = typeof registry & {
    api: typeof api;
};

export const npmjs: NpmjsClient = {
    ...registry,
    api,
};

export default npmjs;
