'use client';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import { Typography } from 'antd';

const { Title , Text} = Typography;
interface LoginFormProps {
}

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

const LoginForm: React.FC<LoginFormProps> = () => {
    const onLogin: () => void = () => {
        console.log('Login')
    }
    const onFinish = (values: any) => {
        onLogin();
    };

    return (
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-screen">
            <div className="w-full max-w-md">
                <LoginFormHeader />
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <a className="login-form-forgot" href="/forgot-password">
                            Forgot password?
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" block>
                            Log in
                        </Button>
                        Or <a href="/signup">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default LoginForm;