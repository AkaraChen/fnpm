import { NativeSelect, Skeleton } from '@mantine/core';
import type { SafeContext } from 'fnpm-context';
import { type FC, Suspense } from 'react';
import { Await, useParams } from 'react-router';

export interface ProjectSelector {
    promise: Promise<SafeContext>;
    onChange: (project: string) => void;
}

export const ProjectSelector: FC<ProjectSelector> = (props) => {
    const { promise, onChange } = props;
    const params = useParams();
    return (
        <Suspense fallback={<Skeleton h={'60px'} w={'300px'} />}>
            <Await resolve={promise}>
                {(context) => (
                    <NativeSelect
                        data={context.projects.map((p) => p.manifest.name!)}
                        w={'300px'}
                        label={'Select package'}
                        value={
                            params.name || context.rootProject!.manifest.name
                        }
                        onChange={(e) => {
                            onChange(e.target.value);
                        }}
                    />
                )}
            </Await>
        </Suspense>
    );
};
