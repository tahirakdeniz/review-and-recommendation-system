import React from 'react';
import {Button, Dropdown, Menu, message, Space} from 'antd';
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    UserOutlined,
    GlobalOutlined, DownOutlined,
} from '@ant-design/icons';
import {MenuProps} from "antd/lib";

// Define the items using the structure required by Ant Design 5.15.3


export default function ProductBrowseBy() {
    const items: MenuProps['items'] = [
        {
            label: '1st menu item',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: '2nd menu item',
            key: '2',
            icon: <UserOutlined />,
        },
        {
            label: '3rd menu item',
            key: '3',
            icon: <UserOutlined />,
            danger: true,
        },
        {
            label: '4rd menu item',
            key: '4',
            icon: <UserOutlined />,
            danger: true,
            disabled: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <>
            <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                        Button
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </>
    );
}
