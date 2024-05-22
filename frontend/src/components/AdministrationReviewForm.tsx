import React, {useState} from 'react';
import {Button, Card, Form, Input, List, message, Modal, Tooltip, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import {ReviewFormDto} from "@/lib/dto";
import {nameFormatter} from "@/lib/utils";
import "@/styles/ReviewFields.css";

interface AdminReviewFormProps {
    data: ReviewFormDto;
    onChange: (data: ReviewFormDto) => void;
    onDelete: (id: number) => void;
    fetchReviewForms: () => void;
}

const AdministrationReviewForm = ({ data, onChange, onDelete, fetchReviewForms}: AdminReviewFormProps) => {
    const accessToken = localStorage.getItem("accessToken");

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddOk = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await axios.put(
                `http://localhost:8081/api/v1/reviews/${data.id}`,
                {
                    ...values,
                    minScore: 1,
                    maxScore: 10,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            onChange({
                ...data,
                reviewFieldDtos: [...data.reviewFieldDtos, response.data],
            });
            message.success('New field added successfully');
            fetchReviewForms();
            setIsAddModalVisible(false);
        } catch (error) {
            message.error('Failed to add new field');
        }
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const showEditModal = (id: number) => {
        const fieldToEdit = data.reviewFieldDtos.find(field => field.id === id);
        if (fieldToEdit) {
            form.setFieldsValue({ label: fieldToEdit.label });
            setEditingFieldId(id);
            setIsEditModalVisible(true);
        }
    };

    const handleEditOk = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await axios.put(
                `http://localhost:8081/api/v1/reviews/${data.id}/fields/${editingFieldId}`,
                {
                    ...values,
                    minScore: 1,
                    maxScore: 10,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            onChange({
                ...data,
                reviewFieldDtos: data.reviewFieldDtos.map(field =>
                    field.id === editingFieldId ? response.data : field
                ),
            });
            message.success('Field updated successfully');
            fetchReviewForms();
            setIsEditModalVisible(false);
        } catch (error) {
            message.error('Failed to update field');
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const confirmDeleteField = (id: number) => {
        modal.confirm({
            title: 'Are you sure you want to delete this field?',
            onOk: () => deleteField(id),
            onCancel: () => {},
        });
    };

    const deleteField = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8081/api/v1/reviews/${data.id}/fields/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            onChange({
                ...data,
                reviewFieldDtos: data.reviewFieldDtos.filter(field => field.id !== id),
            });
            message.success('Field deleted successfully');
            fetchReviewForms();
        } catch (error) {
            message.error('Failed to delete field');
        }
    };

    return (
        <>
            <Card type="inner" title={nameFormatter(data.productCategoryDto.name)}
                  extra={
                      <div>
                          {/*<Tooltip key="delete" title="Delete">*/}
                          {/*    <Button type="text" icon={<DeleteOutlined />} onClick={() => onDelete(data.id)}/>*/}
                          {/*</Tooltip>*/}
                          <Tooltip key="add" title="Add New Field">
                              <Button type="text" icon={<PlusCircleOutlined />} onClick={showAddModal}/>
                          </Tooltip>
                      </div>
                  }
                  style={{height: '300px'}}
            >
                <div className="scrollable-container">
                    <List
                        dataSource={data.reviewFieldDtos}
                        renderItem={reviewField => (
                            <List.Item>
                                <Typography.Text>{reviewField.label}</Typography.Text>
                                <div>
                                    <Tooltip key="edit" title="Edit Field Name">
                                        <Button type="text" icon={<EditOutlined/>}
                                                onClick={() => showEditModal(reviewField.id)}/>
                                    </Tooltip>
                                    <Tooltip key="delete" title="Delete Field">
                                        <Button type="text" icon={<DeleteOutlined/>}
                                                onClick={() => confirmDeleteField(reviewField.id)}/>
                                    </Tooltip>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Card>

            <Modal title="Add New Field" open={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="label" label="Label" rules={[{ required: true, message: 'Please input the label!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Edit Field" open={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="label" label="Label" rules={[{ required: true, message: 'Please input the label!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {contextHolder}
        </>
    );
};

export default AdministrationReviewForm;
