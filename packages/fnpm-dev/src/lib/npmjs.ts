import { npmjs as client } from '@akrc/npm-registry-client';
import { throwOnHttpError } from '@akrc/npm-registry-client/middleware';
import { match } from 'ts-pattern';
import { Tab as PackagePageTab } from '@/app/packages/[nameOrScope]/shared';

export function viewOnNpmjs(pathname: string) {
    if (pathname === '/') {
        window.open('https://npmjs.com');
    } else if (pathname === '/search') {
        const keyword = new URLSearchParams(window.location.search).get(
            'keyword',
        );
        if (!keyword) {
            return;
        }
        const url = new URL('https://npmjs.com/search');
        url.searchParams.set('q', keyword);
        window.open(url, '_blank');
    } else if (pathname.startsWith('/packages/')) {
        const tab = new URLSearchParams(window.location.search).get('tab');
        const idx = pathname.indexOf('/packages/') + '/packages/'.length;
        const packageName = pathname.slice(idx);
        const url = new URL(`package/${packageName}`, 'https://npmjs.com');
        if (tab) {
            match(tab)
                .with(PackagePageTab.Code, () => {
                    url.searchParams.set('activeTab', 'code');
                })
                .with(PackagePageTab.Dependencies, () => {
                    url.searchParams.set('activeTab', 'dependencies');
                })
                .otherwise(() => {});
        }
        window.open(url, '_blank');
    }
}

export const npmjsRegistry = client;
npmjsRegistry.use(throwOnHttpError);

export const npmjsApi = client.api;
npmjsApi.use(throwOnHttpError);
