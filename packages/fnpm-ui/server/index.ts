import { serve } from '@hono/node-server';
import consola from 'consola';
import { getPort } from 'get-port-please';
import { Hono } from 'hono';

const port = await getPort();
const app = new Hono();

serve({
    fetch: app.fetch,
    port,
});
consola.success(`Server running at http://localhost:${port}`);
