'use client';
import {Avatar, Button, Card, Col, Divider, Flex, Modal, Rate, Row, Space, Tooltip, Typography} from "antd";
import { Image } from 'antd';
import {ShoppingCartOutlined, HeartOutlined, StarOutlined} from '@ant-design/icons';
import {useState} from "react";
import {ProductDto} from "@/lib/entity/product";


interface ProductPageProps {
    product: ProductDto;
}

function ProductRateModal(props: { open: boolean, onCancel: () => void}) {
    const rates = [
        {name: "Speed", rate: 3.5},
        {name: "Quality", rate: 4.5},
        {name: "Price", rate: 2.5},
    ]

    return <Modal
        open={props.open}
        title="Reviews"
        footer={null}
        onCancel={props.onCancel}
    >
        {rates.map((rate, index) => (
            <div key={index}>
                <h3>{rate.name}</h3>
                <Rate defaultValue={rate.rate}/>
                <span>{rate.rate}</span>
            </div>
        ))}
    </Modal>;
}

const FieldRates = ({ fieldAverageScore }: {fieldAverageScore: number}) => {
    return (
        <div className="rateContainer">
            {Object.entries(fieldAverageScore).map(([field, score]) => (
                <div key={field} className="rateItem">
                    {field}: {score}
                </div>
            ))}
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({product}) => {

    const [openRateModal, setOpenRateModal] = useState(false);
    // Dummy product data, replace with your actual product data
    // const product = {
    //     name: "Cofee",
    //     image: "https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg",
    //     price: 100,
    //     description: "Description",
    //     seller: "Seller",
    //     comments: [
    //         { id: 1, author: "Kullanıcı 1", content: "Yorum 1", datetime: "2024-04-23T12:00:00Z" },
    //         { id: 2, author: "Kullanıcı 2", content: "Yorum 2", datetime: "2024-04-23T12:00:00Z" }
    //     ],
    //     tag: "#coffeshop",
    //     rate: 3.6
    // };

    return (
        <div style={{padding: '20px'}}>
            <ProductRateModal open={openRateModal} onCancel={() => setOpenRateModal(false)}/>
            <Card
                title={
                    <h1>
                        {product.name}
                    </h1>
                }
                extra={product.productCategoryName}
                // actions={[
                //     <Tooltip title="Add to Cart">
                //         <Button type="primary" icon={<ShoppingCartOutlined/>}/>
                //     </Tooltip>,
                //     <Tooltip title="Add to Wishlist">
                //         <Button type="default" icon={<HeartOutlined/>}/>
                //     </Tooltip>
                //
                // ]}
            >
                <Row gutter={[16, 16]} justify="center" align="top">
                    <Col xs={24} md={8}>
                        <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                            <Image
                                src={product.photo}
                                alt={product.name}
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        <div>
                            {/* TODO add field <h2>Merchant: {product.seller}</h2>*/}
                            <h2>Price: {product.price} $</h2>
                            <Divider/>
                            <p>{product.description}</p>
                            <Flex justify='flex-start' align='center' gap='small'>
                                <Rate disabled defaultValue={Math.round(product.reviewDto.averageScore/2)}/>
                                <Typography>{product.reviewDto.averageScore}</Typography>
                            </Flex>
                            <div className={'max-w-full'}>
                                <Flex justify='flex-start' align='center' gap='small'>
                                    {Object.entries(product.reviewDto.fieldAverageScore).map(([field, score], index) => (
                                        <>
                                            <Flex justify='flex-start' align='center' gap='small'>
                                                <Typography>{field}</Typography>
                                                <Rate allowHalf disabled defaultValue={product.reviewDto.averageScore/2}/>
                                                <Typography>{score}</Typography>
                                            </Flex>
                                        </>
                                    ))}
                                </Flex>
                            </div>
                            {/*<Button type='link' onClick={() => setOpenRateModal(true)}> more </Button>*/}
                            {/*{product.reviewDto.averageScore}*/}
                            <Divider/>

                        </div>
                    </Col>
                </Row>
                <Flex justify='flex-end' align='center' gap='small'>
                    <Button type="primary" icon={<ShoppingCartOutlined/>}>Add to Cart</Button>
                    <Button type="default" icon={<HeartOutlined/>}>Add to Wishlist</Button>
                    <Button type="default" icon={<StarOutlined />}>Rate</Button>
                </Flex>
                <Space direction={'horizontal'} >


                </Space>
            </Card>
            <Card title={"Reviews"}>
                {
                    product.reviewDto.reviews.map((review, index) => (
                        <Card key={index} style={{marginBottom: '10px'}}>
                            <Space direction="vertical">
                            <Space>
                                    <Avatar>{review.userDto.name[0]}</Avatar>
                                    <strong>{review.userDto.name}</strong>
                                </Space>
                                <Space>
                                    <Rate disabled defaultValue={review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length}/>
                                    <span>{review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length}</span>
                                </Space>
                                <Space direction="vertical">
                                    {review.fieldScoreDtos.map((field, index) => (
                                        <div key={index}>
                                            <strong>{field.reviewFieldDto.label}</strong>
                                            <Rate disabled defaultValue={field.score}/>
                                            <span>{field.score}</span>
                                        </div>
                                    ))}
                                </Space>
                                <Space>
                                    -- Mis gibi Comment --
                                </Space>
                            </Space>
                        </Card>
                    ))
                }
            </Card>

        </div>
    );
};

export default ProductPage