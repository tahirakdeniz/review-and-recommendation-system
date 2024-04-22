'use client'
import { useEffect, useState } from 'react';
import { Input, Menu, Avatar, Space } from 'antd';
import {UserOutlined, ShoppingCartOutlined, FormOutlined, ShopOutlined, SettingOutlined} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const defaultAvatar = '/path/to/default/avatar.jpg'; // Path to your default avatar image

// Placeholder user object. In a real app, this might come from global state, context, or props.
const user = {
    name: 'John Doe',
    avatar: '', // User's avatar URL. Leave empty to simulate "not found"
};

const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className={'bg-inherit flex'}>
            <div>
                <Link href="/">Logo</Link> {/* Removed inline styling for Link */}
            </div>
            <div>
                <Input.Search placeholder="Search..." />
            </div>
            <div>
                <Menu mode="horizontal" selectedKeys={[pathname]} className={'bg-inherit'}>
                    <Menu.Item key="/community" icon={<FormOutlined />}>
                        <Link href="/community">Forum</Link>
                    </Menu.Item>
                    <Menu.Item key="/shop" icon={<ShopOutlined />}>
                        <Link href="/shop">Shop</Link>
                    </Menu.Item>
                    <Menu.Item key="/account" icon={<UserOutlined />}>
                        <Link href="/account">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="/merchant" icon={<ShoppingCartOutlined />}>
                        <Link href="/merchant">My Products</Link>
                    </Menu.Item>
                    <Menu.Item key="/administration" icon={<SettingOutlined />}>
                        <Link href="/administration">Administrator</Link>
                    </Menu.Item>
                </Menu>
            </div>
            <div style={{ flex: '0 1 auto' }}>
                <Avatar src={user.avatar || defaultAvatar} />
                <span style={{ marginLeft: '8px' }}>{user.name}</span>
            </div>
        </div>
    );
};

export default Navbar;
