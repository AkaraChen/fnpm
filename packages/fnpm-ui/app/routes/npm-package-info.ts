import type { LoaderFunctionArgs } from '@remix-run/node';
import { getPackument } from 'query-registry';

export async function loader(args: LoaderFunctionArgs) {
    const search = new URL(args.request.url).searchParams;
    const name = search.get('name');
    if (!name) {
        throw new Error('Missing package name');
    }
    return await getPackument(name);
}
