import type { ActionFunctionArgs } from '@remix-run/node';
import { execa } from 'execa';
import { eventStream } from 'remix-utils/sse/server';

export interface RunBody {
    command: string;
    cwd: string;
}

export async function action(args: ActionFunctionArgs) {
    const body: RunBody = await args.request.json();
    const exec = execa(body.command, {
        cwd: body.cwd,
        shell: true,
        env: {
            FORCE_COLOR: 'true',
        },
        all: true,
    });
    return eventStream(args.request.signal, function setup(send) {
        async function fn() {
            for await (const chunk of exec) {
                send({
                    event: 'stdout',
                    data: chunk,
                });
            }
        }
        fn();
        return () => {
            exec.kill();
        };
    });
}
