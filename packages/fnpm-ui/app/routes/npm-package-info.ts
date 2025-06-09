import { getPackument } from 'query-registry';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader(args: LoaderFunctionArgs) {
    const search = new URL(args.request.url).searchParams;
    const name = search.get('name');
    if (!name) {
        throw new Error('Missing package [name]');
    }
    return await getPackument(name);
}
