import React, { useState } from "react";
import { Button, Card, Col, Modal, Row, Typography, Form, Input } from "antd";
import { reviewFormDtosExample } from "@/lib/examples/reviewFormDtosExample";
import AdministrationReviewForm from "@/components/AdministrationReviewForm";
import "@/styles/ReviewFields.css";
import { ReviewFormDto } from "@/lib/dto";
import { useImmer } from "use-immer";

export const AdministrationReviewFormSection = () => {
    const [reviewFormDtos, setReviewFormDtos] = useImmer<ReviewFormDto[]>([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();

    const getReviewForms = async () => {
        // TODO implement API call later
        setReviewFormDtos(reviewFormDtosExample);
    };

    React.useEffect(() => {
        getReviewForms();
    }, []);

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddOk = () => {
        // TODO implement API call to add new review form
        form.validateFields().then(values => {
            setReviewFormDtos(draft => {
                draft.push({ // todo change this to the actual API call
                    id: draft.length + 1, // This is a simple way to generate a new id
                    productCategoryDto: { id: 0, name: values.productCategory , description: ""},
                    reviewFieldDtos: [],
                });
            });
            setIsAddModalVisible(false);
            form.resetFields();
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const deleteReviewForm = (id: number) => {
        Modal.confirm({
            title: 'Delete Field',
            content: 'Are you sure you want to delete this review form?',
            onOk() {
                setReviewFormDtos(draft => {
                    return draft.filter(form => form.id !== id);
                });
            },
        });
    };

    return (
        <>
            <Card
                title={<Typography.Title level={3}>Review Forms</Typography.Title>}
                extra={<Button type="primary" onClick={showAddModal}>Add New Form</Button>}
            >
                <Row gutter={16}>
                    {reviewFormDtos.map((form, index) => (
                        <Col key={index} span={5}>
                            <AdministrationReviewForm data={form} onChange={(value) => {
                                console.log(JSON.stringify(value));
                            }} onDelete={() => deleteReviewForm(form.id)} />
                        </Col>
                    ))}
                </Row>
            </Card>

            <Modal
                title="Add New Review Form"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="productCategory"
                        label="Product Category"
                        rules={[{ required: true, message: 'Please input the product category!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AdministrationReviewFormSection;