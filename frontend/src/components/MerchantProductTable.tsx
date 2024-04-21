'use client'
import {Button, Input, Modal, Rate, Space, Table, TableColumnType} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {useState} from "react";

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
    currentProduct: MerchantProduct | null;
    handleSave: () => void;
    handleCancel: () => void;
    handleChange: (product: MerchantProduct) => void;
}

const MerchantEditProductModal: React.FC<EditProductModalProps> = ({ isModalVisible, currentProduct, handleSave, handleCancel, handleChange }) => {
    return (
        <Modal title={currentProduct?.key === 'new' ? "Add New Product" : "Edit Product"} visible={isModalVisible} onOk={handleSave} onCancel={handleCancel}>
            <Input
                placeholder="Product Name"
                value={currentProduct?.name}
                onChange={(e) => handleChange({...currentProduct!, name: e.target.value})}
            />
            <Input
                placeholder="Sold Quantity"
                type="number"
                value={currentProduct?.sold}
                onChange={(e) => handleChange({...currentProduct!, sold: parseInt(e.target.value, 10) || 0})}
            />
            <Rate
                onChange={(value) => handleChange({...currentProduct!, avgRate: value})}
                value={currentProduct?.avgRate}
            />
        </Modal>
    );
};

export default function MerchantProductTable() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<MerchantProduct | null>(null);

    const showModal = (product: MerchantProduct) => {
        setCurrentProduct(product);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = () => {
        console.log('Save product changes', currentProduct);
        setIsModalVisible(false);
    };

    const handleChange = (product: MerchantProduct) => {
        setCurrentProduct(product);
    };

    const columns: TableColumnType<MerchantProduct>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            key: 'sold',
            sorter: (a, b) => a.sold - b.sold,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Average Rate',
            dataIndex: 'avgRate',
            key: 'avgRate',
            render: (avgRate: number) => <span><Rate disabled defaultValue={avgRate}/> {avgRate}</span>,
            sorter: (a, b) => a.avgRate - b.avgRate,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => showDeletionProductConfirmationModal(record)}>Delete</Button>
                    <Button icon={<EyeOutlined />} onClick={() => {}}>Go to Product</Button>
                </Space>
            ),
        },
    ];

    const showDeletionProductConfirmationModal = (record: MerchantProduct) => {
        Modal.confirm({
            title: `Product name: ${record.name}`,
            content: 'Are you sure you want to delete product?',
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
            onOk:() => deleteProduct(record.key),
        });
    }

    const deleteProduct = (key: string) => {
        console.log('Delete product', key);
        // Logic to delete product
    };

    return (
        <>
            <div className={'mb-2'}>
                <Button icon={<PlusOutlined />} onClick={() => showModal(data.find(d => d.key === 'new')!)}>Add New Product</Button>
            </div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5, position: ["bottomCenter"]}}/>
            <MerchantEditProductModal isModalVisible={isModalVisible} currentProduct={currentProduct} handleSave={handleSave} handleCancel={handleCancel} handleChange={handleChange} />
        </>
    );
}