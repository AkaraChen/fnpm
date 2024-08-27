import { Text, Stack } from '@mantine/core';
import { IconMoodSmile, type TablerIcon } from '@tabler/icons-react';
import type { FC, PropsWithChildren } from 'react';

export interface ResultProps extends PropsWithChildren {
    icon: TablerIcon;
}

export const Result: FC<ResultProps> = (props) => {
    const { icon: Icon, children } = props;
    return (
        <Stack w={'100%'} h={'100%'} p={80} align='center' justify='space-around'>
            <Icon size={120} color='#555' />
            <Text c={'dark'} size='lg' fw={500}>{children}</Text>
        </Stack>
    );
};

export const AllClear: FC = () => {
    return <Result icon={IconMoodSmile}>All Clear</Result>;
};
