import type { Middleware } from 'openapi-fetch';

// [Middleware & Auth | OpenAPI TypeScript](https://openapi-ts.dev/openapi-fetch/middleware-auth#throwing)
export const throwOnHttpError: Middleware = {
    onResponse({ response }) {
        if (!response.ok) {
            // Will produce error messages like "https://example.org/api/v1/example: 404 Not Found".
            throw new Error(
                `${response.url}: ${response.status} ${response.statusText}`
            );
        }
    },
};
