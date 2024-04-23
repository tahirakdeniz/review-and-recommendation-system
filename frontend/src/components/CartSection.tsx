'use client';
import {Button, Card, Col, Modal, Row} from "antd";
import CartItem from "@/components/CartItem";
import {ExclamationCircleOutlined} from "@ant-design/icons";

export default function CartSection(){
    const [modal, contextHolder] = Modal.useModal();
    const products = [
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 11
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10
        },
        {
            name: 'Doğu Timor v2',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 990
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10
        },
    ];

    const confirm = () => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Bla bla ...',
            okText: 'Ok',
            cancelText: 'Cancel',
        });
    };

    return (
        <Row gutter={16} className={'w-full'}>
            <Col className={'gutter-row'} span={20}>
                <Card title="Shopping Cart">
                    <Row gutter={[16, 16]}>
                        {products.map((product, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                <CartItem {...product} />
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Col>
            <Col span={4}>
                <Card
                    actions={[
                        <Button key="Buy" type="link" >Buy</Button>,
                        <Button key="Clear" type="link" danger>Clear</Button>
                    ]}
                >
                    <p>Total: $31.00</p>
                    <p>Discount: $0.00</p>
                </Card>
            </Col>
        </Row>
    );
}