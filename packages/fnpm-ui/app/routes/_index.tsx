import type { MetaFunction } from '@remix-run/node';
import { PageHeader } from '~/components/page-header';

export const meta: MetaFunction = () => {
    return [{ title: 'fnpm UI' }];
};

export default function Index() {
    return (
        <>
            <PageHeader title='Dashboard' />
        </>
    );
}
