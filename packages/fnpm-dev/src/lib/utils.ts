import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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
