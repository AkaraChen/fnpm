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
                <Text c={'#555'} fw={500} size='lg'>
                    {children}
                </Text>
            </Stack>
        </Flex>
    );
};

export const AllClear: FC<PropsWithChildren> = (props) => {
    const children = props.children ?? 'All Clear';
    return <Result icon={IconMoodSmile}>{children}</Result>;
};

export interface ResultPageProps extends PropsWithChildren {
    icon: TablerIcon;
    title: string;
    iconColor: string;
}

export const ResultPage: FC<ResultPageProps> = (props) => {
    const { icon: Icon, title, children, iconColor } = props;
    return (
        <Stack h={'100%'} align={'center'} pt={'20vh'}>
            <Icon size={72} color={iconColor} />
            <Text size={'32px'} fw={900}>
                {title}
            </Text>
            <Text size='xl' c={'gray'} w={'100%'} maw={'600px'} ta={'center'}>
                {children}
            </Text>
        </Stack>
    );
};
