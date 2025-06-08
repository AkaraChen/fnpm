import { Flex, NativeSelect, Skeleton, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { sortSemver } from 'fnpm-toolkit';
import type { FC } from 'react';
import { usePackument } from '~/requests/npm';
import { NpmPkgTags } from './npm-pkg-tags';

interface NpmPkgInfoProps {
    name: string;
    version?: string;
    onVersionChange: (version: string) => void;
}

export const NpmPkgInfo: FC<NpmPkgInfoProps> = (props) => {
    const { name, onVersionChange } = props;
    const packument = usePackument(name);
    const versions = sortSemver(Object.keys(packument.data?.versions || {}));
    const version = props.version || sortSemver(versions)[0];
    if (!version) {
        throw new Error(`No version found for ${name}`);
    }
    return (
        <Stack gap={3}>
            <Flex align={'center'}>
                <Text mr={8} fw={500}>
                    {name}
                </Text>
                <NpmPkgTags name={name} version={version} />
            </Flex>
            <Flex align={'center'} gap={8}>
                {packument.data ? (
                    <>
                        <NativeSelect
                            data={versions}
                            value={version}
                            w={120}
                            variant='unstyled'
                            onChange={(e) => {
                                onVersionChange?.(e.target.value);
                            }}
                            size='sm'
                        />
                        <Text size='sm' c={'gray'}>
                            Published{' '}
                            {dayjs(packument.data?.time.modified).fromNow()}
                        </Text>
                    </>
                ) : (
                    <Skeleton width={280} height={36} />
                )}
            </Flex>
        </Stack>
    );
};
