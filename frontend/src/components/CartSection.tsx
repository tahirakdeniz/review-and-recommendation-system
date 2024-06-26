'use client';

import {Button, Card, Col, Empty, message, Modal, Row, Badge} from "antd";
import CartItem from "@/components/CartItem";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {RootState, useDispatch} from "@/lib/redux/store";
import {buyProduct, fetchCart} from "@/lib/redux/features/cart/cartSlice";
import {useSelector} from "react-redux";
import {ICartItem} from "@/lib/entity/CartItem";
import Result403 from "@/components/Result403";
import {fetchUser} from "@/lib/redux/features/user/userSlice";

export default function CartSection(){
    const [modal, contextHolder] = Modal.useModal();
    const {cart, error} = useSelector((state: RootState) => state.cart);
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);
    const dispatch = useDispatch();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {user} = useSelector((state: RootState) => state.user);

    const hasLoggedIn = user !== null || localStorage.getItem('accessToken') !== null;
    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch]);

    useEffect(() => {
        if(cart)
        {
            setCartItems(cart.cartItemDtos)
        }
    }, [cart]);

    // useEffect(() => {
    //     if(error){
    //         messageApi.error(error)
    //     }
    // }, [error]);

    const confirm = () => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Bla bla ...',
            okText: 'Ok',
            cancelText: 'Cancel',
        });
    };

    if(!hasLoggedIn){
        return (<Result403/>)
    }

    return (
        <Row gutter={16} className={'w-full'}>
            {messageContextHolder}
            {contextHolder}
            <Col className={'gutter-row'} span={20}>
                <Card title="Shopping Cart">
                    <Row gutter={[16, 16]}>
                        {cartItems.length > 0 ? cartItems?.map((cartItem, index) => (
                            <Col key={index} xs={24} sm={12} lg={8} xl={6}>
                                <CartItem name={cartItem.productDto.name}
                                          id={cartItem.productDto.id ? Number(cartItem.productDto.id) : 0}
                                          count={cartItem.quantity}
                                          price={cartItem.productDto.price}
                                          rating={5} />
                            </Col>
                        )) : (
                            <div className={'mx-auto'}>
                                <Empty />
                            </div>
                        )}
                    </Row>
                </Card>
            </Col>
            <Col span={4}>
                <Card
                    actions={[
                        <Button key="Buy" type="link" onClick={async () => {
                            const res = await dispatch(buyProduct(null))
                            if(res.meta.requestStatus === 'fulfilled'){
                                messageApi.success('Products bought successfully');
                                dispatch(fetchUser())
                            }
                            else {
                                messageApi.error(`Failed to buy products: ${res.payload}`);
                            }
                        }}>Buy</Button>,
                    ]}
                >
                    <p>Total: {cart?.totalPrice}</p>
                </Card>
            </Col>
        </Row>
    );
}
