'use client';
import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UserInfo } from '@/lib/types';
import { UploadChangeParam } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';

interface EditProfileModalProps {
  userInfo: UserInfo;
  isModalVisible: boolean;
  handleOk: (userInfo: UserInfo) => void;
  handleCancel: () => void;
}

const customRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const beforeUpload = (file: File) => {
  return new Promise<boolean>((resolve, reject) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!').then(() => reject());
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!').then(() => reject());
      return;
    }
    resolve(true);
  });
};

const getBase64 = (img: File, callback: (imageUrl: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ userInfo, isModalVisible, handleOk, handleCancel }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as File, imageUrl => {
        form.setFieldsValue({ avatar: imageUrl });
        setUploading(false);
      });
    }
  };

  const onSave = () => {
    form.validateFields().then(values => {
      handleOk(values as UserInfo);
    });
  };

  return (
      <Modal title="Edit Profile" open={isModalVisible} onOk={onSave} onCancel={handleCancel} footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          Save
        </Button>,
      ]}>
        <Form form={form} layout="vertical" initialValues={userInfo}>
          <Form.Item label="Avatar" name="avatar">
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={customRequest}
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
            >
              {userInfo.avatar ? <img src={userInfo.avatar} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: 'Please input your current password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: 'Please input your new password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm New Password" name="confirmNewPassword" dependencies={['newPassword']} rules={[
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
          ]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default EditProfileModal;
