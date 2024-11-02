'use client';

import { FileTree } from '@/components/tree';
import type { Node } from '@/lib/tar';
import type { FC } from 'react';

export interface CodeClientProps {
    tree: Node[];
}

export const CodeClient: FC<CodeClientProps> = (props) => {
    const { tree } = props;
    return <FileTree fileTree={tree} />;
};
