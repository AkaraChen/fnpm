import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths()],
    build: {
        target: 'esnext',
        minify: isProduction,
    },
    optimizeDeps: {
        include: ['@xyflow/react'],
    },
});
