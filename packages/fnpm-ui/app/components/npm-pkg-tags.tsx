import {
    type IconType,
    SiGooglechrome,
    SiIterm2,
    SiJavascript,
    SiReact,
    SiTypescript,
} from '@icons-pack/react-simple-icons';
import { Flex, rem } from '@mantine/core';
import {
    hasBin,
    hasExportFields,
    hasReact,
    hasTypes,
    sortSemver,
} from 'fnpm-toolkit';
import { type ComponentProps, type FC, useMemo } from 'react';
import type { PackageJson } from 'type-fest';
import { usePackument } from '~/requests/npm';

export interface NpmPkgTagsProps {
    name: string;
    version?: string;
}

const iconProps: Partial<ComponentProps<IconType>> = {
    style: { width: rem(20) },
    color: 'default',
};

interface SimpleIconProps {
    icon: IconType;
}

const SimpleIcon: FC<SimpleIconProps> = (props) => {
    const { icon: Icon } = props;
    return <Icon {...iconProps} />;
};

export const NpmPkgTags: FC<NpmPkgTagsProps> = (props) => {
    const { name, version } = props;
    const query = usePackument(name);
    const manifest = useMemo(() => {
        if (!query.data?.versions) return null;
        const versions = sortSemver(Object.keys(query.data.versions));
        return query.data.versions[version || versions[0]];
    }, [query.data?.versions, version]);
    if (!manifest) {
        return null;
    }
    const isTyped = hasTypes(manifest as PackageJson);
    const isReactLib = hasReact(manifest as PackageJson);
    const isCliApp = hasBin(manifest as PackageJson);
    const isBrowser = hasExportFields(manifest as PackageJson, 'browser');
    return (
        <Flex gap={8}>
            {isTyped ? (
                <SimpleIcon icon={SiTypescript} />
            ) : (
                <SimpleIcon icon={SiJavascript} />
            )}
            {isReactLib && <SimpleIcon icon={SiReact} />}
            {isCliApp && <SimpleIcon icon={SiIterm2} />}
            {isBrowser && <SimpleIcon icon={SiGooglechrome} />}
        </Flex>
    );
};
