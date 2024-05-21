import {ProductDto} from "@/lib/dto";
import {Card, Col, Empty, Image, message, Row, Tooltip} from "antd";
import {HeartOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import React from "react";
import {nameFormatter} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";

type ShopCategoryProps = {
    title: string;
    data: ProductDto[];
    full?: boolean;
    categoryName?: string;
}

export default function ShopCategory({title, data, categoryName, full = false} :ShopCategoryProps){
    const [messageApi, contextHolder] = message.useMessage();
    const [image, setImage] = React.useState<string>('');
    const router = useRouter();

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const displayedData = full ? data : data.slice(0, 6);
    const categoryTargetLabel = `/shop?category=${categoryName}`

    const getProfileImage = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Access token is missing');
            }
            const response = await fetch('http://localhost:8081/api/v1/products/23/picture', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Include the access token in the "Authorization" header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                throw new Error('Failed to fetch profile Image');
            }

            const imageArrayBuffer = await response.arrayBuffer();
            const imageData = new Uint8Array(imageArrayBuffer);
            const imageBlob = new Blob([imageData], {type: 'image/png'});
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl)
        } catch (error) {
            console.error('Error fetching images:', error);
        }

    }

    const getImage = (index: number) => {
        const imageBlob = new Blob([data[index].photo], {type: 'image/png'});
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
    }

    React.useEffect(() => {
        getProfileImage()
    }, []);

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
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Card
                                type={'inner'}
                                size={'small'}
                                cover={
                                    <div onClick={stopPropagation}>
                                        <Image
                                            src={getImage(index)}
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
                                                messageApi.success("Added to Cart Successfully");
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