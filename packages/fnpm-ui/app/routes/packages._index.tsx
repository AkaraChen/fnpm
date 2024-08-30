import { redirect, useLoaderData, useNavigate } from '@remix-run/react';
import { resolveContext } from 'fnpm-doctor';
import { useEffect } from 'react';
import { root } from '~/server/config.server';

export async function loader() {
    const context = await resolveContext(root);
    if (!context.rootProject) {
        return redirect('/404');
    }
    return context.rootProject.manifest.name;
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const url = `/packages/${encodeURIComponent(data)}`;
    useEffect(() => {
        navigate(url);
    }, [navigate, url]);
    return null;
}
