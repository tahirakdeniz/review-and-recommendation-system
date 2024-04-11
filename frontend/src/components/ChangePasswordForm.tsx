'use client';
import React from 'react';
import { Form, Input, Button, message } from 'antd';

const ChangePasswordForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('Password changed successfully');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="changePassword"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[{ required: true, message: 'Please input your current password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: 'Please input your new password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm New Password"
        name="confirmNewPassword"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your new password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordForm;
    