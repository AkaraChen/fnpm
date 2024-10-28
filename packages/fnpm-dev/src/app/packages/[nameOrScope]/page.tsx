import {
    Package,
    type SearchParams,
} from '@/app/packages/[nameOrScope]/shared';

interface Params {
    nameOrScope: string;
}

export default async function Page(props: {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
}) {
    const { nameOrScope: name } = await props.params;
    const { version, tab } = await props.searchParams;
    return <Package name={name} version={version} tab={tab} />;
}
