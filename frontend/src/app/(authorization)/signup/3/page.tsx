'use client';
import React, {useEffect} from "react";
import {Button, Form, GetProp, Input, message} from "antd";
import SignupFormHeader from "@/components/SignupFormHeader";
import SignupStepper from "@/components/SignupStepper";
import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import {useRouter} from "next/navigation";
import {resetSignup, setFields} from "@/lib/redux/features/signup/signupSlice";
import {confirmUser, registerUser} from "@/lib/redux/features/signup/signupThunks";
import {loginUser} from "@/lib/redux/features/login/loginSlice";

const OTPInputLength = 6;

export default function Signup3() {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const step = useSelector((state: RootState) => state.signup.step);
    const router = useRouter();
    const loading = useSelector((state: RootState) => state.signup.loading);
    const error = useSelector((state: RootState) => state.signup.error);
    const [otp, setOTP] = React.useState<string>('');

    useEffect(() => {
        if(error !== null){
            console.error(error)
            messageApi.error(error);
        }
    }, [messageApi, error]);

    // useEffect(() => {
    //     console.log(step)
    //     if(step == 3) {
    //         messageApi.success(" Has Completed"); // TODO look at its ui.
    //         // after 1 second redirect to the login page.
    //     }
    //     else if (step !== 2) {
    //         router.push(`/signup/${step + 1}`);
    //     }// Redirect to the correct step if the user has already completed this step
    // }, [router, step]);

    const onFinish = async () => {
        dispatch(setFields([
            {field: 'otp', value: otp}
        ]));
        const res = await dispatch(registerUser());
        if(res.meta.requestStatus == "fulfilled"){
            messageApi.success("User Created Successfully");
            router.push('/login');
        }
    };

    async function handleResendClick() {
        await dispatch(confirmUser());
    }



    return (
        <div className="w-full max-w-md">
            {contextHolder}
            <SignupFormHeader/>
            <Form name="otp_form" onFinish={onFinish}>
                <Form.Item>
                    <Input.OTP length={6} onChange={(otp) => setOTP(otp)} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="dashed" onClick={handleResendClick} size='small' loading={loading} disabled={loading}>Resend OTP</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
                        Verify OTP
                    </Button>
                </Form.Item>
            </Form>
            <SignupStepper current={2}/>
        </div>
    );
}
