import type { paths } from '../generated/registry.generated';
import { createApiClient } from './client';

export const registry = createApiClient<paths>({
    baseUrl: 'https://registry.npmjs.org',
});
