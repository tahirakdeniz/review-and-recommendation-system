'use client';
import React, { useState } from 'react';
import { Card, Avatar, Button, Row, Col, List } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditProfileModal from './EditProfileModal';
import { UserInfo } from '@/lib/types';

const UserProfilePage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo & { socialCredit: number; balance: number; }>({
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'This is a bio',
        avatar: 'https://www.reddit.com/r/hearthstone/comments/1506ivo/jaina_proudmoore_fan_art_by_tamplier/#lightbox',
        socialCredit: 750,
        balance: 2000,
    });

    // Sample data for purchased products
    const purchasedProducts = [
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 11,
            id: 1,
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10,
            id: 2,
        },
        {
            name: 'Doğu Timor v2',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 990,
            id: 3,
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10,
            id: 4,
        },
    ];

    const reviewHistory = [
        { id: 1, product: "Product X", review: "Great product, loved it!", imageUrl: "https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg" },
        { id: 2, product: "Product Y", review: "Not what I expected.", imageUrl: "https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg" },
        { id: 3, product: "Product Z", review: "Would buy again!", imageUrl: "https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg" }
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = (updatedUserInfo: Partial<UserInfo & { socialCredit: number; balance: number; }>) => {
        setUserInfo({ ...userInfo, ...updatedUserInfo });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Card style={{ maxWidth: 1500, width: '100%' }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Avatar size={164} src={userInfo.avatar} />
                    </Col>
                    <Col span={18}>
                        <div><strong>Name:</strong> {userInfo.name}</div>
                        <div><strong>Email:</strong> {userInfo.email}</div>
                        <div><strong>Bio:</strong> {userInfo.bio}</div>
                        <div>
                            <strong>Balance:</strong> ${userInfo.balance}
                            <br/>
                            <strong>Social Credit:</strong> {userInfo.socialCredit}
                        </div>
                        <Button icon={<EditOutlined />} onClick={showModal} style={{ marginTop: '10px' }}>
                            Edit Profile
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Card title="Purchased Products" style={{ maxWidth: 1500, width: '100%', marginTop: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <List
                    grid={{ gutter: 4, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, xxl: 3 }}
                    dataSource={purchasedProducts}
                    renderItem={item => (
                        <List.Item>
                            <Card style={{ width: 180, margin: '0 10px' }}
                                  cover={<img src={item.image} style={{ padding: '10px' }} />}
                            >
                                <strong>{item.name}</strong>
                                <p>Rating: {item.rating} ★</p>
                                <p>Price: ${item.price}</p>
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>
            <Card title="Review History" style={{ maxWidth: 1500, width: '100%', marginTop: '20px' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={reviewHistory}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.imageUrl} shape="square" size={64} />}
                                title={item.product}
                                description={item.review}
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <EditProfileModal userInfo={userInfo} isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
        </div>
    );
};

export default UserProfilePage;
