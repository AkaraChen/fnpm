import createClient, { type Client, type ClientOptions } from 'openapi-fetch';

export type ApiClient<path extends {}> = Client<path> & {
    with(options: ClientOptions): ApiClient<path>;
};

export const createApiClient = <path extends {}>(options: ClientOptions) => {
    const client = createClient<path>(options) as ApiClient<path>;
    client.with = createApiClient;
    return client;
};
