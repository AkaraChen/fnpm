import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/app/providers';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
    title: 'fnpm.dev',
    description: 'A better npmjs.com.',
};

const inter = Inter({
    weight: ['400', '600'],
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
