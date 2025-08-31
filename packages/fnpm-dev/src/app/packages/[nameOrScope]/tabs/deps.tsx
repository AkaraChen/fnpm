import type { schema } from '@akrc/npm-registry-client';
import { npmjs } from '@akrc/npm-registry-client';
import type { FC } from 'react';
import { Card } from '@/components/card';
import { Link } from '@/components/link';

type DependencyProps = {
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
    const depsMap = {
        dependencies: pkg.dependencies ?? {},
        devDependencies: pkg.devDependencies ?? {},
    };
    return (
        <div className={'space-y-4'}>
            <Card title={'Dependencies'}>
                <div className='flex flex-wrap gap-2'>
                    {Object.keys(depsMap.dependencies).length > 0 ? (
                        Object.keys(depsMap.dependencies).map((dep) => (
                            <Link
                                key={dep}
                                href={`/packages/${dep}`}
                                target='_blank'
                            >
                                {dep}
                            </Link>
                        ))
                    ) : (
                        <p className={'text-sm'}>No dependencies.</p>
                    )}
                </div>
            </Card>
            <Card title={'Dev Dependencies'}>
                <div className='flex flex-wrap gap-2'>
                    {Object.keys(depsMap.devDependencies).length > 0 ? (
                        Object.keys(depsMap.devDependencies).map((dep) => (
                            <Link
                                key={dep}
                                href={`/packages/${dep}`}
                                target='_blank'
                            >
                                {dep}
                            </Link>
                        ))
                    ) : (
                        <p className={'text-sm'}>No dev dependencies.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
