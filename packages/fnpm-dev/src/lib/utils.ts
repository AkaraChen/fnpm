import { type ClassValue, clsx } from 'clsx';
import type { FetchResponse } from 'openapi-fetch';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function wrapFetch<
    METHOD extends Record<string | number, any>,
    INIT,
    MEDIA extends `${string}/${string}`,
>(promise: Promise<FetchResponse<METHOD, INIT, MEDIA>>) {
    const res = await promise;
    if (res.error) {
        throw res.error;
    }
    return res.data!;
}

export const detectLangByFilename = (filename: string) => {
    const ext = filename.split('.').pop();
    switch (ext) {
        case 'ts':
            return 'typescript';
        case 'tsx':
            return 'typescript';
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'javascript';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'css':
            return 'css';
        case 'html':
            return 'html';
        default:
            return 'plaintext';
    }
};

export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
