import { Card } from '@/components/card';
import { Link } from '@/components/link';
import type { schema } from '@akrc/npm-registry-client';
import { npmjs } from '@akrc/npm-registry-client';
import type { FC } from 'react';

export type DependencyProps = {
    name: string;
    metadata: schema['PackageMetadata'];
    version: string;
};

export const Dependency: FC<DependencyProps> = async (props) => {
    const { metadata, version } = props;
    const pkg = await npmjs
        .GET('/{packageName}/{version}', {
            params: {
                path: {
                    packageName: metadata.name,
                    version,
                },
            },
        })
        .then((r) => r.data!);
    return (
        <div className={'space-y-4'}>
            <Card title={'Dependencies'}>
                <div className='flex flex-wrap gap-2'>
                    {Object.keys(pkg.dependencies ?? {}).map((dep) => (
                        <Link
                            key={dep}
                            href={`/packages/${dep}`}
                            target='_blank'
                        >
                            {dep}
                        </Link>
                    ))}
                </div>
            </Card>
            <Card title={'Dev Dependencies'}>
                <div className='flex flex-wrap gap-2'>
                    {Object.keys(pkg.devDependencies ?? {}).map((dep) => (
                        <Link
                            key={dep}
                            href={`/packages/${dep}`}
                            target='_blank'
                        >
                            {dep}
                        </Link>
                    ))}
                </div>
            </Card>
        </div>
    );
};
