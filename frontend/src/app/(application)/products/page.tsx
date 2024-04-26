'use client';
import React, {useEffect, useState} from 'react';
import {Card, List, Avatar, Button, message} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from "axios";
import {baseURL} from "@/lib/const";
import {Product} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {useDispatch} from "@/lib/redux/store";
import {addProductToCart} from "@/lib/redux/features/cart/cartSlice";

const ProductPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken'); // Get the access token from local storage
        const headers = {
            Authorization: `Bearer ${accessToken}` // Prepare the authorization header
        };

        try {
            const response = await axios.get(`${baseURL}/products`, { headers });
            setProducts(response.data); // Assuming the response has the data directly
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            messageApi.error(err.message || 'Failed to fetch categories'); // Using Ant Design's message component to show errors
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            {contextHolder}
            <Card title="Products" style={{ maxWidth: 1500, width: '100%', marginTop: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <List
                    grid={{ gutter: 4, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, xxl: 3 }}
                    dataSource={products}
                    renderItem={item => (
                        <List.Item>
                            <Card style={{ width: 180, margin: '0 10px' }}
                                  // cover={<img src={item.image} style={{ padding: '10px' }} />}
                            >
                                <strong>{item.name}</strong>
                                <p>Rating: {5} ★</p>
                                <p>Price: ${item.price}</p>
                                <Button icon={<ShoppingCartOutlined />} type="primary" style={{ width: '100%' }} onClick={async () => {
                                   const res = await dispatch(addProductToCart(item.id))
                                    if(res.meta.requestStatus == "fulfilled"){
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
        </div>
    );
};

export default ProductPage;
