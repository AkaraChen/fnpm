import { Box, Button, Flex, Modal, NativeSelect, Stack } from '@mantine/core';
import { devDepsMatchers } from 'fnpm-toolkit';
import { parse } from 'parse-package-name';
import { type FC, useMemo, useState } from 'react';
import { NpmPkgInfo } from './npm-pkg-info';

export interface InstallConfirmItem {
    name: string;
    version?: string;
}

interface InstallConfirmItemWithField extends InstallConfirmItem {
    field: InstallConfirmField;
}

export interface InstallConfirmData {
    dev: InstallConfirmItem[];
    prod: InstallConfirmItem[];
    peer: InstallConfirmItem[];
    optional: InstallConfirmItem[];
}

export type InstallConfirmField = keyof InstallConfirmData;

export interface InstallConfirmProps {
    packages: string[];
    onConfirm: (data: InstallConfirmData) => void;
    opened: boolean;
    onOpenChange: (opened: boolean) => void;
}

export const InstallConfirm: FC<InstallConfirmProps> = (props) => {
    const { packages, onConfirm, opened, onOpenChange } = props;
    const [data, setData] = useState<InstallConfirmData>(() => {
        return {
            dev: [],
            prod: packages.map((pkg) => {
                const { name, version } = parse(pkg);
                return { name, version };
            }),
            peer: [],
            optional: [],
        };
    });
    const all: Array<InstallConfirmItemWithField> = useMemo(() => {
        const prod = data.prod.map((pkg) => {
            return { ...pkg, field: 'prod' as const };
        });
        const dev = data.dev.map((pkg) => {
            return { ...pkg, field: 'dev' as const };
        });
        const peer = data.peer.map((pkg) => {
            return { ...pkg, field: 'peer' as const };
        });
        const optional = data.optional.map((pkg) => {
            return { ...pkg, field: 'optional' as const };
        });
        return [...prod, ...dev, ...peer, ...optional];
    }, [data]);
    return (
        <Modal
            opened={opened}
            onClose={() => onOpenChange(false)}
            title='Install packages'
            size={'lg'}
        >
            <Stack my={12}>
                {all.map((pkg) => (
                    <Flex key={pkg.name} align={'center'}>
                        <NpmPkgInfo
                            name={pkg.name}
                            version={pkg.version}
                            onVersionChange={(v) => {
                                setData((data) => {
                                    return {
                                        ...data,
                                        [pkg.field]: data[pkg.field].map(
                                            (item) => {
                                                if (item.name === pkg.name) {
                                                    return {
                                                        ...item,
                                                        version: v,
                                                    };
                                                }
                                                return item;
                                            },
                                        ),
                                    };
                                });
                            }}
                        />
                        <Flex ml={'auto'} gap={8}>
                            <NativeSelect
                                data={['prod', 'dev', 'peer', 'optional']}
                                value={pkg.field}
                                onChange={(e) => {
                                    const field = e.target
                                        .value as InstallConfirmField;
                                    setData((data) => {
                                        return {
                                            ...data,
                                            [field]: [...data[field], pkg],
                                        };
                                    });
                                }}
                            />
                        </Flex>
                    </Flex>
                ))}
            </Stack>
            <Box style={{ textAlign: 'right' }}>
                <Button
                    mt={12}
                    onClick={() => {
                        onConfirm(data);
                        onOpenChange(false);
                    }}
                >
                    Confirm
                </Button>
            </Box>
        </Modal>
    );
};
