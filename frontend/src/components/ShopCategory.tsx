import {ProductDto} from "@/lib/dto";
import {Card, Col, Empty, Image, message, Row, Spin, Tooltip} from "antd";
import {HeartOutlined, LoadingOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import React from "react";
import {nameFormatter} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import ProductImageView from "@/components/ProductImageView";
import {useProductImage} from "@/lib/useProductImage";

type ShopCategoryProps = {
    title: string;
    data: ProductDto[];
    full?: boolean;
    categoryName?: string;
}

type ShopItemProps = {
    item: ProductDto;
}

export function ShopItem({item}: ShopItemProps){
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const {image, loading, error, noImage} = useProductImage(item.id);
    return (
        <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            {contextHolder}
            <Card
                type={'inner'}
                size={'small'}
                cover={
                    <div onClick={(e) => e.stopPropagation()} style={{overflow: "hidden", height: "150px"}}>
                        {loading ? (<div className={`flex items-center justify-center w-full h-full`}>
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                        </div>) :
                            (<Image
                            src={image || noImage}
                            alt={item.name}
                            style={{padding: '10px', height: "100%"}}
                            onClick={(e) => e.stopPropagation()}
                            preview={false}
                            loading={'lazy'}
                        />)}
                    </div>
                }
                actions={[
                    <Tooltip title="Add to Cart" key="cart">
                        <ShoppingCartOutlined
                            onClick={(e) => {
                                e.stopPropagation()
                                messageApi.success("Added to Cart Successfully");
                            }}
                        />
                    </Tooltip>,
                    <Tooltip title="Add to Wishlist" key="wishlist">
                        <HeartOutlined
                            onClick={(e) => {
                                e.stopPropagation()
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
    )
}

export default function ShopCategory({title, data, categoryName, full = false} :ShopCategoryProps){
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const displayedData = full ? data : data.slice(0, 6);
    const categoryTargetLabel = `/shop?category=${categoryName}`

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
                    {displayedData.map((item, index) => (
                        <ShopItem key={index} item={item}/>
                    ))}
                </Row>
            </Card>
        </>
    );
}