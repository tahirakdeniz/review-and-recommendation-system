'use client';

import React from 'react';
import {Form, Input, Button, message, Spin} from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import {Typography} from "antd";
import ImageSide from "@/components/ImageSide";
import cafeImage from "@/assets/images/cafe.png";
import LoginForm from "@/components/LoginForm";
import axios, {Axios} from "axios";
import {baseURL} from "@/lib/const";
const { Title, Text } = Typography;

// Define an interface for the form data
interface ForgotPasswordFormData {
    username: string;
}

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async ({ username }: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/password-reset/${username}`,);
            if(response.status === 201){
                messageApi.success("Password reset link sent to your email.");
                localStorage.setItem("FORGOT_PASSWORD_USERNAME", username);
                router.push('/forgot-password/2');
            }
            else {
                messageApi.error("Failed to send password reset link.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                messageApi.error(error.response?.data.message || error.message);
                console.error('An error occurred:', error.response?.data.message || error.message);
            }
            else{
                messageApi.error(`Failed to send password reset link.`);
                console.error('An error occurred:', error);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-wrap">
            {contextHolder}
            <div className="w-full max-w-md">
                <div className="text-center mb-8 my-4">
                    <Image src={Coffee.src} alt="Login" width={100} height={100}/>
                    <Title>Forgot Password</Title>
                    <Text>
                        Please enter your username.
                    </Text>
                </div>
                <Form
                    name="forgot-password"
                    className="forgot-password-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {required: true, message: 'Please input your Username!'},
                        ]}
                    >
                        <Input  placeholder="Username"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="forgot-password-form-button" block disabled={loading} loading={loading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
