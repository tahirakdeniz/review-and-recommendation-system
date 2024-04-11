'use client';
import { useEffect, useState } from 'react';
import { Menu, Avatar, Space } from 'antd';
import Link from 'next/link';
import {usePathname} from "next/navigation";

const defaultAvatar = '/path/to/default/avatar.jpg'; // Path to your default avatar image

// Placeholder user object. In a real app, this might come from global state, context, or props.
const user = {
    name: 'John Doe',
    avatar: '', // User's avatar URL. Leave empty to simulate "not found"
};

const Navbar = () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const pathname = usePathname();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Menu mode="horizontal" selectedKeys={[pathname]} style={{ flex: 1 }} theme='dark'>
                    <Menu.Item key="/">
                        <Link href="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/products">
                        <Link href="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/community">
                        <Link href="/community">Community Forums</Link>
                    </Menu.Item>
                    <Menu.Item key="/account">
                        <Link href="/account">User Account</Link>
                    </Menu.Item>
                    <Menu.Item key="/adminstration">
                        <Link href="/adminstration">Adminstration</Link>
                    </Menu.Item>
                    <Menu.Item key="/merchant">
                        <Link href="/merchant">Merchant</Link>
                    </Menu.Item>
                </Menu>
                {/*<div onClick={() => (window.location.href = '/account')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '16px' }}>*/}
                {/*    <Avatar src={user.avatar || defaultAvatar} />*/}
                {/*    <span style={{ marginLeft: '8px' }}>{user.name}</span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Navbar;
