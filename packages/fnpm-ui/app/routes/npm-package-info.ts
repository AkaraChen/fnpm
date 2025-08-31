import { npmjs } from '@akrc/npm-registry-client';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader(args: LoaderFunctionArgs) {
    const search = new URL(args.request.url).searchParams;
    const name = search.get('name');
    if (!name) {
        throw new Error('Missing package [name]');
    }
    const { data } = await npmjs.GET('/{packageName}', {
        params: { path: { packageName: name } },
    });
    return data;
}
