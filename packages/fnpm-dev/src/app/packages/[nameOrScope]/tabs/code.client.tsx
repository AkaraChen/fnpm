'use client';

import type { FC } from 'react';
import { FileTree } from '@/components/tree';
import type { Node } from '@/lib/tar';

interface CodeClientProps {
    tree: Node[];
    className?: string;
}

export const CodeClient: FC<CodeClientProps> = (props) => {
    const { tree, className } = props;
    return <FileTree fileTree={tree} className={className} />;
};
