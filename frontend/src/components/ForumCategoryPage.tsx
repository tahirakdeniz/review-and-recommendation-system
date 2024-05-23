'use client'

import {Avatar, Button, Card, Checkbox, Col, Form, Input, message, Modal, Pagination, Row, Spin} from "antd";
import {CloseCircleOutlined, EditOutlined} from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import {useEffect, useState} from "react";
import Link from "next/link";
import axios from 'axios';
import {baseURL} from "@/lib/const";
import {TopicDto} from "@/lib/dto";
import {Roles} from "@/lib/enums";
import {RootState} from "@/lib/redux/store";
import {useSelector} from "react-redux";
import Result403 from "@/components/Result403";

interface ForumCategoryPageProps {
    categoryId: string;
}

interface FormValues {
    title: string;
    post: string;
    isAnonymous: boolean;
}

interface UpdateTopicModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    refreshTopics: () => void;
    topic: TopicDto;
}

const ForumCategoryPageUpdateTopicModal: React.FC<UpdateTopicModalProps> = ({
                                                                                isModalOpen,
                                                                                setIsModalOpen,
                                                                                refreshTopics,
                                                                                topic
                                                                            }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        form.setFieldsValue({
            title: topic.title,
            isAnonymous: topic.userDto.username === 'Anonymous'
        });
    }, [topic]);


    const handleOk = () => {
        form.validateFields().then(updateTopic).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const updateTopic = async (values: {isAnonymous: boolean, title: string}) => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.put(`${baseURL}/topics/${topic.id}`, {
                title: values.title,
                isAnonymous: values.isAnonymous,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                messageApi.success('Topic updated successfully');
                setIsModalOpen(false);
                refreshTopics();
                form.resetFields();
            } else {
                messageApi.error('Failed to update topic');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
            } else {
                messageApi.error(`Runtime error: ${error}`);
            }
            console.error('Error creating new topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    }

    return (
        <Modal title="Add New Topic" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               confirmLoading={loading}>
            {contextHolder}
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Topic Name"
                    name="title"
                    rules={[{required: true, message: 'Please input the topic title!'}]}
                >
                    <Input/>
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

interface AddNewTopicModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    categoryId: string;
    refreshTopics: () => void;
}

const ForumCategoryPageAddNewTopicModal: React.FC<AddNewTopicModalProps> = ({
                                                                                isModalOpen,
                                                                                setIsModalOpen,
                                                                                categoryId,
                                                                                refreshTopics
                                                                            }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = () => {
        form.validateFields().then(addNewTopic).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const addNewTopic = async (values: FormValues) => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(`${baseURL}/topics`, {
                categoryId: categoryId,
                title: values.title,
                post: values.post,
                isAnonymous: values.isAnonymous,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                messageApi.success('Topic created successfully');
                setIsModalOpen(false);
                refreshTopics();
                form.resetFields();
            } else {
                messageApi.error('Failed to create topic');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
            } else {
                messageApi.error(`Runtime error: ${error}`);
            }
            console.error('Error creating new topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    }

    return (
        <Modal title="Add New Topic" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               confirmLoading={loading}>
            {contextHolder}
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Topic Name"
                    name="title"
                    rules={[{required: true, message: 'Please input the topic title!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Post"
                    name="post"
                    rules={[{required: true, message: 'Please input the first topic post!'}]}
                >
                    <TextArea rows={10}/>
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

function TopicCard(props: {
    admin: boolean,
    communityModerator: boolean,
    topic: TopicDto,
    onDeleteClick: () => void,
    disabled: boolean,
    refreshTopics: () => Promise<void>
}) {
    const {user} = useSelector((state: RootState) => state.user);
    const username = user ? user.username : localStorage.getItem('username');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userId = user?.id;
    return <Card style={{marginBottom: 16}}>
        {((props.admin || props.communityModerator) || props.topic.userDto.username === username || props.topic.userDto.id === userId) && (
            <Button
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "transparent",
                    border: "none"
                }}
                icon={<CloseCircleOutlined style={{color: "red"}}/>}
                onClick={props.onDeleteClick}
                disabled={props.disabled}
            />
        )}
        {(props.topic.userDto.username === username || props.topic.userDto.id === userId) && (
            <Button
                style={{
                    position: "absolute",
                    top: 8,
                    right: 36,
                    backgroundColor: "transparent",
                    border: "none"
                }}
                icon={<EditOutlined style={{color: "blue"}}/>}
                onClick={() => setIsModalOpen(true)}
                disabled={props.disabled}
            />
        )}
        <Row>
            <Col span={8}>
                <Meta
                    avatar={<Avatar src={`url-of-the-avatar-${props.topic.userDto.username}`} size={32}/>}
                    title={<strong>{props.topic.userDto.username}</strong>}
                    description={props.topic.postDtos[0]?.content.length > 50 ? props.topic.postDtos[0]?.content.substring(0, 50) + "..." : props.topic.postDtos[0]?.content}
                />
            </Col>
            <Col span={8}>
                <Link href={"/forum/topic/" + props.topic.id}><p>
                    <strong>{props.topic.title}</strong></p></Link>
            </Col>
            <Col span={4}>
                <p>Messages: {props.topic.messageCount}</p>
            </Col>
            <Col span={4}>
                <p>{new Date(props.topic.creationDate).toLocaleDateString()}</p>
            </Col>
        </Row>
        <ForumCategoryPageUpdateTopicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                                           refreshTopics={props.refreshTopics} topic={props.topic}/>
    </Card>;
}

const ForumCategoryPage: React.FC<ForumCategoryPageProps> = ({categoryId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [topics, setTopics] = useState<TopicDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryTitle, setCategoryTitle] = useState<string>("");
    const {user} = useSelector((state: RootState) => state.user);
    const pageSize = 4;

    const role = user ? user.role : localStorage.getItem('role');
    const username = user ? user.username : localStorage.getItem('username');
    const hasLoggedIn = user !== null || localStorage.getItem('accessToken') !== null;
    const isAdmin = role === Roles.ADMIN;
    const isCommunityModerator = role === Roles.COMMUNITY_MODERATOR;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const fetchCategoryDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/forum-categories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                params: {
                    id: categoryId
                }
            });
            setCategoryTitle(response.data.name);
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

    const fetchTopics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<TopicDto[]>(`${baseURL}/topics/get/${categoryId}`);
            setTopics(response.data);
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

    const handleDeleteTopic = async (topicId: number) => {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem('accessToken');
        const isAdminOrModerator = isAdmin || isCommunityModerator;
        const url = isAdminOrModerator ? `${baseURL}/topics/admin/${topicId}` : `${baseURL}/topics/${topicId}`;
        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            message.success('Topic deleted successfully');
            fetchTopics();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                message.error(`Axios error: ${error.response?.data.message || error.message}`);
            } else {
                message.error(`Runtime error: ${error}`);
            }
            console.error('Error deleting topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteTopic = (topicId: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this topic?',
            onOk: () => handleDeleteTopic(topicId),
            okButtonProps: {danger: true},
            okText: 'Yes, delete',
            cancelText: 'Cancel',
        });
    };


    useEffect(() => {
        fetchCategoryDetails();
        fetchTopics();
    }, [categoryId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTopics = topics.slice(startIndex, endIndex);

    if(!hasLoggedIn) {
        return <Result403/>
    }

    return (
        <div>
            <Card
                title={categoryTitle}
                style={{height: 630}}
                extra={
                    <>{hasLoggedIn && <Button type="primary" onClick={showModal} disabled={loading}>Create New Topic</Button>}</>
                }
            >
                {loading ? (
                    <Spin tip="Loading...">
                        <div style={{height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}/>
                    </Spin>
                ) : error ? (
                    <div style={{color: 'red', textAlign: 'center', marginTop: 20}}>{error}</div>
                ) : (
                    paginatedTopics.map((topic, index) => (
                        <TopicCard key={index} admin={isAdmin} communityModerator={isCommunityModerator} topic={topic}
                                   onDeleteClick={() => confirmDeleteTopic(topic.id)} disabled={loading}
                                   refreshTopics={fetchTopics}/>
                    ))
                )}
                <div style={{position: 'absolute', right: 32, bottom: 32}}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={topics.length}
                        onChange={handlePageChange}
                    />
                </div>
            </Card>
            <ForumCategoryPageAddNewTopicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                                               categoryId={categoryId} refreshTopics={fetchTopics}/>
        </div>
    )
}

export default ForumCategoryPage;
