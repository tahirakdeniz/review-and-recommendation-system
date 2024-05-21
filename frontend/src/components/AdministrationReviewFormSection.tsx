import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row, Typography, message, Spin, Select } from "antd";
import { reviewFormDtosExample } from "@/lib/examples/reviewFormDtosExample";
import AdministrationReviewForm from "@/components/AdministrationReviewForm";
import "@/styles/ReviewFields.css";
import {ProductCategoryDto, ReviewFormDto} from "@/lib/dto";
import { useImmer } from "use-immer";
import axios, { AxiosError } from 'axios';
import { errorHandler } from "@/lib/utils";
import {baseURL} from "@/lib/const"; // Ensure this path is correct

export const AdministrationReviewFormSection = () => {
    const [reviewFormDtos, setReviewFormDtos] = useImmer<ReviewFormDto[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [productCategories, setProductCategories] = useState<ProductCategoryDto[]>([]);


    const getReviewForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get<ReviewFormDto[]>(`${baseURL}/reviews`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setReviewFormDtos(response.data);
            messageApi.success("Review forms fetched successfully");
        } catch (error) {
            const errorMessage = errorHandler(error, 'Get Review Forms');
            messageApi.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const getProductCategories = async () => {
        try {
            const response = await axios.get<ProductCategoryDto[]>(`${baseURL}/product-categories/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setProductCategories(response.data);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Get Product Categories');
            messageApi.error(errorMessage);
        }
    };

    React.useEffect(() => {
        getReviewForms();
        getProductCategories();
    }, []);

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddOk = () => {
        form.validateFields().then(async values => {
            setLoading(true);
            try {
                const response = await axios.post(`${baseURL}/reviews`, {
                    productCategoryName: values.productCategory,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                setReviewFormDtos(draft => {
                    draft.push({
                        id: response.data.id,
                        productCategoryDto: { id: response.data.productCategoryDto.id, name: values.productCategory , description: ""},
                        reviewFieldDtos: [],
                    });
                });
                messageApi.success("Review form added successfully");
                setIsAddModalVisible(false);
                form.resetFields();
            } catch (error) {
                const errorMessage = errorHandler(error, 'Add Review Form');
                messageApi.error(errorMessage);
            } finally {
                setLoading(false);
                getReviewForms();
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const deleteReviewForm = async (id: number) => {
        Modal.confirm({
            title: 'Delete Field',
            content: 'Are you sure you want to delete this review form?',
            onOk: async () => {
                setLoading(true);
                try {
                    await axios.delete(`${baseURL}/reviews/form/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });

                    setReviewFormDtos(draft => {
                        return draft.filter(form => form.id !== id);
                    });
                    messageApi.success("Review form deleted successfully");
                } catch (error) {
                    const errorMessage = errorHandler(error, 'Delete Review Form');
                    messageApi.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return (
        <>
            {contextHolder}
            <Card
                title={<Typography.Title level={3}>Review Forms</Typography.Title>}
                extra={<Button type="primary" onClick={showAddModal}>Add New Form</Button>}
            >
                <Spin spinning={loading}>
                    <Row gutter={16}>
                        {Array.isArray(reviewFormDtos) && reviewFormDtos.map((form, index) => (
                            <Col key={index} span={5}>
                                <AdministrationReviewForm data={form} onChange={(value) => {
                                    console.log(JSON.stringify(value));
                                }} onDelete={() => deleteReviewForm(form.id)} fetchReviewForms={getReviewForms}/>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </Card>

            <Modal
                title="Add New Review Form"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="productCategory"
                        label="Product Category"
                        rules={[{ required: true, message: 'Please input the product category!' }]}
                    >
                        <Select
                            placeholder="Select a product category"
                            options={productCategories.map(category => ({
                                label: category.name,
                                value: category.name,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default AdministrationReviewFormSection;
