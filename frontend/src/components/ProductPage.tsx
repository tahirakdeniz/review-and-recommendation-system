'use client';
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Flex,
    List,
    message,
    Modal,
    Rate,
    Row,
    Space,
    Tooltip,
    Typography
} from "antd";
import { Image } from 'antd';
import {ShoppingCartOutlined, HeartOutlined, StarOutlined} from '@ant-design/icons';
import {useState} from "react";
import {ProductDto, ProductReviewReviewDto} from "@/lib/entity/product";
import {useRole} from "@/lib/useRole";
import TextArea from "antd/es/input/TextArea";
import {baseURL} from "@/lib/const";

const { Text, Link , Title} = Typography;

interface ProductPageProps {
    product: ProductDto;
}

interface ProductRateModalProps {
    open: boolean;
    onClose: () => void;
    reviewFields: string[];
}
function ProductRateModal({ open, onClose, reviewFields} : ProductRateModalProps) {
    const rates = [
        {name: "Speed", rate: 3.5},
        {name: "Quality", rate: 4.5},
        {name: "Price", rate: 2.5},
    ]

    const saveRate = () => {
        {/*TODO: Implement rate saving*/}
        onClose();
    }

    return <Modal
        open={open}
        title={<Title level={3}>Rate Product</Title>}
        onCancel={onClose}
        onOk={saveRate}
    >
        {reviewFields.map((field, index) => (
            <div key={index}>
                <Title level={5}>{field}</Title>
                    <Rate/>
            </div>
        ))}
    </Modal>;
}

function ReplyModal({open, onClose} : {open: boolean, onClose: () => void}) {
    return <Modal
        open={open}
        title={<Title level={3}>Reply</Title>}
        onCancel={onClose}
        onOk={onClose}
    >
        <TextArea/>
    </Modal>;

}

const ProductPage: React.FC<ProductPageProps> = ({product}) => {

    const [openRateModal, setOpenRateModal] = useState(false);
    const [openReplyModal, setOpenReplyModal] = useState(false);

    const { isAuthorized: isMerchant, error: merchantError } = useRole({ role: 'Merchant' });
    const { isAuthorized: isAdmin, error: adminError } = useRole({ role: 'Admin' });

    const handleDelete = async (reviewId: number) => {
        try {
            const response = await fetch(`${baseURL}/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                message.success('Review deleted successfully');
                // TODO: Remove the review from the state if necessary
            } else {
                message.error('Failed to delete the review');
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            message.error('An error occurred while deleting the review');
        }
    };

    const confirmDelete = (review: ProductReviewReviewDto) => {
        Modal.confirm({
            title: 'Are you sure you want to delete the review?',
            onOk: () => handleDelete(review.id),
            onCancel: () => { /* No action needed */ },
        });
    };

    const handleReply = (review: ProductReviewReviewDto) => {

        setOpenReplyModal(true);
    }


    return (
        <>
            <ProductRateModal open={openRateModal} onClose={() => setOpenRateModal(false)}
                              reviewFields={Object.entries(product.reviewDto.fieldAverageScore).map(([field, score]) => field)}/>
            <ReplyModal open={openReplyModal} onClose={() => setOpenReplyModal(false)}/>
            <div style={{padding: '20px'}}>
                <Space direction={'vertical'} size={20}>
                    <Card
                        title={ <Title level={1}>{product.name}</Title>}
                        extra={<Typography.Link>#{product.productCategoryName}</Typography.Link>} // TODO: Add link to category page
                    >
                        <Row gutter={[16, 16]} justify="center" align="top">
                            <Col xs={24} md={8}>
                                <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                                    <Image
                                        src={"https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg"}
                                        alt={product.name}
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={16}>
                                <div>
                                    <Title level={1}>{product.price} $</Title>
                                    <div>
                                        <Text strong>Merchant : </Text>
                                        <Typography.Link> {product.topicUserDto.username} </Typography.Link> {/* TODO: Add link to merchant page */}
                                    </div>
                                    <Divider/>
                                    <p>{product.description}</p>
                                    <Flex justify='flex-start' align='center' gap='small'>
                                        <Rate disabled allowHalf defaultValue={product.reviewDto.averageScore}/>
                                        <Typography>{product.reviewDto.averageScore}</Typography>
                                    </Flex>
                                    <Divider/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Space>
                                    <List
                                        grid={{ gutter: 16, column: 3 }}
                                        dataSource={Object.entries(product.reviewDto.fieldAverageScore)}
                                        renderItem={([field, score]) => (
                                            <List.Item>
                                                <Card title={field} size={'small'} extra={score}>
                                                    <Rate allowHalf disabled defaultValue={score / 2}/>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Flex justify='flex-end' align='center' gap='small'>
                            <Button type="primary" icon={<ShoppingCartOutlined/>}>Add to Cart</Button>
                            <Button type="default" icon={<HeartOutlined/>}>Add to Wishlist</Button>
                            <Button type="default" icon={<StarOutlined />} onClick={() => setOpenRateModal(true)}>Rate</Button>
                        </Flex>
                        <Space direction={'horizontal'} >
                        </Space>
                    </Card>
                    <Card title={"Reviews"}>
                        {
                            product.reviewDto.reviews.map((review, index) => (
                                <Card key={index} style={{marginBottom: '10px'}}
                                      extra={
                                          <Space>
                                              {isMerchant && product.topicUserDto.username === localStorage.getItem('username') && ( // TODO username should be stored in the local storage or in the state
                                                  <Typography.Link onClick={() => setOpenReplyModal(true)}>Reply</Typography.Link>
                                              )}
                                              {isAdmin && (
                                                  <Typography.Link onClick={() => confirmDelete(review)}>Delete</Typography.Link>
                                              )}
                                          </Space>
                                      }
                                      title={<Space><Avatar>{review.userDto.username[0]}</Avatar><Text strong>{review.userDto.username}</Text></Space>}
                                >
                                    <Space direction="vertical" style={{width: '100%'}}>

                                        <Space>
                                            <Rate disabled defaultValue={review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length}/>
                                            <span>{review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length}</span>
                                        </Space>
                                        <Space direction="horizontal">
                                            {review.fieldScoreDtos.map((field, index) => (
                                                <div key={index} >
                                                    <strong>{field.reviewFieldDto.label}:</strong> {field.score}
                                                </div>
                                            ))}
                                        </Space>
                                        <Space>
                                            {review.comment}
                                        </Space>
                                        <Divider/>
                                        {review.reviewReplyDto && (<Space direction={'vertical'} style={{width: '100%'}}>
                                            <Card>
                                                <Space>
                                                    <Avatar>{product.topicUserDto.username[0]}</Avatar>
                                                    <Text strong>{product.topicUserDto.username}:</Text>
                                                    <Space>
                                                        {review.reviewReplyDto.content}
                                                    </Space>
                                                </Space>
                                            </Card>
                                        </Space>)}
                                    </Space>
                                </Card>
                            ))
                        }
                    </Card>
                </Space>
            </div>
        </>
    );
};

export default ProductPage