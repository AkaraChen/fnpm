import {
    Badge,
    Button,
    Flex,
    NativeSelect,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { IconCircleCheck, IconCircleDashedCheck } from '@tabler/icons-react';
import type { Diagnose, DiagnoseLevel } from 'fnpm-doctor';
import { group } from 'radash';
import type { FC } from 'react';
import { type MetaFunction, useLoaderData } from 'react-router';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { ResultPage } from '~/components/result';
import { useQueryParams } from '~/hooks/qps';
import { transformAnsi } from '~/lib/term';
import { root } from '~/server/config.server';
import { scan } from '~/server/fnpm.server';

export async function loader() {
    return await scan(root).then((result) => result.diagnoses);
}

export const meta: MetaFunction = () => {
    return [{ title: 'Diagnose', description: 'Diagnose your system' }];
};

const levelMap: Record<DiagnoseLevel, number> = {
    info: 0,
    warning: 1,
    error: 2,
};

interface DiagnoseProps {
    level: DiagnoseLevel;
    diagnoses: Array<Diagnose>;
}

const DiagnoseGroup: FC<DiagnoseProps> = (props) => {
    const { diagnoses, level } = props;
    return (
        <Stack>
            <Text size='lg' fw={500}>
                {level}
            </Text>
            <SimpleGrid cols={3}>
                {diagnoses.map((diagnose) => (
                    <DiagnoseCard {...diagnose} key={Math.random()} />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

const DiagnoseCard: FC<Diagnose> = (props) => {
    const { title, scope, description, docs, workspace } = props;
    const theme = useMantineTheme();
    return (
        <Paper p={12} withBorder>
            <Stack gap={12}>
                <Text fw={500}>{title}</Text>
                <Flex>
                    <Text
                        size='sm'
                        display={'flex'}
                        style={{ alignItems: 'center' }}
                    >
                        <Badge fw={500} variant='light' component='span'>
                            {scope}
                        </Badge>
                        <Text span ml={8} c={'gray'}>
                            {workspace?.join(', ')}
                        </Text>
                    </Text>
                </Flex>
                <Text
                    c={theme.colors.gray[6]}
                    size='sm'
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                        __html: transformAnsi(description),
                    }}
                />
                {docs && (
                    <Flex gap={12}>
                        {docs && (
                            <Button
                                onClick={() => {
                                    window.open(docs);
                                }}
                                size='xs'
                            >
                                See docs
                            </Button>
                        )}
                    </Flex>
                )}
            </Stack>
        </Paper>
    );
};

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const [level, setLevel] = useQueryParams<DiagnoseLevel>('level', 'warning');
    const grouped = group(data, (d) => d.level);
    const filtered = Object.entries(grouped).filter(
        ([currentLevel, diagnoses]) =>
            diagnoses.length &&
            levelMap[currentLevel as DiagnoseLevel] >= levelMap[level],
    );
    const theme = useMantineTheme();
    return (
        <BasePage>
            <PageHeader title='Diagnose' />
            <Stack w={'100%'} h={'100%'} style={{ overflow: 'hidden' }}>
                <NativeSelect
                    label='level'
                    w={120}
                    data={['error', 'warning', 'info'] as DiagnoseLevel[]}
                    value={level}
                    onChange={(e) => {
                        setLevel(e.target.value as DiagnoseLevel);
                    }}
                />
                {filtered.length ? (
                    <ScrollArea
                        h={'100%'}
                        styles={{
                            viewport: {
                                height: '100%',
                            },
                        }}
                    >
                        <Stack>
                            {filtered.map(([currentLevel, diagnoses]) => {
                                const show =
                                    diagnoses.length &&
                                    levelMap[currentLevel as DiagnoseLevel] >=
                                        levelMap[level];
                                return (
                                    show && (
                                        <DiagnoseGroup
                                            key={currentLevel}
                                            level={
                                                currentLevel as DiagnoseLevel
                                            }
                                            diagnoses={diagnoses as Diagnose[]}
                                        />
                                    )
                                );
                            })}
                        </Stack>
                    </ScrollArea>
                ) : (
                    <ResultPage
                        icon={
                            data.length > 0
                                ? IconCircleDashedCheck
                                : IconCircleCheck
                        }
                        title={
                            data.length > 0
                                ? 'Issues Found at higher level'
                                : 'No Issues Found'
                        }
                        iconColor={
                            data.length > 0
                                ? theme.colors.blue[6]
                                : theme.colors.green[6]
                        }
                    >
                        {data.length > 0
                            ? 'You have some problems detected on higher level. Please set the level on the top to see them.'
                            : 'Congratulations! Your system is running smoothly without any detected problems.'}
                    </ResultPage>
                )}
            </Stack>
        </BasePage>
    );
}
