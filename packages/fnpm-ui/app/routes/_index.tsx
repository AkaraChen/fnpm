import { Button } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [{ title: 'fnpm UI' }];
};

export default function Index() {
    return <Button>OK</Button>;
}
