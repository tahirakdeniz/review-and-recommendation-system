'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, } from 'react-redux';
import { Card, Avatar, Button, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditProfileModal from './EditProfileModal';
import {fetchUser, updateUser, deleteUser, User} from '@/lib/redux/features/user/userSlice'; // Correct path
import { RootState, useDispatch } from '@/lib/redux/store'; // Assuming RootState correctly reflects store structure


const UserProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.user); // Ensure 'user' slice is defined in RootState

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    const handleOk = (updatedUserInfo: Partial<User>) => {
        // @ts-ignore
        dispatch(updateUser({ ...user, ...updatedUserInfo }));
        setIsModalVisible(false);
    };

    const handleDeleteUser = () => {
        if (user && user.UserName) {
            dispatch(deleteUser(user.UserName));
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No User Data</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Card style={{ maxWidth: 1500, width: '100%' }}>
                <Row gutter={16}>
                    {/*}
                    <Col span={6}>
                         <Avatar size={164} src={user?.avatar || 'default-avatar-url'} />
                    </Col>
                    {*/}
                    <Col span={18}>
                        <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Bio:</strong> {user.description}</div>
                        <div>
                            <strong>Balance:</strong> ${user.balance}
                            <br />
                            <strong>Social Credit:</strong> {user.socialCredit}
                        </div>
                        <Button icon={<EditOutlined />} onClick={() => setIsModalVisible(true)} style={{ marginTop: '10px' }}>
                            Edit Profile
                        </Button>
                        <Button danger onClick={handleDeleteUser} style={{ marginTop: '10px' }}>
                            Delete Profile
                        </Button>
                    </Col>
                </Row>
            </Card>
            {/*}
            <EditProfileModal userInfo={user} isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
            {*/}
        </div>
    );
};

export default UserProfilePage;
