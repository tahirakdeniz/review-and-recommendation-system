'use client';

import {Button, Card, Col, Empty, message, Modal, Row, Spin} from "antd";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import {fetchWishlist, removeProductFromWishlist} from "@/lib/redux/features/wishlist/wishlistSlice";
import {WishListItemDto} from "@/lib/dto";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import WishlistItem from "@/components/WishlistItem";
import Result403 from "@/components/Result403";


export function WishlistClient() {
    const [modal, contextHolder] = Modal.useModal();
    const {wishlist, error, loading} = useSelector((state: RootState) => state.wishlist);
    const [wishlistItems, setWishlistItems] = useState<WishListItemDto[]>([]);
    const dispatch = useDispatch();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {hasLoggedIn} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchWishlist())
    }, [dispatch]);

    useEffect(() => {
        if (wishlist) {
            setWishlistItems(wishlist.wishListItemDtoList);
        }
    }, [wishlist]);

    // useEffect(() => {
    //     if (error) {
    //         messageApi.error(error);
    //     }
    // }, [error]);

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
                messageApi.error(`Failed to remove product from wishlist: ${res.payload}`);
            }
        } catch (error) {
            console.error(error);
            messageApi.error(error.toString());
        }
    };

    if (!hasLoggedIn) {
        return (<Result403 />);
    }

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
                            <WishlistItem key={index} index={index} wishlistItem={wishlistItem} confirmRemove={confirmRemove} />
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
