'use client'

import {useEffect, useState} from 'react';
import {Button, Flex, Input, Menu, Tooltip, Image} from 'antd';
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
import {fetchUser, fetchUserImage} from "@/lib/redux/features/user/userSlice";
import {useSelector} from "react-redux";
import {Roles} from "@/lib/enums";
import Logo from "@/assets/images/logo.png";
import UserAvatar from "@/components/UserAvatar";


const defaultAvatar = '/path/to/default/avatar.jpg'; // Path to your default avatar image

// Placeholder user object. In a real app, this might come from global state, context, or props.
const user = {
    name: 'John Doe',
    avatar: '', // User's avatar URL. Leave empty to simulate "not found"
};

const Navbar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const {user, error} = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [accessToken, setAccessToken] = useState<string | undefined>();

    const role = user?.role;
    const firstPath = pathname.split('/')[1];
    const hasLoggedIn = accessToken!==null && user!==null;

    useEffect(() => {
        dispatch(fetchUser())
        dispatch(fetchUserImage())
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            setAccessToken(token);
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        window.location.reload();
    }

    const handleSearch = (value: string) => {
        router.push(`/shop?search=${value}`)
    }

    return (
        <div className={'bg-inherit flex gap-4 justify-items-stretch'}>
            <div>
                <Link href="/"> 
                        <Image
                            preview={false}
                            width={50}
                            src={Logo.src}
                            alt={"Homepage"}
                        />
                </Link> {/* Removed inline styling for Link */}
            </div>
            <div className={'h-17 grid content-center'}>
                <Input.Search placeholder="Search..."
                              onSearch={handleSearch}
                />
            </div>
            <div className='flex-auto'>
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
                    {hasLoggedIn && <Menu.Item key="account" icon={<UserOutlined />}>
                        <Link href="/account">Profile</Link>
                    </Menu.Item>}
                    {role == Roles.MERCHANT && <Menu.Item key="merchant" icon={<ShoppingCartOutlined/>}>
                        <Link href="/merchant">My Products</Link>
                    </Menu.Item>}
                    {role == Roles.ADMIN && <Menu.Item key="administration" icon={<SettingOutlined/>}>
                        <Link href="/administration">Administrator</Link>
                    </Menu.Item>}
                </Menu>
            </div>
            {hasLoggedIn ?
                (<div className={'flex'}>
                    <Flex align={'center'} justify={'center'}>
                        <UserAvatar size={40} />
                    </Flex>
                    <span style={{marginLeft: '8px'}}>{user?.firstName} {user?.lastName}</span>
                </div>)
                :
                (<div className={'flex-end'}>
                    <Link href={'/signup'}>Sign up</Link> or <Link href={'/login'}>Log in</Link>
                </div>)
            }

            {hasLoggedIn &&
            <div className={'h-17 grid content-center'}>
                <Flex wrap="wrap" gap="middle">
                    {hasLoggedIn && (<Tooltip title="Log Out">
                        <Button shape="circle" icon={<PoweroffOutlined />} size={'large'} onClick={() => logOut()}/>
                    </Tooltip>)}
                    <Tooltip title="Wishlist">
                        <Button shape="circle" icon={<HeartOutlined/>} size={'large'} onClick={() => router.push('/wishlist')}/>
                    </Tooltip>
                    <Tooltip title="Shopping Cart">
                        <Button shape="circle" icon={<ShoppingCartOutlined/>} onClick={() => router.push('/cart')} size={'large'} />
                    </Tooltip>

                </Flex>
            </div>}
        </div>
    );
};

export default Navbar;
