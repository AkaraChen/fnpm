import { Box, Code, Flex, Group, Stack, Text, rem } from '@mantine/core';
import {
    IconDashboard,
    IconDownload,
    IconMap,
    IconPackage,
    IconUpload,
    IconZoomExclamation,
    type TablerIcon,
} from '@tabler/icons-react';
import pkg from 'package.json';
import { NavLink } from 'react-router';
import classes from './navbar.module.css';

interface NavItem {
    link: string;
    label: string;
    icon: TablerIcon;
}

const data: NavItem[] = [
    { link: '/', label: 'Dashboard', icon: IconDashboard },
    { link: '/graph', label: 'Graph', icon: IconMap },
    { link: '/packages', label: 'Shared', icon: IconPackage },
    { link: '/installer', label: 'Installer', icon: IconDownload },
    { link: '/diagnose', label: 'Diagnoses', icon: IconZoomExclamation },
    { link: '/updates', label: 'Updates', icon: IconUpload },
];

export function Navbar() {
    const links = data.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink className={classes.link} to={item.link} key={item.label}>
                <Flex align={'center'} px={'xs'} py={'sm'}>
                    <Icon
                        className={classes.linkIcon}
                        stroke={1.5}
                        style={{
                            width: rem(25),
                            height: rem(25),
                        }}
                    />
                    <Text size='sm' span fw={500} ml={'sm'}>
                        {item.label}
                    </Text>
                </Flex>
            </NavLink>
        );
    });

    return (
        <Stack className={classes.navbar} h={'100vh'} w={rem(300)}>
            <Box flex={1}>
                <Group
                    className={classes.header}
                    justify='space-between'
                    p={'md'}
                >
                    <div className='text-lg font-semibold'>fnpm UI</div>
                    <Code>{pkg.version}</Code>
                </Group>
                <Box p={'md'}>{links}</Box>
            </Box>
        </Stack>
    );
}
