'use client';
import React, { useEffect, useState } from 'react';
import { Card, List, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from "axios";
import { baseURL } from "@/lib/const";
import { Product } from "@/lib/redux/features/productManagment/productManagmentSlice";
import { useDispatch } from "@/lib/redux/store";
import { addProductToCart } from "@/lib/redux/features/cart/cartSlice";

// Assuming the structure of your Product type is known
interface ProductListProps {
    data: Product[];
    title: string;
}

const ProductPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [surprises, setSurprises] = useState<Product[]>([]);
    const [coffeeEquipments, setCoffeeEquipments] = useState<Product[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        try {
            const [productsResponse, recommendedResponse, bestSellersResponse, surprisesResponse, coffeeEquipmentResponse] = await Promise.all([
                axios.get<Product[]>(`${baseURL}/products`, { headers }),
                axios.get<Product[]>(`${baseURL}/recommended-products`, { headers }),
                axios.get<Product[]>(`${baseURL}/best-sellers`, { headers }),
                axios.get<Product[]>(`${baseURL}/surprises`, { headers }),
                axios.get<Product[]>(`${baseURL}/coffee-equipment`, { headers })
            ]);
            setProducts(productsResponse.data);
            setRecommendedProducts(recommendedResponse.data);
            setBestSellers(bestSellersResponse.data);
            setSurprises(surprisesResponse.data);
            setCoffeeEquipments(coffeeEquipmentResponse.data);
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            messageApi.error(err.response?.data?.message || 'Failed to fetch products');
        }
    };

    const renderProductList = ({ data, title }: ProductListProps) => (
        <Card title={title} style={{ maxWidth: 1500, width: '100%', marginTop: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <List
                grid={{ gutter: 4, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, xxl: 3 }}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card style={{ width: 180, margin: '0 10px' }}
                            // Assuming item has an 'image' property. Uncomment if true:
                            // cover={<img src={item.image} style={{ padding: '10px' }} />}
                        >
                            <strong>{item.name}</strong>
                            
                            <p>Price: ${item.price}</p>
                            <Button icon={<ShoppingCartOutlined />} type="primary" style={{ width: '100%' }} onClick={async () => {
                                const res = await dispatch(addProductToCart(item.id))
                                if (res.meta.requestStatus === "fulfilled") {
                                    messageApi.success("Added to Cart Successfully");
                                }
                            }}>
                                Add to Cart
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            {contextHolder}
            {renderProductList({ data: products, title: 'Products' })}
            {renderProductList({ data: recommendedProducts, title: 'Recommended Products' })}
            {renderProductList({ data: bestSellers, title: 'Best Seller' })}
            {renderProductList({ data: surprises, title: 'Surprise Me' })}
            {renderProductList({ data: coffeeEquipments, title: 'Coffee Equipment' })}
        </div>
    );
};

export default ProductPage;
