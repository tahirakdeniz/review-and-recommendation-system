'use client';

import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import { Typography } from "antd";
import ImageSide from "@/components/ImageSide";
import cafeImage from "@/assets/images/cafe.png";
const { Title, Text } = Typography;

// Define an interface for the form data
interface ForgotPasswordFormData {
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ForgotPassword() {
    const router = useRouter();

    const onFinish = ({ code, newPassword, confirmPassword }: ForgotPasswordFormData) => {
        // Logic to handle password reset request here
        console.log('Password reset process initiated with code:', code);
        // Optionally redirect user or display a confirmation message
    };

    return (
        <div className="flex flex-wrap">
            <ImageSide imageSrc={cafeImage.src} imageAlt="Coffee Shop" isImageOnRight={false}/>
            <div className="w-full max-w-md">
                <div className="text-center mb-8 my-4">
                    <Image src={Coffee.src} alt="Login" width={100} height={100}/>
                    <Title>Reset Your Password</Title>
                    <Text>
                        Enter the code sent to your email, and choose a new password.
                    </Text>
                </div>
                <Form
                    name="reset-password"
                    className="reset-password-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="code"
                        rules={[
                            { required: true, message: 'Please input the code sent to your email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Code"/>
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters.' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="New Password"/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                }
                            })
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirm New Password"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="reset-password-form-button" block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
