import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export interface ItemProps extends ComponentProps<'div'> {
    title: string;
    description?: string;
    vertical?: boolean;
}

export function Item({
    title,
    description,
    vertical,
    className,
    children,
    ...props
}: ItemProps) {
    return (
        <div
            className={cn('flex text-sm', className, vertical && 'flex-col')}
            {...props}
        >
            <div className='flex flex-col gap-1 mt-6'>
                <h3>{title}</h3>
                {description && (
                    <p className='text-muted-foreground'>{description}</p>
                )}
            </div>
            <div className='ml-auto'>{children}</div>
        </div>
    );
}
