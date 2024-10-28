import {
    Package,
    type SearchParams,
} from '@/app/packages/[nameOrScope]/shared';

interface Params {
    nameOrScope: string;
    name: string;
}

export default async function Page(props: {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
}) {
    const { nameOrScope: scope, name } = await props.params;
    const nameWithScope = `${decodeURIComponent(scope)}/${name}`;
    const { version, tab } = await props.searchParams;
    return <Package name={nameWithScope} version={version} tab={tab} />;
}
