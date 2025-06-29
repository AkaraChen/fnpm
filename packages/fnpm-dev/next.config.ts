import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    serverExternalPackages: ['vscode-oniguruma', 'rehype-starry-night"'],
    outputFileTracingIncludes: {
        '**': ['./node_modules/vscode-oniguruma/**'],
    },
};

export default nextConfig;
