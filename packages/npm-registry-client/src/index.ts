import type { components as apiComponents } from '../generated/api.generated';
import type { components as registryComponents } from '../generated/registry.generated';
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

// for backward compatibility
export type schema = apiComponents['schemas'] & registryComponents['schemas'];
