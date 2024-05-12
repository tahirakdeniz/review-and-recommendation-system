'use client';
import {Avatar, Button, Card, Col, Divider, Modal, Rate, Row, Space, Tooltip} from "antd";
import { Image } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import {useState} from "react";


interface ProductPageProps {
    productId: string;
}

function ProductRateModal(props: { open: boolean, onCancel: () => void}) {
    const rates = [
        {name: "Speed", rate: 3.5},
        {name: "Quality", rate: 4.5},
        {name: "Price", rate: 2.5},
    ]

    return <Modal
        open={props.open}
        title="Reviews"
        footer={null}
        onCancel={props.onCancel}
    >
        {rates.map((rate, index) => (
            <div key={index}>
                <h3>{rate.name}</h3>
                <Rate defaultValue={rate.rate}/>
                <span>{rate.rate}</span>
            </div>
        ))}
    </Modal>;
}

const ProductPage: React.FC<ProductPageProps> = ({productId}) => {
    const [openRateModal, setOpenRateModal] = useState(false);
    // Dummy product data, replace with your actual product data
    const product = {
        name: "Cofee",
        image: "https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg",
        price: 100,
        description: "Description",
        seller: "Seller",
        comments: [
            { id: 1, author: "Kullanıcı 1", content: "Yorum 1", datetime: "2024-04-23T12:00:00Z" },
            { id: 2, author: "Kullanıcı 2", content: "Yorum 2", datetime: "2024-04-23T12:00:00Z" }
        ],
        tag: "#coffeshop",
        rate: 3.6
    };

    return (
        <div style={{padding: '20px'}}>
            <ProductRateModal open={openRateModal} onCancel={() => setOpenRateModal(false)}/>
            <Card
                title={
                    <h1>
                        {product.name}
                    </h1>
                } extra={product.tag}>
                <Row gutter={[16, 16]} justify="center" align="top">
                    <Col xs={24} md={8}>
                        <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        <div>
                            <h2>Merchant: {product.seller}</h2>
                            <h2>Price: {product.price} TL</h2>
                            <Divider/>
                            <p>{product.description}</p>
                            <Rate disabled defaultValue={Math.round(product.rate)}/>
                            <Button type='link' onClick={() => setOpenRateModal(true)}> more </Button>
                            {product.rate}
                            <Divider/>
                            <div style={{textAlign: 'right'}}>
                                <Button type="primary" icon={<ShoppingCartOutlined/>}>Add to Cart</Button>{' '}
                                <Button type="default" icon={<HeartOutlined/>}>Add to Wishlist</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Divider/>
            <div style={{padding: '20px'}}>
                <h2>Reviews</h2>
            </div>
        </div>
    );
};

export default ProductPage