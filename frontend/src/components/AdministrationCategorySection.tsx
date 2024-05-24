import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {RootState, useDispatch} from '@/lib/redux/store';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/lib/redux/features/category/categorySlice';
import { ProductCategoryDto, ProductCategoryRequest } from '@/lib/dto';
import { Button, Card, Col, Form, Input, Modal, Row, Space, Typography, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { errorHandler } from '@/lib/utils';

const { Title } = Typography;

export default function AdministrationCategorySection() {
    const { categories, loading, error } = useSelector((state: RootState) => state.categories);
    const dispatch = useDispatch();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<ProductCategoryDto | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            messageApi.error(error);
        }
    }, [error]);

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const showEditModal = (category: ProductCategoryDto) => {
        form.setFieldsValue({ name: category.name, description: category.description });
        setCurrentCategory(category);
        setIsEditModalVisible(true);
    };

    const handleAddOk = () => {
        form.validateFields().then(async values => {
            try {
                const res = await dispatch(addCategory(values as ProductCategoryRequest));
                if (res.meta.requestStatus === 'fulfilled'){
                    messageApi.success('Category added successfully');
                    setIsAddModalVisible(false);
                    location.reload();
                }
            } catch (error) {
                const errorMessage = errorHandler(error, 'Add Category');
                messageApi.error(errorMessage);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleEditOk = () => {
        form.validateFields().then(async values => {
            try {
                if (currentCategory) {
                    const res = await dispatch(updateCategory({ id: currentCategory.id, categoryRequest: values as ProductCategoryRequest }));
                    if (res.meta.requestStatus === 'fulfilled'){
                        messageApi.success('Category updated successfully');
                        setIsEditModalVisible(false);
                        setCurrentCategory(null);
                        location.reload();
                    }
                }
            } catch (error) {
                const errorMessage = errorHandler(error, 'Update Category');
                messageApi.error(errorMessage);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleDeleteCategory = async (id: number) => {
        Modal.confirm({
            title: 'Delete Category',
            content: 'Are you sure you want to delete this category?',
            onOk: async () => {
                try {
                    const res = await dispatch(deleteCategory(id));
                    if (res.meta.requestStatus === 'fulfilled'){
                        messageApi.success('Category deleted successfully');
                        location.reload();
                    }
                } catch (error) {
                    const errorMessage = errorHandler(error, 'Delete Category');
                    messageApi.error(errorMessage);
                }
            },
        });
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setCurrentCategory(null);
    };

    return (
        <>
            {contextHolder}
            <Card title={<Title level={3}>Administration Category Section</Title>} extra={<Button type="primary" onClick={showAddModal}><PlusOutlined /> Add Category</Button>}>
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]} >
                        {categories.map(category => (
                            <Col key={category.id} span={8}>
                                <Card
                                    actions={[
                                        <EditOutlined key="edit" onClick={() => showEditModal(category)} />,
                                        <DeleteOutlined key="delete" onClick={() => handleDeleteCategory(category.id)} />,
                                    ]}
                                >
                                    <Card.Meta title={category.name} description={category.description} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </Card>

            <Modal
                title="Add New Category"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Category Description"
                        rules={[{ required: true, message: 'Please input the category description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Category"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Category Description"
                        rules={[{ required: true, message: 'Please input the category description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
