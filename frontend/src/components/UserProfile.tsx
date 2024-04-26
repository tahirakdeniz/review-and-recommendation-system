'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, } from 'react-redux';
import {Card, Avatar, Button, Row, Col, message, List, Space, Badge} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditProfileModal from './EditProfileModal';
import {fetchUser, updateUser, deleteUser, User} from '@/lib/redux/features/user/userSlice'; // Correct path
import { RootState, useDispatch } from '@/lib/redux/store'; // Assuming RootState correctly reflects store structure


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
                            <strong>Balance:</strong> {user.accountBalance}
                            <br />
                            <strong>Social Credit:</strong> $1
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
                <Card title="Purchased Products" style={{ maxWidth: 1500, width: '100%', marginTop: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <List
                        grid={{ gutter: 4, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, xxl: 3 }}
                        dataSource={user.purchaseDtos[0]?.purchaseItemDtoList}
                        renderItem={item => (
                            <Badge count={item.quantity}>
                                <List.Item>
                                    <Card style={{ width: 180, margin: '0 10px' }}
                                    >
                                        <strong>{item.productDto.name}</strong>
                                        <p>Price: ${item.productDto.price}</p>
                                    </Card>
                                </List.Item>
                            </Badge>
                        )}
                    />
                </Card>

        </div>
    );
};

export default UserProfilePage;
