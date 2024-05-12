'use client'
import { useEffect, useState } from 'react';
import { Input, Menu, Avatar, Space, Tooltip, Button, Flex } from 'antd';
import {UserOutlined, ShoppingCartOutlined, FormOutlined, HeartOutlined, ShopOutlined, SettingOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {usePathname, useRouter} from "next/navigation";
import {PoweroffOutlined} from "@ant-design/icons";
import {RootState, useDispatch} from "@/lib/redux/store";
import {fetchUser} from "@/lib/redux/features/user/userSlice";
import {useSelector} from "react-redux";


const defaultAvatar = '/path/to/default/avatar.jpg'; // Path to your default avatar image

// Placeholder user object. In a real app, this might come from global state, context, or props.
const user = {
    name: 'John Doe',
    avatar: '', // User's avatar URL. Leave empty to simulate "not found"
};

const Navbar = () => {
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const pathname = usePathname();
    const {user} = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch]);

    const logOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        window.location.reload();
    }

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
                    <Menu.Item key="/forum" icon={<FormOutlined />}>
                        <Link href="/forum">Forum</Link>
                    </Menu.Item>
                    <Menu.Item key="/shop" icon={<ShopOutlined />}>
                        <Link href="/products">Shop</Link>
                    </Menu.Item>
                    <Menu.Item key="/scshop" icon={<ShopOutlined />}>
                        <Link href="/scshop">SC Shop</Link>
                    </Menu.Item>
                    <Menu.Item key="/account" icon={<UserOutlined />}>
                        <Link href="/account">Profile</Link>
                    </Menu.Item>
                    {role == 'MERCHANT' && <Menu.Item key="/merchant" icon={<ShoppingCartOutlined/>}>
                        <Link href="/merchant">My Products</Link>
                    </Menu.Item>}
                    {role == 'ADMINISTRATION' && <Menu.Item key="/administration" icon={<SettingOutlined/>}> {/*TODO check role for administraion*/}
                        <Link href="/administration">Administrator</Link>
                    </Menu.Item>}
                </Menu>
            </div>
            {accessToken ?
                (<div className={'flex-auto'}>
                    {/*<Avatar size={32} icon={<UserOutlined/>}*/}
                    <span style={{marginLeft: '8px'}}>{user?.firstName} {user?.lastName}</span>
                </div>)
                :
                (<div className={'flex-auto'}>
                    <Link href={'/signup'}>Sign up</Link> or <Link href={'/login'}>Log in</Link>
                </div>)
            }

            <div className={'h-17 grid content-center'}>
                <Flex wrap="wrap" gap="middle">
                    {accessToken && (<Tooltip title="Log Out">
                        <Button shape="circle" icon={<PoweroffOutlined />} size={'large'} onClick={() => logOut()}/>
                    </Tooltip>)}
                    <Tooltip title="Wishlist">
                        <Button shape="circle" icon={<HeartOutlined/>} size={'large'} />
                    </Tooltip>
                    <Tooltip title="Shopping Cart">
                        <Button shape="circle" icon={<ShoppingCartOutlined/>} onClick={() => router.push('/cart')} size={'large'} />
                    </Tooltip>

                </Flex>
            </div>
        </div>
    );
};

export default Navbar;
