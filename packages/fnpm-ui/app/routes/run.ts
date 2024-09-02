import type { ActionFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { x } from 'tinyexec';

export interface RunBody {
    command: string;
    cwd: string;
}

export type RunEventName = 'start' | 'stdout' | 'end';

export async function action(args: ActionFunctionArgs) {
    const body: RunBody = await args.request.json();
    const spilted = body.command.split(' ');
    const exec = x(spilted.at(0)!, spilted.slice(1), {
        signal: args.request.signal,
        nodeOptions: {
            cwd: body.cwd,
            env: {
                NODE_ENV: 'production',
                FORCE_COLOR: 'true',
            },
        },
    });
    return eventStream(args.request.signal, function setup(send) {
        send({
            event: 'start',
            data: `Running command: ${body.command}`,
        });
        async function fn() {
            for await (const chunk of exec) {
                send({
                    event: 'stdout',
                    data: chunk,
                });
            }
            await exec;
            send({
                event: 'end',
                data: `Process finished with code ${exec.exitCode}`,
            });
        }
        fn();
        return () => {
            exec.kill();
        };
    });
}
