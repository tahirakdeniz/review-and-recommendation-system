'use client'
import { useEffect, useState } from 'react';
import { Input, Menu, Avatar, Space, Tooltip, Button, Flex } from 'antd';
import {UserOutlined, ShoppingCartOutlined, FormOutlined, HeartOutlined, ShopOutlined, SettingOutlined} from '@ant-design/icons';
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
        <div className={'bg-inherit flex gap-4 justify-between'}>
            <div>
                <Link href="/">Logo</Link> {/* Removed inline styling for Link */}
            </div>
            <div className={'h-17 grid content-center'}>
                <Input.Search placeholder="Search..."/>
            </div>
            <div>
                <Menu mode="horizontal" selectedKeys={[pathname]} className={'bg-inherit'}>
                    <Menu.Item key="/community" icon={<FormOutlined />}>
                        <Link href="/community">Forum</Link>
                    </Menu.Item>
                    <Menu.Item key="/shop" icon={<ShopOutlined />}>
                        <Link href="/shop">Shop</Link>
                    </Menu.Item>
                    <Menu.Item key="/scshop" icon={<ShopOutlined />}>
                        <Link href="/scshop">SC Shop</Link>
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
            <div className={'flex-auto'}>
                <Avatar size={32} icon={<UserOutlined />} /* src={user.avatar || defaultAvatar} */ />
                <span style={{ marginLeft: '8px' }}>{user.name}</span>
            </div>
            <div className={'h-17 grid content-center'}>
                <Flex wrap="wrap" gap="middle">
                    <Tooltip title="Wishlist">
                        <Button shape="circle" icon={<HeartOutlined/>} size={'large'} />
                    </Tooltip>
                    <Tooltip title="Shopping Cart">
                        <Button shape="circle" icon={<ShoppingCartOutlined/>} size={'large'} />
                    </Tooltip>
                </Flex>
            </div>
        </div>
    );
};

export default Navbar;
