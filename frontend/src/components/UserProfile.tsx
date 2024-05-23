'use client';
import React, {useEffect, useState} from 'react';
import {useSelector,} from 'react-redux';
import {Badge, Button, Card, Col, List, message, Row, Space} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import EditProfileModal from './EditProfileModal';
import {deleteUser, fetchUser, updateUser, User} from '@/lib/redux/features/user/userSlice'; // Correct path
import {RootState, useDispatch} from '@/lib/redux/store';
import UserAvatar from "@/components/UserAvatar";
import PurchasedProducts from "@/components/PurchasedProducts"; // Assuming RootState correctly reflects store structure


const UserProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.user); // Ensure 'user' slice is defined in RootState
    const[messageApi, contextHolder] = message.useMessage()

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

    const handleDeleteUser =async () => {
        if (user && user.username) {
            const res = await dispatch(deleteUser(user.username));
            if(res.meta.requestStatus == "fulfilled"){
                messageApi.success("Saved Successfully.");
               localStorage.removeItem("accessToken");
               localStorage.removeItem("role");
            }
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
            {contextHolder}
            <Card style={{ maxWidth: 1500, width: '100%' }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <UserAvatar size={150} />
                    </Col>
                    <Col span={18}>
                        <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Bio:</strong> {user.description}</div>
                        <div>
                            <strong>Balance:</strong> {user.accountBalance}
                            <br />
                        </div>
                        <Space direction="horizontal">
                            <Button icon={<EditOutlined />} onClick={() => setIsModalVisible(true)} style={{ marginTop: '10px' }}>
                                Edit Profile
                            </Button>
                            {user.role == "USER" ? (<Button danger onClick={handleDeleteUser} style={{marginTop: '10px'}}>
                                Delete Profile
                            </Button>) : <div className={'w-full'}></div>}
                        </Space>
                    </Col>
                </Row>
            </Card>
            <EditProfileModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
            <PurchasedProducts user={user} />
        </div>
    );
};

export default UserProfilePage;
