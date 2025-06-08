import { cn } from '@/lib/utils';
import type { ComponentProps, FC } from 'react';

interface CardProps extends ComponentProps<'div'> {
    title?: string;
}

export const Card: FC<CardProps> = (props) => {
    const { className, children, title, ...rest } = props;
    return (
        <div
            className={cn(
                'p-4 bg-background rounded-md border border-zinc-200',
                className,
            )}
            {...rest}
        >
            {title && (
                <span className={'opacity-50 text-sm mb-4 flex'}>{title}</span>
            )}
            {children}
        </div>
    );
};
