'use client';

import React, {useEffect, useState} from "react";
import SignupFormHeader from "@/components/SignupFormHeader";
import {Button, Checkbox, Form, Input} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import SignupStepper from "@/components/SignupStepper";
import {useDispatch, useSelector} from "react-redux";
import {setFields, setStep} from "@/lib/redux/features/signup/signupSlice";
import {useRouter} from "next/navigation";
import {RootState} from "@/lib/redux/store";

export default function Signup1() {
    const [isMerchant, setIsMerchant] = useState<boolean>(true);
    const dispatch = useDispatch();
    const router = useRouter()
    const step = useSelector((state: RootState) => state.signup.step);

    useEffect(() => {
        if (step !== 0) router.push(`/signup/${step + 1}`); // Redirect to the correct step if the user has already completed this step
    }, [router, step]);

    const onFinish = ({username, password, email}: any) => {
        dispatch(setFields([
            {field: 'username', value: username},
            {field: 'password', value: password},
            {field: 'email', value: email},
            {field: 'role', value: isMerchant ? 'MERCHANT' : 'USER'}
        ]));
        dispatch(setStep(1));
    };

    return (
        <div className="w-full max-w-md">
            <SignupFormHeader/>
            <Form
                name="signup"
                className="signup-form"
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
                    rules={[
                        { required: true, message: 'Please input your Password!' },
                        () => ({
                            validator(_, value) {
                                if (value.length >= 8) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The password that you entered has should be more than 8 characters!'));
                            },
                        }),
                    ]}
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
                <Form.Item
                    name='isMerchant'
                >
                    <Checkbox onChange={(e) => setIsMerchant(e.target.checked)}> I want to be merchant</Checkbox>
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
