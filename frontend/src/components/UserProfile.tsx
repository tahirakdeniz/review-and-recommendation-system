'use client';
import React, { useState } from 'react';
import { Card, Avatar, Button, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditProfileModal from './EditProfileModal';
import { UserInfo } from '@/lib/types';
import ChangePasswordForm from "@/components/ChangePasswordForm";

const UserProfilePage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'This is a bio',
        avatar: 'https://joeschmoe.io/api/v1/random',
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = (updatedUserInfo: UserInfo) => {
        setUserInfo(updatedUserInfo);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Card style={{ width: 600, display: 'flex' }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Avatar size={64} src={userInfo.avatar} />
                    </Col>
                    <Col span={18}>
                        <div><strong>Name:</strong> {userInfo.name}</div>
                        <div><strong>Email:</strong> {userInfo.email}</div>
                        <div><strong>Bio:</strong> {userInfo.bio}</div>
                        <Button icon={<EditOutlined />} onClick={showModal} style={{ marginTop: '10px' }}>
                            Edit
                        </Button>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '20px' }}>
                    <Col span={24}>
                        <ChangePasswordForm />
                    </Col>
                </Row>
            </Card>
            <EditProfileModal userInfo={userInfo} isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
        </div>
    );
};

export default UserProfilePage;
