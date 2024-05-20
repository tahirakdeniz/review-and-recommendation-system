'use client';
import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import {UserInfo} from '@/lib/types';
import {UploadChangeParam} from 'antd/es/upload';
import {RootState, useDispatch} from "@/lib/redux/store";
import {useSelector} from "react-redux";
import {updateUser} from "@/lib/redux/features/user/userSlice";

interface EditProfileModalProps {
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

const EditProfileModal: React.FC<EditProfileModalProps> = ({isModalVisible, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    username: string,
    lastName: string,
    firstName: string
    description: string,
    dateOfBirth: string,
  } | null>(null);
  const [messageApi, contextHolder] = message.useMessage()


  useEffect(() => {
    setEditingUser(user)
  }, [user]);
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

  const onSave = async (value: any) => {
      if(editingUser){
        const res = await dispatch(updateUser({
          username: editingUser.username,
          lastName: editingUser.lastName,
          firstName: editingUser.firstName,
          description: editingUser.description,
          dateOfBirth: editingUser.dateOfBirth,
        }))
        if(res.meta.requestStatus == "fulfilled"){
          messageApi.success("Saved Successfully.");
          handleCancel()
        }
      }

  };

  if(!user){
    return
    (<>
      Loading...
      </>
    )
  }

  return (
      <Modal title="Edit Profile" open={isModalVisible} onOk={onSave} onCancel={handleCancel} footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={onSave}>
          Save
        </Button>,
      ]}>
        <Form form={form} layout="vertical" initialValues={{
          username: user.username,
          lastName: user.lastName,
          firstName: user.firstName,
          description: user.description,
          dateOfBirth: user.dateOfBirth,
        }}>
          {/*<Form.Item label="Avatar" name="avatar">*/}
          {/*  <Upload*/}
          {/*      name="avatar"*/}
          {/*      listType="picture-card"*/}
          {/*      className="avatar-uploader"*/}
          {/*      showUploadList={false}*/}
          {/*      customRequest={customRequest}*/}
          {/*      beforeUpload={beforeUpload}*/}
          {/*      onChange={handleAvatarChange}*/}
          {/*  >*/}
          {/*    {userInfo.avatar ? <img src={userInfo.avatar} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}*/}
          {/*  </Upload>*/}
          {/*</Form.Item>*/}
          <Form.Item label="Username" name="username">
            <Input value={ editingUser?.username} onChange={(e) => setEditingUser({...editingUser!, username: e.target.value })} disabled/>
          </Form.Item>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your firstname!' }]}>
            <Input value={ editingUser?.firstName} onChange={(e) => setEditingUser({...editingUser!, firstName: e.target.value })}/>
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your lastname!' }]}>
            <Input value={ editingUser?.lastName} onChange={(e) => setEditingUser({...editingUser!, lastName: e.target.value })}/>
          </Form.Item>
          <Form.Item label="Date Of Birth" name="dateOfBirth" rules={[{ required: true, message: 'Please input your dateOfBirth!' }]}>
            <Input value={ editingUser?.dateOfBirth} onChange={(e) => setEditingUser({...editingUser!, dateOfBirth: e.target.value })}/>
            {/*<DatePicker />*/}
          </Form.Item>
          <Form.Item label="Bio" name="description">
            <Input.TextArea value={ editingUser?.description} onChange={(e) => setEditingUser({...editingUser!, description: e.target.value })}/>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default EditProfileModal;
