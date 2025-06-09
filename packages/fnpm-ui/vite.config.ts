import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        remix({
            future: {
                v3_fetcherPersist: true,
            },
        }),
        tsconfigPaths(),
    ],
    build: {
        target: 'esnext',
        minify: isProduction,
    },
    ssr: {
        noExternal: isProduction || undefined,
    },
});
