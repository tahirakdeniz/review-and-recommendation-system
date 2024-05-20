'use client'

import {useEffect, useState} from 'react';
import {Button, Flex, Input, Menu, Tooltip} from 'antd';
import {
    FormOutlined,
    HeartOutlined,
    PoweroffOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import {usePathname, useRouter} from "next/navigation";
import {RootState, useDispatch} from "@/lib/redux/store";
import {fetchUser} from "@/lib/redux/features/user/userSlice";
import {useSelector} from "react-redux";
import {Roles} from "@/lib/enums";


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
    const [search, setSearch] = useState('');
    const firstPath = pathname.split('/')[1];
    console.log(firstPath)

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch]);

    const logOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        window.location.reload();
    }

    const handleSearch = (value: string) => {
        router.push(`/shop?search=${value}`)
    }

    return (
        <div className={'bg-inherit flex gap-4 justify-between'}>
            <div>
                <Link href="/">Logo</Link> {/* Removed inline styling for Link */}
            </div>
            <div className={'h-17 grid content-center'}>
                <Input.Search placeholder="Search..."
                              onSearch={handleSearch}
                />
            </div>
            <div>
                <Menu mode="horizontal" selectedKeys={[firstPath]} className={'bg-inherit'}>
                    <Menu.Item key="forum" icon={<FormOutlined />}>
                        <Link href="/forum">Forum</Link>
                    </Menu.Item>
                    <Menu.Item key="shop" icon={<ShopOutlined />}>
                        <Link href="/shop">Shop</Link>
                    </Menu.Item>
                    {/*<Menu.Item key="/scshop" icon={<ShopOutlined />}>*/}
                    {/*    <Link href="/scshop">SC Shop</Link>*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="account" icon={<UserOutlined />}>
                        <Link href="/account">Profile</Link>
                    </Menu.Item>
                    {role == Roles.COMMUNITY_MODERATOR && <Menu.Item key="merchant" icon={<ShoppingCartOutlined/>}>
                        <Link href="/merchant">My Products</Link>
                    </Menu.Item>}
                    {role == Roles.ADMIN && <Menu.Item key="administration" icon={<SettingOutlined/>}>
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
