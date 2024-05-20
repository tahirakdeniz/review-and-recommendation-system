'use client';

import React from 'react';
import {Button, Form, Input, message, Typography} from 'antd';
import {LockOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import axios from "axios";
import {baseURL} from "@/lib/const";

const { Title, Text } = Typography;

// Define an interface for the form data
interface ForgotPasswordFormData {
    otp: string;
    password: string;
    confirmPassword: string;
}

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async ({ otp, password, confirmPassword }: ForgotPasswordFormData) => {
        console.log({
            username: localStorage.getItem("FORGOT_PASSWORD_USERNAME"),
            password: password,
            otp: otp
        })
        setLoading(true);
        try {
            const response = await axios.put(`${baseURL}/password-reset`, {
                username: localStorage.getItem("FORGOT_PASSWORD_USERNAME"),
                password: password,
                otp: otp
            });

            if(response.status === 200){
                messageApi.success("Password reset link sent to your email.");
                router.push('/login');
            }
            else {
                messageApi.error("Failed to send password reset link.");
                console.error('An error occurred:', response.data.message || response.statusText);
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
                        name="otp"
                        rules={[
                            { required: true, message: 'Please input the code sent to your email!' }
                        ]}
                        style={{width: "100%"}}
                    >
                        <Input.OTP length={6} style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 8, message: 'Password must be at least 8 characters.' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="New Password"/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
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
                        <Button type="primary" htmlType="submit" className="reset-password-form-button" block loading={loading} disabled={loading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
