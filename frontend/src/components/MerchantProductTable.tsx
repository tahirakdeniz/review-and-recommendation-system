'use client'

import {Button, GetProp, Input, message, Modal, Rate, Space, Table, TableColumnType, Upload} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {RootState, useDispatch} from "@/lib/redux/store";
import {
    addProduct,
    deleteProduct,
    fetchProducts,
    Product, setEditingProduct, setEditModalOpen, setNewModalOpen, updateProduct
} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {useSelector} from "react-redux";
import TextArea from "antd/es/input/TextArea";
import {useRouter} from "next/navigation";
import {UploadChangeParam} from "antd/es/upload";
import {MerchantProductCategorySelect} from "@/components/MerchantProductCategory";

type FileType = File;

const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const MerchantAddNewProductModal = () => {
    const isNewModalOpen = useSelector((state: RootState) => state.products.isNewModalOpen);
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>()
    const [imageLoading, setImageLoading] = useState(false);
    const [imageURL, setImageURL] = useState<string>();
    const [messageApi, contextHolder] = message.useMessage();

    const addNewProduct = async () => {
        if(product){
            const res = await dispatch(addProduct(product))
            if(res.meta.requestStatus == "fulfilled") {
                messageApi.success("Product Added Successfully");
            }
        }
    }

    const handleCancel = () => {
        dispatch(setNewModalOpen(false))
    }

    const handleAvatarChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            setImageLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as File).then(base64 => setImageURL(base64));
            setProduct({...product!, image: info.file.originFileObj as File})
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const customRequest = ({ file, onSuccess }: any) => {
        onSuccess("ok");
    };

    return (
        <Modal title={"Add New Product"} open={isNewModalOpen} onOk={addNewProduct} onCancel={handleCancel}>
            {contextHolder}
            <Space direction="vertical" style={{ width: '100%' }}>
                {/*<Upload*/}
                {/*    name="avatar"*/}
                {/*    listType="picture-card"*/}
                {/*    className="avatar-uploader"*/}
                {/*    showUploadList={false}*/}
                {/*    customRequest={customRequest}*/}
                {/*    onChange={handleAvatarChange}*/}
                {/*>*/}
                {/*    {imageURL ? <img src={imageURL} alt="avatar" style={{ width: '100%' }} /> : uploadButton}*/}
                {/*</Upload>*/}
                <Input
                    placeholder="Product Name"
                    value={product?.name}
                    onChange={(e) => setProduct({...product!, name: e.target.value})}

                />
                <MerchantProductCategorySelect onChange={(value) => setProduct({...product!, productCategoryName: value})}/>
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
    )
}

const MerchantEditProductModal: React.FC = () => {
    const {isEditingModalOpen, editingProduct} = useSelector((state: RootState) => state.products);
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>()

    useEffect(() => {
        if(editingProduct){
            setProduct(editingProduct)
        }
    }, [editingProduct]);
    const handleOk = async () => {
        if(product)
            dispatch(updateProduct(product));
    }

    const handleCancel = () => {
        dispatch(setEditModalOpen(false))
    }

    return (
        <Modal title={"Edit Product"} open={isEditingModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Product Name"
                    value={product?.name}
                    onChange={(e) => setProduct({...product!, name: e.target.value})}

                />
                <MerchantProductCategorySelect value={product?.productCategoryName} onChange={(value) => setProduct({...product!, productCategoryName: value})}/>
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

export default function MerchantProductTable() {
    const {products, loading, error} = useSelector((state: RootState) => state.products)
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch]);

    useEffect(() => {
        if(!loading){
            console.log(products)
        }
    }, [loading, products]);

    useEffect(() => {
        console.log(error)
        messageApi.error(error)
    }, [messageApi, error]);

    const columns: TableColumnType<Product>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortDirections: ['descend', 'ascend'],
        },
        // {
        //     title: 'Average Rate',
        //     dataIndex: 'rate',
        //     key: 'avgRate',
        //     render: (avgRate: number) => <span><Rate disabled defaultValue={avgRate}/> {avgRate}</span>,
        //     sorter: (a, b) => a.rate - b.rate,
        //     sortDirections: ['descend', 'ascend'],
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => dispatch(setEditingProduct(record))}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => showDeletionProductConfirmationModal(record)}>Delete</Button>
                    <Button icon={<EyeOutlined />} onClick={() => {router.push(`/products/${record.id}`)}}>Go to Product</Button>
                </Space>
            ),
        },
    ];

    const showDeletionProductConfirmationModal = (record: Product) => {
        Modal.confirm({
            title: `Product name: ${record.name}`,
            content: 'Are you sure you want to delete product?',
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
            onOk:async () => {
                if(!record.id)
                    throw new Error('NO RECORD ID FOUND');
                else{
                    console.log(record.id)
                    await dispatch(deleteProduct(record.id))
                }
            },
        });
    }

    const role = localStorage.getItem("role");

    if(role != "MERCHANT"){
        return (
            <div>
                Not Allowed
            </div>
        )
    }

    return (
        <>
            {contextHolder}
            <div className={'mb-2'}>
                <Button icon={<PlusOutlined />} onClick={() => dispatch(setNewModalOpen(true))}>Add New Product</Button>
            </div>
            <Table loading={loading} columns={columns} dataSource={products} pagination={{ pageSize: 5, position: ["bottomCenter"]}}/>
            <MerchantAddNewProductModal/>
            <MerchantEditProductModal/>
        </>
    );
}