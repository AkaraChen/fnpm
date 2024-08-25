import { Code, Group } from '@mantine/core';
import { NavLink } from '@remix-run/react';
import { IconDashboard, IconMap, IconPackage } from '@tabler/icons-react';
import pkg from 'package.json';
import classes from './navbar.module.css';

const data = [
    { link: '/', label: 'Dashboard', icon: IconDashboard },
    { link: '/graph', label: 'Graph', icon: IconMap },
    { link: '/packages', label: 'Package', icon: IconPackage },
];

export function Navbar() {
    const links = data.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink className={classes.link} to={item.link} key={item.label}>
                <Icon className={classes.linkIcon} stroke={1.5} />
                <span>{item.label}</span>
            </NavLink>
        );
    });

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify='space-between'>
                    <div className='text-lg font-semibold'>fnpm UI</div>
                    <Code>{pkg.version}</Code>
                </Group>
                <div className={classes.links}>{links}</div>
            </div>
        </nav>
    );
}
