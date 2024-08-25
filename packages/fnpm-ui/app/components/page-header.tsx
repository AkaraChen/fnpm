import { Box, Flex, Title } from '@mantine/core';
import type { ComponentProps, FC, ReactNode } from 'react';

export interface PageHeaderProps extends ComponentProps<typeof Flex> {
    title: string;
    extra?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = (props) => {
    const { title, extra, ...rest } = props;
    return (
        <Flex {...rest} w={'100%'} align={'center'} display={'flex'} mb={20}>
            <Title size={'h3'} fw={600}>
                {title}
            </Title>
            {extra && <Box ml={16} >{extra}</Box>}
        </Flex>
    );
};
