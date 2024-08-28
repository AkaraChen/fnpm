import { Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import '@fontsource/space-mono';
import AnsiConv from 'ansi-to-html';
import santize from 'sanitize-html';

const conv = new AnsiConv();

export interface RunOptions {
    command?: string;
    cwd?: string;
}

export interface RunProps extends RunOptions {
    onSuccess?: () => void;
}

export const useRun = (props: RunProps) => {
    const { onSuccess, ...rest } = props;
    const [logs, setLogs] = useState<string[]>([]);
    const run = useMutation({
        async mutationFn(opts: RunOptions) {
            const { command, cwd } = opts;
            if (!command || !cwd) {
                throw new Error('command and cwd are required');
            }
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
    const start = (options?: RunOptions) => {
        open();
        run.mutate({
            ...rest,
            ...options,
        });
    };
    const onClose = () => {
        close();
        setLogs([]);
        run.reset();
        onSuccess?.();
    };
    const [opened, { open, close }] = useDisclosure(false);
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
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
                <ScrollArea>
                    <Stack bg={'#000'} p={20} ff={'Space Mono'} gap={4}>
                        {logs.map((log) => (
                            <Text
                                key={Math.random()}
                                c={'white'}
                                // biome-ignore lint/security/noDangerouslySetInnerHtml: santized, so is ok.
                                dangerouslySetInnerHTML={{
                                    __html: santize(conv.toHtml(log), {
                                        allowedTags: [
                                            'span',
                                            'b',
                                            'i',
                                            'u',
                                            'br',
                                            'strike',
                                        ],
                                        allowedAttributes: { span: ['style'] },
                                    }),
                                }}
                                maw={'calc(768px - 40px)'}
                            />
                        ))}
                        <div ref={endRef} />
                    </Stack>
                </ScrollArea>
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
