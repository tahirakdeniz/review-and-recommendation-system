import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '@/lib/const';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Typography, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { InteractionWeightDto, InteractionWeightRequest, InteractionWeightType } from '@/lib/dto';
import { Slider } from 'antd';
import { errorHandler } from '@/lib/utils';

const { Title } = Typography;
const { Option } = Select;

const AdministrationInteractionWeightSection = () => {
    const [interactionWeights, setInteractionWeights] = useState<InteractionWeightDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentWeight, setCurrentWeight] = useState<InteractionWeightDto | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchInteractionWeights = async () => {
        setLoading(true);
        try {
            const response = await axios.get<InteractionWeightDto[]>(`${baseURL}/recommendations`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setInteractionWeights(response.data);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Fetch Interaction Weights');
            setError(errorMessage);
            messageApi.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInteractionWeights();
    }, []);

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const showEditModal = (weight: InteractionWeightDto) => {
        form.setFieldsValue({ type: weight.type, weight: weight.weight });
        setCurrentWeight(weight);
        setIsEditModalVisible(true);
    };

    const handleAddOk = () => {
        form.validateFields().then(async values => {
            setLoading(true);
            try {
                const response = await axios.post<InteractionWeightDto>(`${baseURL}/recommendations`, values, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setInteractionWeights([...interactionWeights, response.data]);
                messageApi.success('Interaction weight added successfully');
                setIsAddModalVisible(false);
                form.resetFields();
            } catch (error) {
                const errorMessage = errorHandler(error, 'Add Interaction Weight');
                messageApi.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleEditOk = () => {
        form.validateFields().then(async values => {
            setLoading(true);
            try {
                if (currentWeight) {
                    const response = await axios.put<InteractionWeightDto>(`${baseURL}/recommendations/${currentWeight.id}`, values, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    setInteractionWeights(interactionWeights.map(weight => weight.id === currentWeight.id ? response.data : weight));
                    messageApi.success('Interaction weight updated successfully');
                    setIsEditModalVisible(false);
                    setCurrentWeight(null);
                }
            } catch (error) {
                const errorMessage = errorHandler(error, 'Update Interaction Weight');
                messageApi.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Delete Interaction Weight',
            content: 'Are you sure you want to delete this interaction weight?',
            onOk: async () => {
                setLoading(true);
                try {
                    await axios.delete(`${baseURL}/recommendations/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    setInteractionWeights(interactionWeights.filter(weight => weight.id !== id));
                    messageApi.success('Interaction weight deleted successfully');
                } catch (error) {
                    const errorMessage = errorHandler(error, 'Delete Interaction Weight');
                    messageApi.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setCurrentWeight(null);
    };

    return (
        <>
            {contextHolder}
            <Card title={<Title level={3}>Interaction Weights</Title>} extra={<Button type="primary" onClick={showAddModal}><PlusOutlined /> Add Weight</Button>}>
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                        {interactionWeights.map(weight => (
                            <Col key={weight.id} span={8}>
                                <Card
                                    actions={[
                                        <EditOutlined key="edit" onClick={() => showEditModal(weight)} />,
                                        <DeleteOutlined key="delete" onClick={() => handleDelete(weight.id)} />,
                                    ]}
                                >
                                    <Card.Meta title={weight.type} description={`Weight: ${weight.weight}`} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </Card>

            <Modal
                title="Add New Interaction Weight"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select the interaction type!' }]}
                    >
                        <Select placeholder="Select an interaction type">
                            {Object.values(InteractionWeightType).map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="weight"
                        label="Weight"
                        rules={[{ required: true, message: 'Please input the interaction weight!' }]}
                    >
                        <Slider min={1} max={100} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Interaction Weight"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select the interaction type!' }]}
                    >
                        <Select placeholder="Select an interaction type">
                            {Object.values(InteractionWeightType).map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="weight"
                        label="Weight"
                        rules={[{ required: true, message: 'Please input the interaction weight!' }]}
                    >
                        <Slider min={1} max={100} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AdministrationInteractionWeightSection;
