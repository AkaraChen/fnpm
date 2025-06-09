import { searchPackages } from 'query-registry';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader(args: LoaderFunctionArgs) {
    const params = new URL(args.request.url).searchParams;
    const query = params.get('query');
    const page = params.get('page');
    const size = 50;
    const from = page ? Number.parseInt(page) * size : 0;
    const packages = await searchPackages({
        text: query!,
        size,
        from,
    });
    return {
        ...packages,
        query,
        page: page ? Number.parseInt(page) : 0,
        size,
    };
}

export type LoaderData = Awaited<ReturnType<typeof loader>>;
