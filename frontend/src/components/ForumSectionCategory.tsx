'use client'
import { useState, useEffect } from 'react';
import { Card, Col, Row, Space, Button, Modal, Input, Form, message } from 'antd';
import { CommentOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from 'axios';
import { baseURL } from "@/lib/const";
import { Roles } from "@/lib/enums";
import { ForumCategoryDto } from "@/lib/dto";

type ForumSectionCategoryProps = {
    title: string;
    subcategories: ForumCategoryDto[];
    refreshCategories: () => void;
};

export default function ForumSectionCategory({ title, subcategories, refreshCategories }: ForumSectionCategoryProps) {
    const [modal, contextHolder] = Modal.useModal();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<ForumCategoryDto | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageApi] = message.useMessage();
    const [form] = Form.useForm();

    const isAdmin = localStorage.getItem('role') === Roles.ADMIN;
    const isCommunityModerator = localStorage.getItem('role') === Roles.COMMUNITY_MODERATOR;

    const showEditModal = (category: ForumCategoryDto) => {
        setCurrentCategory(category);
        form.setFieldsValue({
            categoryName: category.name,
            categoryDescription: category.description,
        });
        setIsEditModalVisible(true);
    };

    const showDeleteModal = (category: ForumCategoryDto) => {
        setCurrentCategory(category);
        setIsDeleteModalVisible(true);
    };

    const handleEditCategory = async () => {
        if (currentCategory) {
            const accessToken = localStorage.getItem('accessToken');
            setLoading(true);
            try {
                const response = await axios.put(`${baseURL}/forum-categories/${currentCategory.id}`, {
                    name: newCategoryName,
                    description: newCategoryDescription,
                    header: currentCategory.forumCategoryHeader,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    messageApi.success('Category updated successfully');
                } else {
                    messageApi.error('Failed to update category');
                }

                setIsEditModalVisible(false);
                refreshCategories(); // Refresh categories after editing
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
                } else {
                    messageApi.error(`Runtime error: ${error}`);
                }
                console.error('Error updating category:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteCategory = async () => {
        if (currentCategory) {
            const accessToken = localStorage.getItem('accessToken');
            setLoading(true);
            try {
                const response = await axios.delete(`${baseURL}/forum-categories/${currentCategory.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    messageApi.success('Category deleted successfully');
                } else {
                    messageApi.error('Failed to delete category');
                }

                setIsDeleteModalVisible(false);
                refreshCategories(); // Refresh categories after deletion
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
                } else {
                    messageApi.error(`Runtime error: ${error}`);
                }
                console.error('Error deleting category:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {contextHolder}
            <Card
                title={title}
            >
                {subcategories.map((subcategory, index) => (
                    <Card key={index} type="inner" style={{ marginBottom: 5 }}>
                        <Row align="middle">
                            <Col span={1}><div style={{ fontSize: '24px' }}><CommentOutlined /></div></Col>
                            <Col span={12}><Link href={"/forum/" + subcategory.name}><strong>{subcategory.name}</strong></Link></Col>
                            <Col span={4}><div>Topic: {subcategory.topicCount}</div></Col>
                            <Col span={4}><div>Messages: {subcategory.messageCount}</div></Col>
                            <Col span={3}>
                                {(isAdmin || isCommunityModerator) && (
                                    <>
                                        <Button type="link" onClick={() => showEditModal(subcategory)}>Edit</Button>
                                        <Button type="link" danger onClick={() => showDeleteModal(subcategory)}>Delete</Button>
                                    </>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}><div>{subcategory.description}</div></Col>
                        </Row>
                    </Card>
                ))}
            </Card>

            <Modal
                title="Edit Category"
                open={isEditModalVisible}
                onOk={() => form.validateFields().then(handleEditCategory)}
                onCancel={() => setIsEditModalVisible(false)}
                confirmLoading={loading}
                okButtonProps={{ disabled: loading }}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Category Name"
                        name="categoryName"
                        rules={[{ required: true, message: 'Category Name is required' }]}
                    >
                        <Input
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Category Description"
                        name="categoryDescription"
                        rules={[{ required: true, message: 'Category Description is required' }]}
                    >
                        <Input
                            value={newCategoryDescription}
                            onChange={e => setNewCategoryDescription(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Delete Category"
                open={isDeleteModalVisible}
                onOk={handleDeleteCategory}
                onCancel={() => setIsDeleteModalVisible(false)}
                confirmLoading={loading}
                okButtonProps={{ disabled: loading , danger: true}}
                okText="Yes, delete"
            >
                <p>Are you sure you want to delete this category?</p>
            </Modal>
        </>
    );
}
