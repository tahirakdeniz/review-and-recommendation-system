'use client'

import {Button, Card, message, Pagination, Spin} from "antd";
import {useEffect, useState} from "react";
import axios from 'axios';
import {baseURL} from "@/lib/const";
import {PostDto, TopicDto} from "@/lib/dto";
import {Roles} from "@/lib/enums";
import {ForumTopicAddNewMessageModal} from "@/components/ForumTopicAddNewMessageModal";
import {ForumPost} from "@/components/ForumPost";
import {ForumTopicUpdateMessageModal} from "@/components/ForumTopicUpdateMessageModal";

interface ForumTopicPageProps {
    topicId: string;
}


const ForumTopicPage: React.FC<ForumTopicPageProps> = ({ topicId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topicTitle, setTopicTitle] = useState<string>("");
    const pageSize = 4;
    const role = localStorage.getItem('role');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<PostDto[]>(`${baseURL}/posts/get/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
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

    const handleDeletePost = async (postId: number) => {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem('accessToken');
        const isAdminOrModerator = role === Roles.ADMIN || role === Roles.COMMUNITY_MODERATOR;
        const url = isAdminOrModerator ? `${baseURL}/posts/admin/${postId}` : `${baseURL}/posts/${postId}`;
        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            message.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                message.error(`Axios error: ${error.response?.data.message || error.message}`);
            } else {
                message.error(`Runtime error: ${error}`);
            }
            console.error('Error deleting post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEditPost = (postId: number) => {

    }

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
                        <ForumPost key={post.id} onClick={() => handleDeletePost(post.id)} disabled={loading}
                                   post={post} refreshPosts={fetchPosts}/>
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
            <ForumTopicAddNewMessageModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} topicId={topicId} refreshPosts={fetchPosts} />
        </div>
    )
}

export default ForumTopicPage;