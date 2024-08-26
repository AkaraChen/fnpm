import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import '@mantine/core/styles.css';
import {
    Box,
    ColorSchemeScript,
    Flex,
    MantineProvider,
    createTheme,
} from '@mantine/core';
import { Navbar } from './components/navbar/navbar';
import '@fontsource-variable/inter';

const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
});

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
                    <Flex style={{ overflowY: 'hidden' }}>
                        <Box w={'300px'}>
                            <Navbar />
                        </Box>
                        <Box w={'100%'} h={'100vh'} p={16}>
                            {children}
                        </Box>
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
