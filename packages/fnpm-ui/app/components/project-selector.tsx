import { NativeSelect, Skeleton } from '@mantine/core';
import type { SerializeFrom } from '@remix-run/node';
import { Await, useNavigate, useParams } from '@remix-run/react';
import type { RawContext } from 'fnpm-doctor';
import { type FC, Suspense } from 'react';

export interface ProjectSelector {
    promise: Promise<SerializeFrom<RawContext>>;
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
