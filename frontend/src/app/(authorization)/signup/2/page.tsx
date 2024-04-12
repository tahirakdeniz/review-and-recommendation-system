'use client'
import React from "react";
import { Form, Input, Button, DatePicker } from "antd";
import moment from 'moment';
import SignupFormHeader from "@/components/SignupFormHeader";
import SignupStepper from "@/components/SignupStepper";

export default function Signup2(){
    function onFinish() {
        console.log('Signup')
    }

    return (
        <div className="w-full max-w-md">
            <SignupFormHeader/>
            <Form
                name="signup_step2"
                onFinish={onFinish}
                initialValues={{
                    dob: moment(),
                }}
            >
                <Form.Item
                    name="name"
                    rules={[{required: true, message: 'Please input your name!'}]}
                >
                    <Input placeholder="Name"/>
                </Form.Item>
                <Form.Item
                    name="surname"
                    rules={[{required: true, message: 'Please input your surname!'}]}
                >
                    <Input placeholder="Surname"/>
                </Form.Item>
                <Form.Item
                    name="dob"
                    rules={[{required: true, message: 'Please select your date of birth!'}]}
                >
                    <DatePicker
                        style={{width: '100%'}}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
            <SignupStepper current={1}/>
        </div>
    );
}