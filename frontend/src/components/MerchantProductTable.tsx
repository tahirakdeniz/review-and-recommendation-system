'use client'
import {Button, Input, Modal, Rate, Space, Table, TableColumnType} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {RootState, useDispatch} from "@/lib/redux/store";
import {
    deleteProduct,
    fetchProducts,
    Product,
    setProduct
} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {useSelector} from "react-redux";
import TextArea from "antd/es/input/TextArea";
import {useRouter} from "next/navigation";

interface MerchantProduct {
    key: string;
    name: string;
    sold: number;
    avgRate: number;
}

const data: MerchantProduct[] = [
    { key: '1', name: 'Product 1', sold: 110, avgRate: 1 },
    { key: '2', name: 'Product 2', sold: 99, avgRate: 4 },
    { key: '3', name: 'Product 3', sold: 621, avgRate: 2 },
    { key: '4', name: 'Product 4', sold: 12, avgRate: 1 },
    { key: '5', name: 'Product 5', sold: 53, avgRate: 5 },
    { key: '6', name: 'Product 6', sold: 32, avgRate: 4 },
    { key: '7', name: 'Product 7', sold: 110, avgRate: 1 },
    { key: '8', name: 'Product 8', sold: 99, avgRate: 4 },
    { key: '9', name: 'Product 9', sold: 621, avgRate: 2 },
    { key: '10', name: 'Product 10', sold: 12, avgRate: 1 },
    { key: '11', name: 'Product 11', sold: 53, avgRate: 5 },
    { key: '12', name: 'Product 12', sold: 32, avgRate: 4 },
    { key: '13', name: 'Product 13', sold: 110, avgRate: 1 },
    { key: '14', name: 'Product 14', sold: 99, avgRate: 4 },
    { key: '15', name: 'Product 15', sold: 621, avgRate: 2 },
    { key: '16', name: 'Product 16', sold: 12, avgRate: 1 },
    { key: '17', name: 'Product 17', sold: 53, avgRate: 5 },
    { key: '18', name: 'Product 18', sold: 32, avgRate: 4 },
];

// EditProductModal component
interface EditProductModalProps {
    isModalVisible: boolean;
    currentProduct?: Product;
    handleSave: () => void;
    handleCancel: () => void;
    handleChange: (product: Product) => void;
}

const MerchantEditProductModal: React.FC<EditProductModalProps> = ({ isModalVisible, currentProduct, handleSave, handleCancel, handleChange }) => {
    return (
        <Modal title={currentProduct ? "Edit Product" : "New Product"} visible={isModalVisible} onOk={handleSave} onCancel={handleCancel}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Product Name"
                    value={currentProduct?.name}
                    onChange={(e) => handleChange({...currentProduct!, name: e.target.value})}

                />
                <Input
                    prefix="$"
                    placeholder="Price"
                    type="number"
                    value={currentProduct?.price}
                    onChange={(e) => handleChange({...currentProduct!, price: parseInt(e.target.value, 10) || 0})}
                />
                <TextArea
                    rows={4}
                    placeholder="Product Description"
                    value={currentProduct?.description}
                    onChange={(e) => handleChange({...currentProduct!, description: e.target.value})}
                />
            </Space>
        </Modal>
    );
};

export default function MerchantProductTable() {
    const {products, loading, product, error, isModalVisible} = useSelector((state: RootState) => state.products)
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

    const showModal = (product: Product) => {
        setCurrentProduct(product);
    };

    const handleCancel = () => {
    };

    const handleSave = () => {
        console.log('Save product changes', currentProduct);
    };

    const handleChange = (product: Product) => {
        setCurrentProduct(product);
    };

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
                    <Button icon={<EditOutlined />} onClick={() => dispatch(setProduct(record))}>Edit</Button>
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

    return (
        <>
            <div className={'mb-2'}>
                <Button icon={<PlusOutlined />} onClick={() => dispatch(setProduct({
                        name: '',
                        description: '',
                        price: 0,
                    }
                ))}>Add New Product</Button>
            </div>
            <Table loading={loading} columns={columns} dataSource={products} pagination={{ pageSize: 5, position: ["bottomCenter"]}}/>
            <MerchantEditProductModal isModalVisible={isModalVisible} currentProduct={currentProduct} handleSave={handleSave} handleCancel={handleCancel} handleChange={handleChange} />
        </>
    );
}