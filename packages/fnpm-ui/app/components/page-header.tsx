import { Title } from '@mantine/core';
import type { ComponentProps, FC, ReactNode } from 'react';

export interface PageHeaderProps extends ComponentProps<'header'> {
    title: string;
    extra?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = (props) => {
    const { title, extra, ...rest } = props;
    return (
        <header {...rest} className='w-full flex items-center'>
            <Title size={'h3'} fw={600}>
                {title}
            </Title>
            {extra && <div className='ml-4'>{extra}</div>}
        </header>
    );
};
