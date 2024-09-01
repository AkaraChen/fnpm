import { NativeSelect } from '@mantine/core';
import { sortSemver } from 'fnpm-toolkit';
import type { FC } from 'react';
import { usePackument } from '~/requests/npm';

export interface VersionSelectorProps {
    name: string;
    version?: string;
    onChange: (version: string) => void;
}

export const VersionSelector: FC<VersionSelectorProps> = (props) => {
    const { name, version, onChange } = props;
    const query = usePackument(name);
    return (
        <NativeSelect
            data={sortSemver(Object.keys(query.data?.versions || {}))}
            value={version}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            w={100}
        />
    );
};
