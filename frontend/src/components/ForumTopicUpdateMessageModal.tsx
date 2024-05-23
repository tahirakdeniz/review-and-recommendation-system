import {Checkbox, Form, message, Modal} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";
import TextArea from "antd/es/input/TextArea";
import {PostDto} from "@/lib/dto";


interface UpdateMessageModal {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    refreshPosts: () => void;
    post: PostDto;
}

export const ForumTopicUpdateMessageModal: React.FC<UpdateMessageModal> = ({
                                                                                    isModalOpen,
                                                                                    setIsModalOpen,
                                                                                    refreshPosts,
                                                                                    post
                                                                                }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        form.setFieldsValue({
            content: post.content,
            isAnonymous: post.userDto.username === 'Anonymous'
        });
    }, [post]);

    const handleOk = () => {
        form.validateFields().then(updateMessage).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const updateMessage = async (values: { content: string; isAnonymous: boolean }) => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.put(`${baseURL}/posts/${post.id}`, {
                content: values.content,
                isAnonymous: values.isAnonymous,
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
        <Modal title="Write a Message" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               confirmLoading={loading}>
            {contextHolder}
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Message"
                    name="content"
                    rules={[{required: true, message: 'Please input the message content!'}]}
                >
                    <TextArea rows={12}/>
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