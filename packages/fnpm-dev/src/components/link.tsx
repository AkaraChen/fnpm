import NextLink from 'next/link';
import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';

interface LinkProps extends ComponentProps<'a'> {
    href: string;
}

export const Link: FC<LinkProps> = (props) => {
    const { href, className, ...rest } = props;
    return (
        <NextLink
            href={href}
            className={cn('underline text-primary', className)}
            {...rest}
        />
    );
};
