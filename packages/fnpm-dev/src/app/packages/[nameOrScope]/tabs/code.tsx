import { CodeClient } from '@/app/packages/[nameOrScope]/tabs/code.client';
import { Card } from '@/components/card';
import { type Folder, tarToTree } from '@/lib/tar';
import type { schema } from '@akrc/npm-registry-client';
import type { FC } from 'react';

type CodeProps = {
    version: string;
    metadata: schema['PackageMetadata'];
};

export const Code: FC<CodeProps> = async (props) => {
    const { version, metadata } = props;
    const archive = await fetch(metadata.versions[version]!.dist.tarball).then(
        (res) => res.arrayBuffer(),
    );
    const tree = await tarToTree(archive);
    const sourceTree = tree.nodes.at(0) as Folder;
    return (
        <Card
            title={<div className='px-4 pt-4 -pb-4'>code</div>}
            className='p-0'
        >
            <CodeClient tree={sourceTree.nodes} />
        </Card>
    );
};
