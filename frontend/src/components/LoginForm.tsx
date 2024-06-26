'use client';
import {Button, Form, Input, message, Typography} from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined} from '@ant-design/icons';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import {useSelector} from 'react-redux';
import {loginUser} from '@/lib/redux/features/login/loginSlice';
import {RootState, useDispatch} from '@/lib/redux/store';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {setHasLoggedIn} from "@/lib/redux/features/user/userSlice";

const { Title, Text } = Typography;


const LoginFormHeader: React.FC = () => {
    return (
        <div className="text-center mb-8">
            <Image src={Coffee.src} alt="Login" width={100} height={100} />
            <Title>Login</Title>
            <Text>
                Welcome back, coffee and tea lovers! Regardless of your role, you can log in here by entering your username and password.
            </Text>
        </div>
    );
};

const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { loading, error, accessToken } = useSelector((state: RootState) => state.login);
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        if (error) {
            message.error({
                type: 'error',
                content: `${error}`,
                duration: 3,
            });
            //dispatch(clearError());
        }
    }, [error, dispatch]);

    // useEffect(() => {
    //     if (accessToken) {
    //         router.push('/home');
    //     }
    // }, [accessToken, router]);

    const onFinish = async (values: { username: string; password: string }) => {
        const res = await dispatch(loginUser(values));
        if(res.meta.requestStatus == "fulfilled"){
            messageApi.success("Logged In Successfully");
            dispatch(setHasLoggedIn(true));
            router.push('/');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-screen">
            {contextHolder}
            <div className="w-full max-w-md">
                <LoginFormHeader />
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                            disabled={loading}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            disabled={loading}
                        />
                    </Form.Item>
                    <Form.Item>
                        <a className="login-form-forgot" href="/forgot-password/1">
                            Forgot password?
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            block
                            disabled={loading}
                        >
                            Log in
                        </Button>
                        Or <a href="/signup">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;