import { Flex, Stack, Text } from '@mantine/core';
import { IconMoodSmile, type TablerIcon } from '@tabler/icons-react';
import type { FC, PropsWithChildren } from 'react';

interface ResultProps extends PropsWithChildren {
    icon: TablerIcon;
}

const Result: FC<ResultProps> = (props) => {
    const { icon: Icon, children } = props;
    return (
        <Flex w={'100%'} h={'100%'} align='center'>
            <Stack align='center' w={'100%'}>
                <Icon size={120} color='#555' />
                <Text c={'dark'} size='lg' fw={500}>
                    {children}
                </Text>
            </Stack>
        </Flex>
    );
};

export const AllClear: FC = () => {
    return <Result icon={IconMoodSmile}>All Clear</Result>;
};
