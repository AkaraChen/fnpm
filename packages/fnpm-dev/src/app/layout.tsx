import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/app/providers';
import { cn } from '@/lib/utils';
import localFont from 'next/font/local';

export const metadata: Metadata = {
    title: 'fnpm.dev',
    description: 'A better npmjs.com.',
};

const geistVF = localFont({
    src: './fonts/GeistVF.woff',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={cn(geistVF.className)}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
