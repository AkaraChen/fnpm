import { CodeClient } from '@/app/packages/[nameOrScope]/tabs/code.client';
import { type Folder, tarToTree } from '@/lib/tar';
import type { schema } from '@akrc/npm-registry-client';
import type { FC } from 'react';

export type CodeProps = {
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
    return <CodeClient tree={sourceTree.nodes} />;
};
