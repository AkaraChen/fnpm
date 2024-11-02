export function fetchFromJsdelivr(opts: {
    name: string;
    version: string | null;
    path: string;
}) {
    const { name, version, path } = opts;
    const url = new URL(
        `/npm/${name}@${version ?? 'latest'}/${path}`,
        'https://cdn.jsdelivr.net',
    );
    return fetch(url);
}
