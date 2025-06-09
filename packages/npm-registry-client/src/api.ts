import type { components, paths } from '../generated/api.generated';
import { createApiClient } from './client';

export const api = createApiClient<paths>({
    baseUrl: 'https://api.npmjs.org',
});

export type schema = components['schemas'];
