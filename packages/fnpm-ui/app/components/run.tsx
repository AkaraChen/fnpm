import { Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import '@fontsource/space-mono';

export interface RunOptions {
    command: string;
    cwd: string;
    onSuccess?: () => void;
}

export const useRun = (props: RunOptions) => {
    const { command, cwd, onSuccess } = props;
    const [logs, setLogs] = useState<string[]>([]);
    const run = useMutation({
        async mutationFn() {
            return await fetchEventSource('/run', {
                openWhenHidden: true,
                method: 'POST',
                onerror(err) {
                    console.error(err);
                },
                onmessage(ev) {
                    setLogs((prev) => [...prev, ev.data]);
                },
                body: JSON.stringify({
                    command,
                    cwd,
                }),
            });
        },
    });
    const start = () => {
        open();
        run.mutate();
    };
    const onClose = () => {
        close();
        setLogs([]);
        run.reset();
        onSuccess?.();
    };
    const [opened, { open, close }] = useDisclosure(false);
    const holder = (
        <Modal
            opened={opened}
            onClose={onClose}
            size={'800px'}
            title='Run result'
            scrollAreaComponent={ScrollArea.Autosize}
            aria-modal
        >
            <Paper radius={4} style={{ overflow: 'hidden' }}>
                <Stack bg={'#000'} p={20} ff={'Space Mono'} gap={4}>
                    {logs.map((log) => (
                        <Text key={Math.random()} c={'white'}>
                            {log}
                        </Text>
                    ))}
                </Stack>
            </Paper>
        </Modal>
    );
    return {
        opened,
        open,
        close,
        holder,
        start,
    };
};
