'use client'

import React, {useEffect} from "react";
import {Form, Input, Button, DatePicker, message, DatePickerProps} from "antd";
import moment from 'moment';
import SignupFormHeader from "@/components/SignupFormHeader";
import SignupStepper from "@/components/SignupStepper";
import {useSelector} from "react-redux";

import {RootState, useDispatch} from "@/lib/redux/store";
import {useRouter} from "next/navigation";
import {
    registerFailure,
    registerStart,
    registerSuccess,
    setFields, setStep
} from "@/lib/redux/features/signup/signupSlice";
import {confirmUser, registerUser} from "@/lib/redux/features/signup/signupThunks";

export default function Signup2(){
    const dispatch = useDispatch();
    const step = useSelector((state : RootState) => state.signup.step);
    const loading = useSelector((state: RootState) => state.signup.loading);
    const error = useSelector((state: RootState) => state.signup.error);
    const userRegistrationData = useSelector((state :RootState) => state.signup.userRegistrationData);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if(error !== null){
            console.error(error)
            messageApi.error(error);
        }
    }, [error, messageApi]);

    useEffect(() => {
        if (step !== 1) router.push(`/signup/${step + 1}`); // Redirect to the correct step if the user has already completed this step
    }, [router, step]);

    const onFinish = async ({name, surname, dob}: any) => {
        dispatch(setFields([
            {field: 'first_name', value: name},
            {field: 'last_name', value: surname},
            {field: 'date_of_birth', value: dob.format('YYYY-MM-DD')}
        ]));
        const res = await dispatch(confirmUser());
        console.log(res)
        if(res.meta.requestStatus == "fulfilled"){
            messageApi.success("OTP sent successfully.");
            dispatch(setStep(2))
        }
    };

    return (
        <div className="w-full max-w-md">
            {contextHolder}
            <SignupFormHeader/>
            <Form
                name="signup_step2"
                onFinish={onFinish}
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
                    rules={[
                        { required: true, message: 'Please select your date of birth!' },
                        () => ({
                            validator(_, value) {
                                if (!value || value.isBefore(moment(), 'day')) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Date of birth cannot be in the future'));
                            }
                        })
                    ]}
                >
                    <DatePicker
                        style={{width: '100%'}}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
            <SignupStepper current={1}/>
        </div>
    );
}