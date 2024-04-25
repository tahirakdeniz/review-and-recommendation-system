'use client';
import React from 'react';
import { Card, List, Avatar, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const ProductPage: React.FC = () => {
    const products = [
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 11,
            id: 1,
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10,
            id: 2,
        },
        {
            name: 'Doğu Timor v2',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 990,
            id: 3,
        },
        {
            name: 'Doğu Timor',
            image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
            rating: 4.3,
            price: 10,
            id: 4,
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Card title="Products" style={{ maxWidth: 1500, width: '100%', marginTop: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <List
                    grid={{ gutter: 4, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, xxl: 3 }}
                    dataSource={products}
                    renderItem={item => (
                        <List.Item>
                            <Card style={{ width: 180, margin: '0 10px' }}
                                  cover={<img src={item.image} style={{ padding: '10px' }} />}
                            >
                                <strong>{item.name}</strong>
                                <p>Rating: {item.rating} ★</p>
                                <p>Price: ${item.price}</p>
                                <Button icon={<ShoppingCartOutlined />} type="primary" style={{ width: '100%' }}>
                                    Add to Cart
                                </Button>
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default ProductPage;
