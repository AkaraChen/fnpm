import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';

interface IconButtonProps {
    icon: LucideIcon;
    link?: string;
}

export const IconButton: FC<IconButtonProps> = (props) => {
    const { icon: Icon, link } = props;
    return (
        <a href={link} target={'_blank'} rel='noreferrer'>
            <Icon size={16} className={'text-zinc-500 cursor-pointer'} />
        </a>
    );
};
