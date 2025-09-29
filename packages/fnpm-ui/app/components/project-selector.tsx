import { NativeSelect } from '@mantine/core';
import type { WorkspaceContext } from 'fnpm-context';
import { type FC } from 'react';
import { useParams } from 'react-router';

export interface ProjectSelectorProps {
    context: WorkspaceContext;
    onChange: (project: string) => void;
}

export const ProjectSelector: FC<ProjectSelectorProps> = (props) => {
    const { context, onChange } = props;
    const params = useParams();
    const fallback = context.rootProject?.manifest.name;
    const value = params.name ?? fallback ?? '';
    return (
        <NativeSelect
            data={context.projects.map((p) => p.manifest.name!)}
            w={'300px'}
            label={'Select package'}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
        />
    );
};
