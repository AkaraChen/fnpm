import { Button, Flex, Modal, NativeSelect, Stack, Text } from '@mantine/core';
import { type FC, useState } from 'react';

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
                return {
                    name,
                    field: 'prod',
                };
            }),
        };
    });
    return (
        <Modal
            opened={opened}
            onClose={() => {
                onOpenChange(false);
            }}
            title='Install packages'
        >
            <Stack my={12}>
                {data.packages.map((pkg) => (
                    <Flex key={pkg.name} align={'center'}>
                        <Text>{pkg.name}</Text>
                        <NativeSelect
                            data={['prod', 'dev', 'peer', 'optional']}
                            value={pkg.field}
                            onChange={(e) => {
                                setData({
                                    packages: data.packages.map((p) => {
                                        if (p.name === pkg.name) {
                                            return {
                                                ...p,
                                                field: e.target.value as any,
                                            };
                                        }
                                        return p;
                                    }),
                                });
                            }}
                            ml={'auto'}
                        />
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
