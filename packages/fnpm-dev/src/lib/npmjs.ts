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
        window.open(`https://npmjs.com/search?q=${keyword}`, '_blank');
    } else if (pathname.startsWith('/packages/')) {
        const idx = pathname.indexOf('/packages/') + '/packages/'.length;
        const packageName = pathname.slice(idx);
        window.open(`https://npmjs.com/package/${packageName}`, '_blank');
    }
}
