import { Button, Card, Grid, Group, Text } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { PageHeader } from '~/components/page-header';

export const meta: MetaFunction = () => {
    return [{ title: 'fnpm UI' }];
};

export default function Index() {
    return (
        <>
            <PageHeader title="Dashboard" />
            <Grid>
                <Grid.Col span={3}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>Norway Fjord Adventures</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            With Fjord Tours you can explore more of the magical
                            fjord landscapes with tours and activities on and
                            around the fjords of Norway
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            See more
                        </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>Norway Fjord Adventures</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            With Fjord Tours you can explore more of the magical
                            fjord landscapes with tours and activities on and
                            around the fjords of Norway
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            See more
                        </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>Norway Fjord Adventures</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            With Fjord Tours you can explore more of the magical
                            fjord landscapes with tours and activities on and
                            around the fjords of Norway
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            See more
                        </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                       <Group justify="space-between" mb="xs">
                            <Text fw={500}>Norway Fjord Adventures</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            With Fjord Tours you can explore more of the magical
                            fjord landscapes with tours and activities on and
                            around the fjords of Norway
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            See more
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
}
