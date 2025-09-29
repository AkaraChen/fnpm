import { Box } from '@mantine/core';
import type { WorkspaceContext } from 'fnpm-context';
import type { MetaFunction } from 'react-router';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { ProjectSelector } from '~/components/project-selector';
import { root } from '~/server/config.server';
import { resolveWorkspaceContext } from '~/server/fnpm.server';

/**
 * Loads the workspace context required by the page.
 *
 * @returns An object with `context` set to the resolved WorkspaceContext.
 */
export async function loader() {
    const context = await resolveWorkspaceContext(root);
    return {
        context,
    };
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Shared',
            description: 'Shared details',
        },
    ];
};

/**
 * Render the "Shared" packages page containing a header, project selector, and nested content outlet.
 *
 * The project selector is initialized with the resolved workspace context and navigates to `/packages/<encoded-project>`
 * when a project is selected.
 *
 * @returns The React element tree for the Shared packages page.
 */
export default function Page() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return (
        <BasePage>
            <PageHeader title='Shared' />
            <ProjectSelector
                context={data.context as unknown as WorkspaceContext}
                onChange={(value) => {
                    const url = `/packages/${encodeURIComponent(value)}`;
                    navigate(url);
                }}
            />
            <Box py={20} w={'100%'} h={'calc(100% - 100px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
