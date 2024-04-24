'use client';

import React, {useEffect} from "react";
import SignupFormHeader from "@/components/SignupFormHeader";
import {Form, Input, Button, Checkbox} from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import SignupStepper from "@/components/SignupStepper";
import {useDispatch, useSelector} from "react-redux";
import {setFields, setStep} from "@/lib/redux/features/signup/signupSlice";
import {useRouter} from "next/navigation";
import {RootState} from "@/lib/redux/store";

export default function Signup1() {
    const dispatch = useDispatch();
    const router = useRouter()
    const step = useSelector((state: RootState) => state.signup.step);

    useEffect(() => {
        if (step !== 0) router.push(`/signup/${step + 1}`); // Redirect to the correct step if the user has already completed this step
    }, [router, step]);

    const onFinish = ({username, password, email, isMerchant}: any) => {
        dispatch(setFields([
            {field: 'username', value: username},
            {field: 'password', value: password},
            {field: 'email', value: email},
            {field: 'role', value: isMerchant ? 'merchant' : 'user'} // TODO check for the role syntax for merchant
        ]));
        dispatch(setStep(1));
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
                <Form.Item
                    name='isMerchant'
                >
                    <Checkbox> I want to be merchant</Checkbox>
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
