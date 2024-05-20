import {ProductDto} from "@/lib/dto";
import {Card, Col, Empty, Image, message, Row, Tooltip} from "antd";
import {HeartOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import React, { useEffect } from "react";
import {nameFormatter} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { RootState, useDispatch } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import {addProductToCart} from "@/lib/redux/features/cart/cartSlice";

type ShopCategoryProps = {
    title: string;
    data: ProductDto[];
    full?: boolean;
    categoryName?: string;
}

export default function ShopCategory({title, data, categoryName, full = false} :ShopCategoryProps){
    const [messageApi, contextHolder] = message.useMessage();
    const {loading: addToCartLoading, error: addToCartError} = useSelector((state: RootState) => state.cart);
    const router = useRouter();
    const dispatch = useDispatch();

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const displayedData = full ? data : data.slice(0, 6);
    const categoryTargetLabel = `/shop?category=${categoryName}`

    async function handleAddToCart(productId:number) {
        const res = await dispatch(addProductToCart(productId));
        if (res.meta.requestStatus === 'fulfilled') {
            message.success('Product added to cart successfully');
        }
    }

    useEffect(() => {
        if (addToCartError) {
            message.error('Failed to add product to cart');
        }
    }, [addToCartError]);

    return (
        <>
            {contextHolder}
            <Card
                title={title}
                style={{ width: '100%', marginTop: '20px' }}
                size='default'
                extra={!full && <Link href={categoryTargetLabel}>More</Link>}
            >
                {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No products found."}/>}
                <Row gutter={[16, 16]}>
                    {displayedData.map(item => (
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Card
                                type={'inner'}
                                size={'small'}
                                cover={
                                    <div onClick={stopPropagation}>
                                        <Image
                                            src={'https://cdn.pixabay.com/photo/2023/08/25/10/33/apples-8212695_1280.jpg'}
                                            alt={item.name}
                                            style={{ padding: '10px' }}
                                            onClick={stopPropagation}
                                        />
                                    </div>
                                }

                                actions={[
                                    <Tooltip title="Add to Cart" key="cart">
                                        <ShoppingCartOutlined
                                            onClick={(e) => {
                                                stopPropagation(e);
                                                handleAddToCart(item.id)
                                            }}
                                        />
                                    </Tooltip>,
                                    <Tooltip title="Add to Wishlist" key="wishlist">
                                        <HeartOutlined
                                            onClick={(e) => {
                                                stopPropagation(e);
                                                messageApi.success("Added to Wishlist Successfully");
                                            }}
                                        />
                                    </Tooltip>,
                                ]}
                                hoverable
                                onClick={() => router.push(`/shop/product/${item.id}`)} // TODO if no child that has on click, run this.
                            >
                                <Card.Meta
                                    description={`$${item.price}`}
                                    title={
                                    nameFormatter(item.name)}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </>
    );
}