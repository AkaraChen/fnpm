import { Flex } from '@mantine/core';
import type { FC, PropsWithChildren } from 'react';

export const BasePage: FC<PropsWithChildren> = (props) => {
    return (
        <Flex direction={'column'} h={'100%'}>
            {props.children}
        </Flex>
    );
};
