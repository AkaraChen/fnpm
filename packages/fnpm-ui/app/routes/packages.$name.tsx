import { Box } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Await, defer, useLoaderData } from '@remix-run/react';
import { resolveContext } from 'fnpm-doctor';
import { Suspense } from 'react';

export function loader(args: LoaderFunctionArgs) {
    const project = resolveContext(process.cwd()).then((context) => {
        return context.projects.find(
            (p) => p.manifest.name === args.params.name,
        );
    });
    return defer({
        project,
    });
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    return (
        <Suspense>
            <Await resolve={data.project}>
                {(project) => (
                    <Box w={'100%'} h={'100%'}>
                        {project.manifest.name}
                    </Box>
                )}
            </Await>
        </Suspense>
    );
}
