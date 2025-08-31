import { npmjs } from '@akrc/npm-registry-client';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader(args: LoaderFunctionArgs) {
    const params = new URL(args.request.url).searchParams;
    const query = params.get('query');
    const page = params.get('page');
    const size = 50;
    const from = page ? Number.parseInt(page, 10) * size : 0;
    const { data: packages } = await npmjs.GET('/-/v1/search', {
        params: {
            query: {
                text: query!,
                size,
                from,
            },
        },
    });
    return {
        ...packages,
        query,
        page: page ? Number.parseInt(page, 10) : 0,
        size,
    };
}

export type LoaderData = Awaited<ReturnType<typeof loader>>;
