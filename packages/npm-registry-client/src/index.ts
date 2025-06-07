import createClient, { type Client, type ClientOptions } from 'openapi-fetch';
import type { components, paths } from './schema';

export interface NpmjsClient extends Client<paths> {
    with(options: ClientOptions): NpmjsClient;
}

export const defaultOptions: ClientOptions = {
    baseUrl: 'https://registry.npmjs.org',
};

export const npmjs = createClient<paths>(defaultOptions) as NpmjsClient;

npmjs.with = (options: ClientOptions) => {
    const client = createClient<paths>({
        ...defaultOptions,
        ...options,
    }) as NpmjsClient;
    client.with = npmjs.with;
    return client;
};

export default npmjs;

type schema = components['schemas'];

export type { paths, schema };
