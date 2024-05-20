'use client';
import {Button, Card, Divider, Flex, List, Typography} from 'antd';
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import Link from "next/link";
import {Roles} from "@/lib/enums";

export default function Home() {
    const { user, loading, error } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    // TODO check links and descriptions
    const menus = [
        { key: 'community', label: 'Forum', description: 'Join discussions and share knowledge with the community.', link: '/forum'},
        { key: 'shop', label: 'Shop', description: 'Browse and purchase products from our store.', link: '/shop'},
        // { key: 'scshop', label: 'SC Shop', description: 'Specialized products for SC users.', link: '/scshop'},
        { key: 'account', label: 'Profile', description: 'Manage your account and personal information.', link: '/account'},
    ];

    const merchantMenus = [
        { key: 'myproducts', label: 'Products', description: 'Manage your products and inventory.', link: '/merchant'},
    ];

    const adminMenus = [
        { key: 'admin', label: 'Admin', description: 'Manage users, products, and other site content.', link: '/administration'},
    ]

    return (
        <>
            <Card style={{width: '%100'}}>
                <Flex style={{width: '%100'}} align={'center'} justify={'center'}>
                    {user ? (
                        <Typography.Title level={2} >Welcome, {user.firstName} {user.lastName}</Typography.Title>
                    ) : (
                        <Flex align={'center'} justify={'center'} vertical>
                            <Typography.Title level={2} >Welcome Guest!</Typography.Title>
                            <Button type="primary" className="mt-4" onClick={() => router.push('/signup')}>
                                Sign Up
                            </Button>
                            <div>
                                or
                                <Typography.Link onClick={() => router.push('/login')}> Login </Typography.Link>
                            </div>
                        </Flex>
                    )}
                </Flex>
                <Divider/>
                <List
                    size="small"
                    bordered
                    dataSource={menus}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Link href={item.link}>{item.label}</Link>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
                {user?.role == Roles.MERCHANT && (<>
                    <Divider/>
                    <List
                        size="small"
                        bordered
                        dataSource={merchantMenus}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<Link href={item.link}>{item.label}</Link>}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </>)}
                {user?.role == Roles.ADMIN && (<>
                    <Divider/>
                    <List
                        size="small"
                        bordered
                        dataSource={adminMenus}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<Link href={item.link}>{item.label}</Link>}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </>)}
            </Card>
        </>
    );
}
