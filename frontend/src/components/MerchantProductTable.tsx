'use client'

import {Button, message, Modal, Space, Table, TableColumnType, Upload, UploadProps} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect} from "react";
import {RootState, useDispatch} from "@/lib/redux/store";
import {
    deleteProduct,
    fetchProducts,
    Product,
    setEditingProduct,
    setNewModalOpen
} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import ProductImageView from "@/components/ProductImageView";
import {MerchantAddNewProductModal} from "@/components/MerchantAddNewProductModal";
import {MerchantEditProductModal} from "@/components/MerchantEditProductModal";

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
        if(error){
            messageApi.error(error)
        }
    }, [messageApi, error]);

    const columns: TableColumnType<Product>[] = [
        {
            title: "Image",
            key: "image",
            render: (_, record) => {
                return (
                    <ProductImageView productId={Number(record.id)} key={record.id} height={100}/>
                )
            }
        },
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
        // TODO Add this field to the Product type
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
                    <Button icon={<EyeOutlined />} onClick={() => {router.push(`shop/product/${record.id}`)}}>Go to Product</Button>
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
