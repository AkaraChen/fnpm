import { Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import '@fontsource/space-mono';
import AnsiConv from 'ansi-to-html';
import DOMPurify from 'dompurify';

const conv = new AnsiConv();

export interface RunElement {
    command: string;
    cwd?: string;
}

interface RunOptions {
    cwd?: string;
    queue?: Array<RunElement>;
}

interface RunProps extends RunOptions {
    onSuccess?: () => void;
}

export const useRun = (props: RunProps = {}) => {
    const { onSuccess, ...rest } = props;
    const [logs, setLogs] = useState<string[]>([]);
    const run = useMutation({
        async mutationFn(opts: RunOptions) {
            const { queue, cwd } = opts;
            for (const element of queue!) {
                const abort = new AbortController();
                await fetchEventSource('/run', {
                    openWhenHidden: true,
                    method: 'POST',
                    signal: abort.signal,
                    onerror(err) {
                        console.error(err);
                    },
                    onmessage(ev) {
                        setLogs((prev) => [...prev, ev.data]);
                        if (ev.event === 'end') {
                            abort.abort('end');
                        }
                    },
                    body: JSON.stringify({
                        command: element.command,
                        cwd: element.cwd || cwd,
                    }),
                });
            }
        },
        retry: false,
        onError(error) {
            console.error(error);
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
                                    __html: DOMPurify.sanitize(
                                        conv.toHtml(log),
                                        {
                                            ALLOWED_TAGS: [
                                                'span',
                                                'b',
                                                'i',
                                                'u',
                                                'br',
                                                'strike',
                                            ],
                                            ALLOWED_ATTR: ['style'],
                                        },
                                    ),
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
