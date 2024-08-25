import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import '@mantine/core/styles.css';
import { Box, ColorSchemeScript, Flex, MantineProvider, createTheme } from '@mantine/core';
import { Navbar } from './components/navbar/navbar';

const theme = createTheme({});

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <Meta />
                <Links />
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <Flex>
                        <Box
                            w={'300px'}
                        >
                            <Navbar />
                        </Box>
                        <Box
                            w={'100%'}
                            h={'100%'}
                            p={16}
                        >{children}</Box>
                    </Flex>
                </MantineProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
