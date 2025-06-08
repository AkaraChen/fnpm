import { IconButton } from '@/app/packages/[nameOrScope]/tabs/component';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { processor } from '@/lib/markdown';
import { fetchFromJsdelivr } from '@/lib/request';
import type { schema } from '@akrc/npm-registry-client';
import hostedGitInfo from 'hosted-git-info';
import type { FC } from 'react';
import 'github-markdown-css/github-markdown.css';
import IconBug from '@tabler/icons-react/dist/esm/icons/IconBug';
import IconExternalLink from '@tabler/icons-react/dist/esm/icons/IconExternalLink';
import IconGitBranch from '@tabler/icons-react/dist/esm/icons/IconGitBranch';
import { CopyCommand } from './manifest.client';

interface ReadmeProps {
    name: string;
    version: string | null;
}

const Readme: FC<ReadmeProps> = async (props) => {
    const { name, version } = props;
    const content = await fetchFromJsdelivr({
        name,
        version,
        path: 'README.md',
    }).then((res) => res.text());
    const rendered = await processor.process(content);
    return (
        <article
            className={'markdown-body !text-[15px]'}
            // biome-ignore lint: it's ok
            dangerouslySetInnerHTML={{
                __html: rendered.toString(),
            }}
        />
    );
};

interface ManifestProps {
    metadata: schema['PackageMetadata'];
    version: string | null;
}

export const Manifest: FC<ManifestProps> = (props) => {
    const { metadata, version } = props;
    return (
        <div className={'space-y-4'}>
            <Card title={'Manifest'} className={'space-y-3'}>
                <p className={'text-sm'}>{metadata!.description}</p>
                <div className={'flex gap-2 flex-wrap'}>
                    {metadata.keywords?.map((keyword) => (
                        <Badge key={keyword} variant={'outline'}>
                            {keyword}
                        </Badge>
                    ))}
                </div>
                <CopyCommand name={metadata.name} />
                <div className={'flex gap-2'}>
                    {metadata.repository && (
                        <IconButton
                            icon={IconGitBranch}
                            link={hostedGitInfo
                                .fromUrl(metadata.repository.url)
                                ?.browse()}
                        />
                    )}
                    {metadata.homepage && (
                        <IconButton
                            icon={IconExternalLink}
                            link={metadata.homepage}
                        />
                    )}
                    {metadata.bugs && (
                        <IconButton icon={IconBug} link={metadata.bugs.url} />
                    )}
                </div>
            </Card>
            <Card title={'README.md'}>
                <Readme name={metadata.name} version={version} />
            </Card>
        </div>
    );
};
