import { Box } from '@mantine/core';
import type { MetaFunction } from 'react-router';
import { Outlet } from 'react-router';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { root } from '~/server/config.server';
import { resolveWorkspaceContext } from '~/server/fnpm.server';

/**
 * Load and provide the workspace context for this route.
 *
 * @returns An object with a `context` property containing the resolved workspace context. 
 */
export async function loader() {
    const context = resolveWorkspaceContext(root);
    return {
        context,
    };
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Installer',
            description: 'Install packages',
        },
    ];
};

export default function Installer() {
    return (
        <BasePage>
            <PageHeader title='Installer' />
            <Box w={'100%'} h={'calc(100% - 60px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
