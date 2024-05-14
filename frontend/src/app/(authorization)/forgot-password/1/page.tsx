'use client';

import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import {Typography} from "antd";
import ImageSide from "@/components/ImageSide";
import cafeImage from "@/assets/images/cafe.png";
import LoginForm from "@/components/LoginForm";
const { Title, Text } = Typography;

// Define an interface for the form data
interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPassword() {
    const router = useRouter();

    const onFinish = ({ email }: ForgotPasswordFormData) => {
        // Logic to handle password reset request here
        console.log('Password reset email sent to:', email);
        // Optionally redirect user or display a confirmation message
    };

    return (
        <div className="flex flex-wrap">
            <ImageSide imageSrc={cafeImage.src} imageAlt="Coffee Shop" isImageOnRight={false}/>
            <div className="w-full max-w-md">
                <div className="text-center mb-8 my-4">
                    <Image src={Coffee.src} alt="Login" width={100} height={100}/>
                    <Title>ForgotPassword</Title>
                    <Text>
                        Please enter your email.
                    </Text>
                </div>
                <Form
                    name="forgot-password"
                    className="forgot-password-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true, message: 'Please input your Email!'},
                            {type: 'email', message: 'The input is not valid E-mail!'}
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="forgot-password-form-button" block>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
