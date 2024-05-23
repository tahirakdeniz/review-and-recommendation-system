'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Input, List, message, Modal, Pagination, Row, Spin, Typography } from 'antd';
import axios from 'axios';
import { baseURL } from "@/lib/const";
import { errorHandler } from "@/lib/utils";
import {User as UserDto} from "@/lib/redux/features/user/userSlice";

const { Search } = Input;
const { Title } = Typography;

export function AdministrationBannedUsersSection() {
    const [bannedUsers, setBannedUsers] = useState<UserDto[]>([]);
    const [allUsers, setAllUsers] = useState<UserDto[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [currentPageBanned, setCurrentPageBanned] = useState(1);
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const pageSize = 5;

    const fetchBannedUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get<UserDto[]>(`${baseURL}/users/banned-users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setBannedUsers(response.data);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Fetch Banned Users');
            messageApi.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async (searchKey: string) => {
        setSearchLoading(true);
        try {
            const response = await axios.get<UserDto[]>(`${baseURL}/users/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                params: {
                    searchKey: searchKey
                }
            });
            setAllUsers(response.data);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Search Users');
            messageApi.error(errorMessage);
        } finally {
            setSearchLoading(false);
        }
    };

    const banUser = async (userId: string) => {
        try {
            await axios.put(`${baseURL}/users/ban/${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            messageApi.success('User banned successfully');
            fetchBannedUsers();
        } catch (error) {
            const errorMessage = errorHandler(error, 'Ban User');
            messageApi.error(errorMessage);
        }
    };

    const unbanUser = async (userId: string) => {
        try {
            await axios.put(`${baseURL}/users/unban/${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            messageApi.success('User unbanned successfully');
            fetchBannedUsers();
        } catch (error) {
            const errorMessage = errorHandler(error, 'Unban User');
            messageApi.error(errorMessage);
        }
    };

    const handleSearch = (value: string) => {
        setSearchKey(value);
        fetchAllUsers(value);
    };

    useEffect(() => {
        fetchBannedUsers();
    }, []);

    const handlePageChangeBanned = (page: number) => {
        setCurrentPageBanned(page);
    };

    const handlePageChangeAll = (page: number) => {
        setCurrentPageAll(page);
    };

    const paginatedBannedUsers = bannedUsers.slice((currentPageBanned - 1) * pageSize, currentPageBanned * pageSize);
    const paginatedAllUsers = allUsers.slice((currentPageAll - 1) * pageSize, currentPageAll * pageSize);

    return (
        <>
            {contextHolder}
            <Card title={<Title level={3}>Banned Users</Title>} style={{ marginBottom: 20 }}>
                {loading ? (
                    <Spin tip="Loading...">
                        <div style={{ height: 200 }} />
                    </Spin>
                ) : (
                    <>
                        {paginatedBannedUsers.length > 0 ? (
                            <List
                                dataSource={paginatedBannedUsers}
                                renderItem={user => (
                                    <List.Item
                                        actions={[
                                            <Button type="link" onClick={() => unbanUser(user.id)}>Unban</Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={user.username}
                                            description={`${user.firstName} ${user.lastName}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No banned users found." />
                        )}
                        <Pagination
                            current={currentPageBanned}
                            pageSize={pageSize}
                            total={bannedUsers.length}
                            onChange={handlePageChangeBanned}
                            style={{ marginTop: 20, textAlign: 'center' }}
                        />
                    </>
                )}
            </Card>
            <Card title={<Title level={3}>Search Users</Title>}>
                <Search
                    placeholder="Search users by username, email, or name"
                    enterButton
                    onSearch={handleSearch}
                    loading={searchLoading}
                />
                {searchKey && (
                    <>
                        {paginatedAllUsers.length > 0 ? (
                            <List
                                style={{ marginTop: 20 }}
                                dataSource={paginatedAllUsers}
                                renderItem={user => (
                                    <List.Item
                                        actions={[
                                            <Button type="link" onClick={() => banUser(user.id)}>Ban</Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={user.username}
                                            description={`${user.firstName} ${user.lastName}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No users found." />
                        )}
                        <Pagination
                            current={currentPageAll}
                            pageSize={pageSize}
                            total={allUsers.length}
                            onChange={handlePageChangeAll}
                            style={{ marginTop: 20, textAlign: 'center' }}
                        />
                    </>
                )}
            </Card>
        </>
    );
}
