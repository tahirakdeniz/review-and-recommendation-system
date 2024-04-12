'use client';
import React from "react";
import SignupFormHeader from "@/components/SignupFormHeader";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import SignupStepper from "@/components/SignupStepper";

export default function Signup1() {
    const onFinish = (values: any) => {
        console.log('Signup', values);
        // Add your signup logic here
    };

    return (
        <div className="w-full max-w-md">
            <SignupFormHeader/>
            <Form
                name="signup"
                className="signup-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your Email!' },
                        { type: 'email', message: 'The input is not valid E-mail!' }
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="signup-form-button" block>
                        Next
                    </Button>
                    Already have an account? <a href="/login">Log in now!</a>
                </Form.Item>
            </Form>
            <SignupStepper current={0}/>
        </div>
    );
}
