import { defu } from 'defu';
import createClient, { type Client, type ClientOptions } from 'openapi-fetch';

export type ApiClient<path extends {}> = Client<path> & {
    with(options: ClientOptions): ApiClient<path>;
};

export const createApiClient = <path extends {}>(options: ClientOptions) => {
    const client = createClient<path>(options) as ApiClient<path>;
    client.with = (inputOptions: ClientOptions) => {
        return createApiClient(defu(inputOptions, options));
    };
    return client;
};
