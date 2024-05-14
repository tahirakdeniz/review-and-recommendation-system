'use client';
import React, { useState } from 'react';
import { Card, Carousel, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation'

// Mock data for demonstration purposes
const exampleProducts = [
    { id: '1', name: 'Coffee Maker', price: '99.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '2', name: 'Espresso Machine', price: '189.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '3', name: 'French Press', price: '29.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '4', name: 'Coffee Grinder', price: '75.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '5', name: 'Kettle', price: '43.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '6', name: 'Tea Infuser', price: '13.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '7', name: 'Travel Mug', price: '22.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '8', name: 'Thermos', price: '19.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '9', name: 'Ceramic Dripper', price: '17.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' },
    { id: '10', name: 'Filter Paper', price: '4.99', image: 'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg' }
];

interface Product {
    id: string;
    name: string;
    price: string;
    image?: string;
}

interface ProductListProps {
    data: Product[];
    title: string;
}

const ProductPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const searchParams = useSearchParams();

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    console.log(search, category)

    // Using exampleProducts for all categories, just for display
    const [products, setProducts] = useState<Product[]>(exampleProducts);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(exampleProducts);
    const [bestSellers, setBestSellers] = useState<Product[]>(exampleProducts);
    const [surprises, setSurprises] = useState<Product[]>(exampleProducts);
    const [coffeeEquipments, setCoffeeEquipments] = useState<Product[]>(exampleProducts);

    const renderProductList = ({ data, title }: ProductListProps) => (
        <Card title={title} style={{ width: '100%', marginTop: '20px' }}>
            <Carousel arrows slidesToShow={5} slidesToScroll={5} infinite={false}>
                {data.map(item => (
                    <div key={item.id} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ width: 240 }}
                              cover={<img src={item.image} alt={item.name} style={{ padding: '10px' }} />}
                        >
                            <strong>{item.name}</strong>
                            <p>Price: ${item.price}</p>
                            <Button icon={<ShoppingCartOutlined />} type="primary" style={{ width: '100%' }} onClick={() => {
                                messageApi.success("Added to Cart Successfully");
                            }}>
                                Add to Cart
                            </Button>
                        </Card>
                    </div>
                ))}
            </Carousel>
        </Card>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            {contextHolder}
            {renderProductList({ data: products, title: 'Products' })}
            {renderProductList({ data: recommendedProducts, title: 'Recommended Products' })}
            {renderProductList({ data: bestSellers, title: 'Best Sellers' })}
            {renderProductList({ data: surprises, title: 'Surprise Me' })}
            {renderProductList({ data: coffeeEquipments, title: 'Coffee Equipment' })}
        </div>
    );
};

export default ProductPage;