'use client';

import {Button, Card, Col, Empty, message, Modal, Row, Spin} from "antd";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import {fetchWishlist, removeProductFromWishlist} from "@/lib/redux/features/wishlist/wishlistSlice";
import {WishListItemDto} from "@/lib/dto";
import {ExclamationCircleOutlined} from "@ant-design/icons";


export function WishlistClient() {
    const [modal, contextHolder] = Modal.useModal();
    const {wishlist, error, loading} = useSelector((state: RootState) => state.wishlist);
    const [wishlistItems, setWishlistItems] = useState<WishListItemDto[]>([]);
    const dispatch = useDispatch();
    const [messageApi, messageContextHolder] = message.useMessage();

    useEffect(() => {
        dispatch(fetchWishlist())
    }, [dispatch]);

    useEffect(() => {
        if (wishlist) {
            setWishlistItems(wishlist.wishListItemDtoList);
        }
    }, [wishlist]);

    useEffect(() => {
        if (error) {
            messageApi.error(error);
        }
    }, [error]);

    const confirmRemove = (productId: number) => {
        modal.confirm({
            title: 'Are you sure you want to remove this item from the wishlist?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes, remove',
            cancelText: 'Cancel',
            onOk: () => handleRemoveProduct(productId)
        });
    };

    const handleRemoveProduct = async (productId: number) => {
        try {
            const res = await dispatch(removeProductFromWishlist({id: productId}));
            if(res.meta.requestStatus === 'fulfilled')
                messageApi.success('Product removed from wishlist');
            else {
                messageApi.error('Failed to remove product from wishlist');
            }
        } catch (error) {
            messageApi.error(error.toString());
        }
    };

    return (
        <Row gutter={16} className={'w-full'}>
            {messageContextHolder}
            {contextHolder}
            <Col className={'gutter-row'} span={20}>
                <Card title="Wishlist">
                    <Row gutter={[16, 16]}>
                        {loading ? (
                            <Spin tip="Loading...">
                                <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                            </Spin>
                        ) : wishlistItems.length > 0 ? wishlistItems.map((wishlistItem, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                <Card
                                    cover={<img alt={wishlistItem.productDto.name} src={'https://cdn.pixabay.com/photo/2016/03/30/21/59/coffee-beans-1291656_1280.jpg'} />}
                                    actions={[
                                        <Button key="Remove" type="link" danger onClick={() => confirmRemove(wishlistItem.productDto.id)}>Remove</Button>,
                                    ]}
                                >
                                    <Card.Meta
                                        title={wishlistItem.productDto.name}
                                        description={`Price: ${wishlistItem.productDto.price}`}
                                    />
                                </Card>
                            </Col>
                        )) : (
                            <div className={'mx-auto'}>
                                <Empty description="No items in wishlist" />
                            </div>
                        )}
                    </Row>
                </Card>
            </Col>
        </Row>
    );
}
