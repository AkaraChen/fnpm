import {
    Checkbox,
    Flex,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
} from '@mantine/core';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { LoaderData as NpmSearchResp } from '~/routes/npm-search';

export interface NpmSearchProps {
    search: string;
    toggles: string[];
    onToggle: (name: string, checked: boolean) => void;
}

export const NpmSearch: FC<NpmSearchProps> = (props) => {
    const { search, onToggle } = props;
    const { ref, inView } = useInView();
    const query = useSuspenseInfiniteQuery({
        queryKey: ['searchPackages', search],
        initialPageParam: 0,
        queryFn: async (opts) => {
            const url = new URL('/npm-search', window.location.origin);
            url.searchParams.set('query', search);
            url.searchParams.set('page', opts.pageParam.toString());

            return (await fetch(url).then((res) =>
                res.json(),
            )) as NpmSearchResp;
        },
        getNextPageParam: (_, __, lastPageParams) => {
            return lastPageParams + 1;
        },
    });
    useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView, query.fetchNextPage]);
    return (
        <ScrollArea
            h={'100%'}
            styles={{
                viewport: { height: '100%' },
            }}
        >
            <SimpleGrid cols={3}>
                {query.data.pages.map((page) => {
                    return page.objects.map((pkg) => {
                        const checked = props.toggles.includes(
                            pkg.package.name,
                        );
                        return (
                            <Paper key={pkg.package.name} withBorder p={12}>
                                <Flex align={'center'}>
                                    <Stack>
                                        <Text size='sm' fw={500}>
                                            {pkg.package.name}
                                            <Text
                                                span
                                                c={'gray'}
                                                size='xs'
                                                ml={4}
                                            >
                                                {pkg.package.version}
                                            </Text>
                                        </Text>
                                        <Text
                                            size='xs'
                                            c={'gray'}
                                            lineClamp={1}
                                        >
                                            {pkg.package.description}
                                        </Text>
                                    </Stack>
                                    <Checkbox
                                        ml={'auto'}
                                        checked={checked}
                                        onChange={(e) => {
                                            onToggle(
                                                pkg.package.name,
                                                e.target.checked,
                                            );
                                        }}
                                    />
                                </Flex>
                            </Paper>
                        );
                    });
                })}
                <div ref={ref} />
            </SimpleGrid>
        </ScrollArea>
    );
};
