import { cn } from '@/lib/utils';
import NextLink from 'next/link';
import type { ComponentProps, FC } from 'react';

export interface LinkProps extends ComponentProps<'a'> {
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
