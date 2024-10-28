import {
    Anchor,
    Badge,
    Checkbox,
    Flex,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core';
import {
    IconLoader,
    IconMoodSmile,
    IconPackageOff,
    IconX,
} from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { concatNpmUrl } from 'fnpm-toolkit';
import type { FC } from 'react';
import { useInView } from 'react-intersection-observer';
import type { LoaderData as NpmSearchResp } from '~/routes/npm-search';
import { ResultPage } from './result';

interface NpmSearchItemProps {
    name: string;
    version: string;
    description?: string;
    onToggle: (checked: boolean) => void;
    checked: boolean;
}

const NpmSearchItem: FC<NpmSearchItemProps> = (props) => {
    const { name, version, description, onToggle, checked } = props;
    return (
        <Paper withBorder p={12}>
            <Flex align={'center'}>
                <Stack w={'100%'}>
                    <Text size='sm' fw={500}>
                        <Anchor
                            href={concatNpmUrl(name)}
                            underline='hover'
                            c={'dark'}
                            target='_blank'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {name}
                        </Anchor>
                        <Text span c={'gray'} size='xs' ml={4}>
                            {version}
                        </Text>
                    </Text>
                    <Text size='xs' c={'gray'} lineClamp={1}>
                        {description}
                    </Text>
                </Stack>
                <Checkbox
                    ml={'auto'}
                    checked={checked}
                    onChange={(e) => {
                        onToggle(e.target.checked);
                    }}
                />
            </Flex>
        </Paper>
    );
};

interface NpmSearchProps {
    search: string;
    toggles: string[];
    onToggle: (name: string, checked: boolean) => void;
}

export const NpmSearch: FC<NpmSearchProps> = (props) => {
    const { search, onToggle, toggles } = props;
    const query = useInfiniteQuery({
        queryKey: ['searchPackages', search],
        initialPageParam: 0,
        queryFn: async (opts) => {
            const url = new URL('/npm-search', window.location.origin);
            url.searchParams.set('query', search);
            url.searchParams.set('page', opts.pageParam.toString());

            return (await fetch(url, {
                signal: opts.signal,
            }).then((res) => res.json())) as NpmSearchResp;
        },
        getNextPageParam: (_, __, lastPageParams) => {
            return lastPageParams + 1;
        },
        enabled: Boolean(search),
    });
    const { ref } = useInView({
        onChange(inView) {
            if (inView) {
                query.fetchNextPage();
            }
        },
    });
    const list = query.data?.pages.flatMap((page) => page.objects) ?? [];
    const theme = useMantineTheme();
    return (
        <Stack h={'100%'} style={{ overflow: 'hidden' }}>
            {Boolean(toggles.length) && (
                <Flex gap={8}>
                    {toggles.map((toggle) => (
                        <Badge
                            key={toggle}
                            color='blue'
                            rightSection={
                                <IconX
                                    onClick={() => {
                                        onToggle(toggle, false);
                                    }}
                                    size={14}
                                />
                            }
                            size='lg'
                        >
                            {toggle}
                        </Badge>
                    ))}
                </Flex>
            )}
            {list.length ? (
                <ScrollArea>
                    <SimpleGrid cols={3}>
                        {list.map((pkg) => {
                            const checked = props.toggles.includes(
                                pkg.package.name,
                            );
                            return (
                                <NpmSearchItem
                                    key={pkg.package.name}
                                    name={pkg.package.name}
                                    version={pkg.package.version}
                                    description={pkg.package.description}
                                    checked={checked}
                                    onToggle={(checked) => {
                                        onToggle(pkg.package.name, checked);
                                    }}
                                />
                            );
                        })}
                        <div ref={ref} />
                    </SimpleGrid>
                </ScrollArea>
            ) : (
                <ResultPage
                    icon={
                        query.isLoading
                            ? IconLoader
                            : search
                              ? IconPackageOff
                              : IconMoodSmile
                    }
                    iconColor={
                        query.isLoading
                            ? theme.colors.blue[6]
                            : search
                              ? theme.colors.orange[6]
                              : theme.colors.blue[6]
                    }
                    iconStyle={
                        query.isLoading
                            ? { animation: 'spin 1s linear infinite' }
                            : undefined
                    }
                    title={
                        query.isLoading
                            ? 'Loading'
                            : search
                              ? 'No Results'
                              : 'Search for packages'
                    }
                >
                    {query.isLoading
                        ? 'Loading packages...'
                        : search
                          ? 'No packages found with provided search query'
                          : 'Type package [name] in search field to start searching'}
                </ResultPage>
            )}
        </Stack>
    );
};
