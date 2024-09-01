import { useQuery } from '@tanstack/react-query';
import type { Packument } from 'query-registry';

export function usePackument(name: string) {
    return useQuery({
        queryKey: ['packument', name],
        async queryFn(context) {
            const url = new URL('/npm-package-info', window.location.origin);
            url.searchParams.set('name', name);
            return (await fetch(url.toString(), {
                signal: context.signal,
            }).then((res) => res.json())) as Packument;
        },
    });
}
