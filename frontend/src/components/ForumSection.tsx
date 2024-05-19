'use client'
import ForumSectionCategory from "@/components/ForumSectionCategory";
import { ForumCategoryDto, ForumCategoryHeader } from "@/lib/dto";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/lib/const";
import {Button, Form, Input, message, Modal, Select, Space} from "antd";
import { CategoryHeaders, Roles } from "@/lib/enums";

const splitCategoriesByHeader = (categories: ForumCategoryDto[]) => {
    const categoryMap: Record<string, ForumCategoryDto[]> = {};

    // Sort categories by ID
    categories.sort((a, b) => a.id - b.id);


    categories.forEach(category => {
        if (!categoryMap[category.forumCategoryHeader]) {
            categoryMap[category.forumCategoryHeader] = [];
        }
        categoryMap[category.forumCategoryHeader].push(category);
    });

    return categoryMap;
}

const sortHeaders = (categories: Record<string, ForumCategoryDto[]>) => {
    const order = [
        CategoryHeaders.GENERAL_FIELD,
        CategoryHeaders.Q_A,
        CategoryHeaders.DISCUSSION,
        CategoryHeaders.OTHERS
    ];
    return order.reduce((sortedCategories, header) => {
        if (categories[header]) {
            sortedCategories[header] = categories[header];
        }
        return sortedCategories;
    }, {} as Record<string, ForumCategoryDto[]>);
};


export function ForumSection() {
    const [categories, setCategories] = useState<Record<string, ForumCategoryDto[]>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryHeader, setNewCategoryHeader] = useState<ForumCategoryHeader | null>(null);
    const isAdmin = localStorage.getItem('role') === Roles.ADMIN;
    const isCommunityModerator = localStorage.getItem('role') === Roles.COMMUNITY_MODERATOR;
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const getCategories = async () => {
        try {
            const response = await axios.get<ForumCategoryDto[]>(`${baseURL}/forum-categories/get`);
            const categories = splitCategoriesByHeader(response.data);
            setCategories(sortHeaders(categories));
        } catch (error) {
            messageApi.error('Error fetching forum categories');
            console.error('Error fetching forum categories:', error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleCreateCategory = async () => {
        const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token

        if (newCategoryName && newCategoryDescription && newCategoryHeader && accessToken) {
            setLoading(true);
            try {
                const newCategory = {
                    name: newCategoryName,
                    description: newCategoryDescription,
                    header: newCategoryHeader,
                };
                const response = await axios.post(`${baseURL}/forum-categories`, newCategory, {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Add access token to the request headers
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    messageApi.success('Category created successfully');
                } else {
                    messageApi.error('Failed to create category');
                }

                getCategories();
                setIsModalVisible(false);
                form.resetFields(); // Clear form fields
                setNewCategoryName('');
                setNewCategoryDescription(''); // Clear description state
                setNewCategoryHeader(null);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    messageApi.error(`Axios error: ${error.response?.data.message || error.message}`);
                } else {
                    messageApi.error(`Runtime error: ${error}`);
                }
                console.error('Error creating new category:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const showModal = () => {
        form.resetFields(); // Clear form fields when modal is opened
        setIsModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <Space direction={'vertical'} style={{ width: '100%' }}>
                <Space direction={'vertical'} style={{ width: '100%' }}>
                    {(isAdmin || isCommunityModerator) && (
                        <Button type={'primary'} onClick={showModal}>
                            Create new category
                        </Button>
                    )}
                    {Object.entries(categories).map(([header, categories]) => (
                        <ForumSectionCategory
                            key={header}
                            title={CategoryHeaders.optionsMap[header as ForumCategoryHeader]}
                            subcategories={categories}
                            refreshCategories={getCategories}
                        />
                    ))}
                </Space>
            </Space>
            <Modal
                title="Create New Category"
                open={isModalVisible}
                onOk={() => form.validateFields().then(handleCreateCategory)}
                onCancel={() => setIsModalVisible(false)}
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
                    <Form.Item
                        label="Category Header"
                        name="categoryHeader"
                        rules={[{ required: true, message: 'Category Header is required' }]}
                    >
                        <Select
                            value={newCategoryHeader}
                            onChange={value => setNewCategoryHeader(value as ForumCategoryHeader)}
                        >
                            {CategoryHeaders.allOptions.map(header => (
                                <Select.Option key={header} value={header}>
                                    {CategoryHeaders.optionsMap[header]}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}