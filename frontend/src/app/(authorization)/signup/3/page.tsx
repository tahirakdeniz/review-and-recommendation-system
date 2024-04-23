'use client';
import React from "react";
import {Button, Form, GetProp, Input} from "antd";
import SignupFormHeader from "@/components/SignupFormHeader";
import SignupStepper from "@/components/SignupStepper";

const OTPInputLength = 6;

export default function Signup3() {
    const onFinish = () => {
        // Add OTP validation logic here
    };

    function handleResendClick() {
        console.log('Resend OTP');
    }

    const onChange: GetProp<typeof Input.OTP, 'onChange'> = (text) => {
        console.log('onChange:', text);
    };

    return (
        <div className="w-full max-w-md">
            <SignupFormHeader/>
            <Form name="otp_form" onFinish={onFinish}>
                <Form.Item>
                    <Input.OTP length={6} onChange={onChange} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="dashed" onClick={handleResendClick} size='small'>Resend OTP</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Verify OTP
                    </Button>
                </Form.Item>
            </Form>
            <SignupStepper current={2}/>
        </div>
    );
}
