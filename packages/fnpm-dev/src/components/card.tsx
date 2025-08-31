import type { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<ComponentProps<'div'>, 'title'> {
    title?: ReactNode;
}

export const Card: FC<CardProps> = (props) => {
    const { className, children, title, ...rest } = props;
    return (
        <div
            className={cn(
                'p-4 bg-background rounded border border-zinc-200',
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
