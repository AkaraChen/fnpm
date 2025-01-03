import { IconButton } from '@/app/packages/[nameOrScope]/tabs/component';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { processor } from '@/lib/markdown';
import { fetchFromJsdelivr } from '@/lib/request';
import type { schema } from '@akrc/npm-registry-client';
import hostedGitInfo from 'hosted-git-info';
import { LucideBug, LucideGitBranch, LucideLink } from 'lucide-react';
import type { FC } from 'react';

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
            className={
                'prose prose-sm max-w-none prose-code:text-sm prose-a:text-blue-500 hover:prose-a:underline prose-pre:p-4 prose-code:before:hidden prose-code:after:hidden'
            }
            // biome-ignore lint: it's ok
            dangerouslySetInnerHTML={{
                __html: rendered.toString(),
            }}
        />
    );
};

export interface ManifestProps {
    metadata: schema['PackageMetadata'];
    version: string | null;
}

export const Manifest: FC<ManifestProps> = (props) => {
    const { metadata, version } = props;
    return (
        <div className={'space-y-4'}>
            <Card title={'Manifest'} className={'space-y-3'}>
                <p className={'text-sm'}>{metadata!.description}</p>
                <div className={'flex gap-2'}>
                    {metadata.keywords?.map((keyword) => (
                        <Badge key={keyword} variant={'outline'}>
                            {keyword}
                        </Badge>
                    ))}
                </div>
                <div className={'flex gap-2'}>
                    {metadata.repository && (
                        <IconButton
                            icon={LucideGitBranch}
                            link={hostedGitInfo
                                .fromUrl(metadata.repository.url)
                                ?.browse()}
                        />
                    )}
                    {metadata.homepage && (
                        <IconButton
                            icon={LucideLink}
                            link={metadata.homepage}
                        />
                    )}
                    {metadata.bugs && (
                        <IconButton icon={LucideBug} link={metadata.bugs.url} />
                    )}
                </div>
            </Card>
            <Card title={'README.md'}>
                <Readme name={metadata.name} version={version} />
            </Card>
        </div>
    );
};
