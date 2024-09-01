import { Flex, NativeSelect, Select, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { sortSemver } from 'fnpm-toolkit';
import { type FC, useRef } from 'react';
import { usePackument } from '~/requests/npm';
import { NpmPkgTags } from './npm-pkg-tags';

export interface NpmPkgInfoProps {
    name: string;
    version?: string;
    onVersionChange: (version: string) => void;
}

export const NpmPkgInfo: FC<NpmPkgInfoProps> = (props) => {
    const { name, onVersionChange } = props;
    const packument = usePackument(name);
    const versions = Object.keys(packument.data?.versions || {});
    const version = props.version || sortSemver(versions)[0];
    return (
        <Stack gap={3}>
            <Flex align={'center'}>
                <Text mr={8} fw={500}>
                    {name}
                </Text>
                <NpmPkgTags name={name} version={version} />
            </Flex>
            <Flex align={'center'} gap={8}>
                <NativeSelect
                    data={versions}
                    value={version}
                    w={120}
                    variant='unstyled'
                    onChange={(e) => {
                        onVersionChange?.(e.target.value);
                    }}
                    color='black'
                    size='sm'
                />
                <Text size='sm' c={'gray'}>
                    Published {dayjs(packument.data?.time.modified).fromNow()}
                </Text>
            </Flex>
        </Stack>
    );
};
