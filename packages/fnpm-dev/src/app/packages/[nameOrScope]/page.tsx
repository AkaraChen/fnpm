import {
    Package,
    type Params,
    type SearchParams,
} from '@/app/packages/[nameOrScope]/shared';

export default async function Page(props: {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
}) {
    const { version, tab } = await props.searchParams;
    const { nameOrScope: name } = await props.params;
    return <Package name={name} version={version} tab={tab} />;
}
