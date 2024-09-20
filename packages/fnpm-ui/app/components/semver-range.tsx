import { Badge, Text } from '@mantine/core';
import { concatNpmUrl } from 'fnpm-toolkit';
import type { FC } from 'react';

interface SemverRangeProps {
    name: string;
    current: string;
    to: string;
}

export const SemverRange: FC<SemverRangeProps> = (props) => {
    const { name, current, to } = props;
    return (
        <Badge variant='light'>
            <Text
                span
                size='xs'
                component={'a'}
                href={concatNpmUrl(name, current)}
                target='_blank'
            >
                {current}
            </Text>
            {' > '}
            <Text
                span
                size='xs'
                component='a'
                href={concatNpmUrl(name, to)}
                target='_blank'
            >
                {to}
            </Text>
        </Badge>
    );
};
