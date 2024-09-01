import { Button, Flex, Modal, NativeSelect, Stack, Text } from '@mantine/core';
import { devDepsMatchers } from 'fnpm-toolkit';
import { parse } from 'parse-package-name';
import { type FC, useState } from 'react';
import { NpmPkgInfo } from './npm-pkg-info';
import { NpmPkgTags } from './npm-pkg-tags';
import { VersionSelector } from './version-selector';

export interface InstallConfirmData {
    packages: Array<{
        name: string;
        version?: string;
        field: 'dev' | 'prod' | 'peer' | 'optional';
    }>;
}

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
            packages: packages.map((name) => {
                const parsed = parse(name);
                const matchDev = devDepsMatchers.some((matcher) =>
                    matcher.test(parsed.name),
                );
                return {
                    name,
                    field: matchDev ? 'dev' : 'prod',
                };
            }),
        };
    });
    return (
        <Modal
            opened={opened}
            onClose={() => onOpenChange(false)}
            title='Install packages'
            size={'lg'}
        >
            <Stack my={12}>
                {data.packages.map((pkg) => (
                    <Flex key={pkg.name} align={'center'}>
                        <NpmPkgInfo
                            name={pkg.name}
                            version={pkg.version}
                            onVersionChange={(v) => {
                                setData((data) => {
                                    return {
                                        packages: data.packages.map((p) => {
                                            if (p.name === pkg.name) {
                                                return {
                                                    ...p,
                                                    version: v,
                                                };
                                            }
                                            return p;
                                        }),
                                    };
                                });
                            }}
                        />
                        <Flex ml={'auto'} gap={8}>
                            {/* <VersionSelector
                                name={pkg.name}
                                version={pkg.version}
                                onChange={() => {
                                    setData((data) => {
                                        return {
                                            packages: data.packages.map((p) => {
                                                if (p.name === pkg.name) {
                                                    return {
                                                        ...p,
                                                        version: pkg.version,
                                                    };
                                                }
                                                return p;
                                            }),
                                        };
                                    });
                                }}
                            /> */}
                            <NativeSelect
                                data={['prod', 'dev', 'peer', 'optional']}
                                value={pkg.field}
                                onChange={(e) => {
                                    setData({
                                        packages: data.packages.map((p) => {
                                            if (p.name === pkg.name) {
                                                return {
                                                    ...p,
                                                    field: e.target
                                                        .value as any,
                                                };
                                            }
                                            return p;
                                        }),
                                    });
                                }}
                            />
                        </Flex>
                    </Flex>
                ))}
            </Stack>
            <Button
                mt={12}
                onClick={() => {
                    onConfirm(data);
                    onOpenChange(false);
                }}
            >
                Confirm
            </Button>
        </Modal>
    );
};
