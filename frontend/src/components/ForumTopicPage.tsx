'use client'

import {Avatar, Button, Card, Col, Form, Input, Modal, Pagination, Row, Space, message, Spin, Checkbox} from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import axios from 'axios';
import { baseURL } from "@/lib/const";
import {TopicDto, TopicPostDto} from "@/lib/dto";
import {headers} from "next/headers"; // Make sure this import matches your type definitions

interface ForumTopicPageProps {
    topicId: string
}

interface AddNewMessageModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    topicId: string;
    refreshPosts: () => void;
}

const AddNewMessageModal: React.FC<AddNewMessageModalProps> = ({ isModalOpen, setIsModalOpen, topicId, refreshPosts }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = () => {
        form.validateFields().then(addNewMessage).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const addNewMessage = async (values: { content: string; isAnonymous: boolean }) => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(`${baseURL}/posts`, {
                content: values.content,
                isAnonymous: values.isAnonymous,
                topicId: topicId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                messageApi.success('Message posted successfully');
                setIsModalOpen(false);
                refreshPosts();
                form.resetFields();
            } else {
                messageApi.error('Failed to post message');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
            } else {
                messageApi.error(`Runtime error: ${error}`);
            }
            console.error('Error posting message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    }

    return (
        <Modal title="Write a Message" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading}>
            {contextHolder}
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Message"
                    name="content"
                    rules={[{ required: true, message: 'Please input the message content!' }]}
                >
                    <TextArea rows={12} />
                </Form.Item>
                <Form.Item
                    name="isAnonymous"
                    valuePropName="checked"
                >
                    <Checkbox>Post as Anonymous</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ForumTopicPage: React.FC<ForumTopicPageProps> = ({ topicId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<TopicPostDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topicTitle, setTopicTitle] = useState<string>("");
    const pageSize = 4;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<TopicPostDto[]>(`${baseURL}/posts/get/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setPosts(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.message || err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTopicDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<TopicDto>(`${baseURL}/topics/getTopic/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setTopicTitle(response.data.title);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.message || err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchTopicDetails();
    }, [topicId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return (
        <div>
            <Card title={topicTitle}>
                {loading ? (
                    <Spin tip="Loading...">
                        <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                    </Spin>
                ) : error ? (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</div>
                ) : (
                    paginatedPosts.map(post => (
                        <Card key={post.id} style={{ marginBottom: 12, minHeight: 60 }}>
                            <Button
                                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'transparent', border: 'none' }}
                                icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                            />
                            <Row gutter={16}>
                                <Col span={5}>
                                    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightyellow' }}>
                                        <Row>
                                            <div style={{ padding: 4, textAlign: 'center' }}>
                                                <Avatar size={86} />
                                                <p>{post.isAnonymous ? 'Anonymous' : post.userDto.username}</p>
                                                <p>{new Date(post.creationDate).toLocaleDateString()}</p>
                                            </div>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={14}>
                                    <p>{post.content}</p>
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}
                <div style={{ position: 'relative', left: 16 }}>
                    <Button type="primary" onClick={showModal}>Write a Message</Button>
                </div>
                <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={posts.length}
                        onChange={handlePageChange}
                    />
                </div>
            </Card>
            <AddNewMessageModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} topicId={topicId} refreshPosts={fetchPosts} />
        </div>
    )
}

export default ForumTopicPage;
