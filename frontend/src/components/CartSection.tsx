'use client';

import {Button, Card, Col, message, Modal, Row} from "antd";
import CartItem from "@/components/CartItem";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useGetCartItemsQuery} from "@/lib/redux/features/cart/cartApi";
import {useEffect, useState} from "react";
import {RootState, useDispatch} from "@/lib/redux/store";
import {buyProduct, fetchCart} from "@/lib/redux/features/cart/cartSlice";
import {useSelector} from "react-redux";
import {Product} from "@/lib/types";
import {ICartItem} from "@/lib/entity/CartItem";
import {Simulate} from "react-dom/test-utils";


export default function CartSection(){
    const [modal, contextHolder] = Modal.useModal();
    const {cart, error} = useSelector((state: RootState) => state.cart);
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);
    const dispatch = useDispatch();
    const [messageApi, messageContextHolder] = message.useMessage();

    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch]);

    useEffect(() => {
        if(cart)
        {
            setCartItems(cart.cartItemDtos)
        }
    }, [cart]);

    useEffect(() => {
        if(error){
            messageApi.error(error)
        }
    }, [error]);

    // const products = data?.items || [ // TODO delete temporary data
    //     {
    //         name: 'Doğu Timor',
    //         image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
    //         rating: 4.3,
    //         price: 11,
    //         count: 1,
    //     },
    //     {
    //         name: 'Doğu Timor',
    //         image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
    //         rating: 4.3,
    //         price: 10,
    //         count: 2,
    //     },
    //     {
    //         name: 'Doğu Timor v2',
    //         image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
    //         rating: 4.3,
    //         price: 990,
    //         count: 10,
    //     },
    //     {
    //         name: 'Doğu Timor',
    //         image: 'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg',
    //         rating: 4.3,
    //         price: 10,
    //         count: 20,
    //     },
    // ];

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
            {messageContextHolder}
            {contextHolder}
            <Col className={'gutter-row'} span={20}>
                <Card title="Shopping Cart">
                    <Row gutter={[16, 16]}>
                        {cartItems?.map((cartItem, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                <CartItem name={cartItem.productDto.name}
                                          id={cartItem.productDto.id}
                                          count={cartItem.quantity}
                                          image={'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg'}
                                          price={cartItem.productDto.price}
                                          rating={5} />
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Col>
            <Col span={4}>
                <Card
                    actions={[
                        <Button key="Buy" type="link" onClick={async () => {
                            await dispatch(buyProduct())
                        }}>Buy</Button>,
                        <Button key="Clear" type="link" danger>Clear</Button>
                    ]}
                >
                    <p>Total: {cart?.totalPrice}</p>
                </Card>
            </Col>
        </Row>
    );
}