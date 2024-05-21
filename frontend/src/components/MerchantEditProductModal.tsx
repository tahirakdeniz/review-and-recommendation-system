import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import React, {useEffect, useState} from "react";
import {Product, setEditModalOpen, updateProduct} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {Divider, Flex, Input, message, Modal, Space, Upload, UploadProps} from "antd";
import {MerchantProductCategorySelect} from "@/components/MerchantProductCategory";
import TextArea from "antd/es/input/TextArea";
import FormData from "form-data";
import axios from "axios";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {baseURL} from "@/lib/const";

type FileType = File;

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
        message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt1M;
};

export const MerchantEditProductModal: React.FC = () => {
    const {isEditingModalOpen, editingProduct} = useSelector((state: RootState) => state.products);
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>()
    const [messageApi, contextHolder] = message.useMessage()
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setProduct(editingProduct)
        }
    }, [editingProduct]);

    const handleOk = async () => {
        if (product) {
            const res = await dispatch(updateProduct(product));
            if (res.meta.requestStatus == "fulfilled") {
                messageApi.success("Edited Successfully.");
            }
        }
        setImageUrl(undefined)
    }

    const handleCancel = () => {
        dispatch(setEditModalOpen(false))
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setImageLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setImageLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Modal title={"Edit Product"} open={isEditingModalOpen} onOk={handleOk} onCancel={handleCancel}
               okButtonProps={{disabled:imageLoading}} cancelButtonProps={{disabled:imageLoading}} closable={false}>
            {contextHolder}
            <Space direction="vertical" style={{width: '100%'}}>
                <Flex justify={'center'} align={'center'}>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={async ({file, onSuccess, onError}) => {
                            const data = new FormData();
                            data.append('image', file);
                            const res = await axios.post(`${baseURL}/products/${product?.id}/image`, data, {
                                headers: {
                                    'Authorization':`Bearer ${localStorage.getItem('accessToken')} `,
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            if(res.status === 200){
                                onSuccess('ok')
                                messageApi.success('Image Uploaded Successfully')
                            }

                            if(product) {
                                dispatch(updateProduct(product))
                            }

                        }}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }}/> : uploadButton}
                    </Upload>
                </Flex>
                <Divider/>
                <Input
                    placeholder="Product Name"
                    value={product?.name}
                    onChange={(e) => setProduct({...product!, name: e.target.value})}

                />
                <MerchantProductCategorySelect value={product?.productCategoryName} onChange={(value) => setProduct({
                    ...product!,
                    productCategoryName: value
                })}/>
                <Input
                    prefix="$"
                    placeholder="Price"
                    type="number"
                    value={product?.price}
                    onChange={(e) => setProduct({...product!, price: parseInt(e.target.value, 10) || 0})}
                />
                <TextArea
                    rows={4}
                    placeholder="Product Description"
                    value={product?.description}
                    onChange={(e) => setProduct({...product!, description: e.target.value})}
                />
            </Space>
        </Modal>
    );
};