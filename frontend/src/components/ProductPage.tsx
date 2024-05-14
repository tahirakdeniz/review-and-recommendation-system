'use client';
import { Avatar, Button, Card, Col, Divider, List, Modal, Rate, Row, Space, Typography, message, Input } from "antd";
import { Image } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import { useState } from "react";
import {ProductDto, ProductReviewReviewDto, FieldScoreDto, ReviewFieldDto} from "@/lib/entity/product";
import { useRole } from "@/lib/useRole";
import TextArea from "antd/es/input/TextArea";
import { useImmer } from "use-immer";
import {baseURL} from "@/lib/const";

const { Text, Title } = Typography;

interface ProductPageProps {
    product: ProductDto;
}

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (review: Partial<ProductReviewReviewDto>) => void;
    reviewFields: ReviewFieldDto[];
}

interface ReplyModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (reply: string) => void;
    review: ProductReviewReviewDto;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit, reviewFields }) => {

    const [fieldScores, setFieldScores] = useImmer<FieldScoreDto[]>(reviewFields.map(field => ({
        reviewFieldDto: field,
        score: 0
    })));

    const [comment, setComment] = useState("");

    const handleRateChange = (index: number, score: number) => {
        setFieldScores(draft => {
            draft[index].score = score;
        });
    };

    const handleSubmit = () => {
        onSubmit({
            fieldScoreDtos: fieldScores,
            comment,
        });
        onClose();
    };

    return (
        <Modal
            open={open}
            title={<Title level={3}>Rate Product</Title>}
            onCancel={onClose}
            onOk={handleSubmit}
        >
            {reviewFields.map((field, index) => (
                <div key={index}>
                    <Title level={5}>{field.label}</Title>
                    <Rate onChange={(value) => handleRateChange(index, value)} />
                </div>
            ))}
            <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment"
            />
        </Modal>
    );
};

const ReplyModal: React.FC<ReplyModalProps> = ({ open, onClose, onSubmit, review }) => {
    const [reply, setReply] = useState(review.reviewReplyDto?.content || "");

    const handleSubmit = () => {
        onSubmit(reply);
        onClose();
    };

    return (
        <Modal
            open={open}
            title={<Title level={3}>Reply</Title>}
            onCancel={onClose}
            onOk={handleSubmit}
        >
            <TextArea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Add your reply"
            />
        </Modal>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
    const [productState, updateProduct] = useImmer<ProductDto>(product);
    const [openRateModal, setOpenRateModal] = useState(false);
    const [openReplyModal, setOpenReplyModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState<ProductReviewReviewDto | null>(null);

    const { isAuthorized: isMerchant } = useRole({ role: 'MERCHANT' });
    const { isAuthorized: isAdmin } = useRole({ role: 'ADMIN' });
    const { isAuthorized: isUser } = useRole({ role: 'USER' });

    const handleDelete = async (reviewId: number) => {
        try {
            const response = await fetch(`${baseURL}/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                message.success('Review deleted successfully');
                updateProduct(draft => {
                    draft.reviewDto.reviews = draft.reviewDto.reviews.filter(review => review.id !== reviewId);
                });
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

    const handleReviewSubmit = async (review: Partial<ProductReviewReviewDto>) => {
        // TODO: Send the review to the backend
        updateProduct(draft => {
            draft.reviewDto.reviews.push({
                id: draft.reviewDto.reviews.length + 1,
                userDto: {
                    id: "currentUserId", // Replace with actual user ID
                    username: localStorage.getItem('username') || "currentUsername", // Replace with actual username
                    roleDto: { id: 3, name: 'User', authorityDtos: [] }
                },
                fieldScoreDtos: review.fieldScoreDtos || [],
                comment: review.comment || "",
                reviewReplyDto: undefined
            });
        });
    };

    const handleReplySubmit = async (reply: string) => {
        if (selectedReview) {
            // TODO: Send the reply to the backend
            updateProduct(draft => {
                const review = draft.reviewDto.reviews.find(r => r.id === selectedReview.id);
                if (review) {
                    review.reviewReplyDto = { id: review.id, content: reply };
                }
            });
        }
    };

    return (
        <>
            <ReviewModal
                open={openRateModal}
                onClose={() => setOpenRateModal(false)}
                onSubmit={handleReviewSubmit}
                reviewFields={productState.reviewDto.reviews[0].fieldScoreDtos.map(field => field.reviewFieldDto)} // TODO check if there isn't any review
            />
            {selectedReview && (
                <ReplyModal
                    open={openReplyModal}
                    onClose={() => setOpenReplyModal(false)}
                    onSubmit={handleReplySubmit}
                    review={selectedReview}
                />
            )}
            <div style={{ padding: '20px' }}>
                <Space direction={'vertical'} size={20}>
                    <Card
                        title={<Title level={1}>{productState.name}</Title>}
                        extra={<Typography.Link>#{productState.productCategoryName}</Typography.Link>} // TODO: Add link to category page
                    >
                        <Row gutter={[16, 16]} justify="center" align="top">
                            <Col xs={24} md={8}>
                                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                    <Image
                                        src={"https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg"}
                                        alt={productState.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={16}>
                                <div>
                                    <Title level={1}>{productState.price} $</Title>
                                    <div>
                                        <Text strong>Merchant : </Text>
                                        <Typography.Link> {productState.topicUserDto.username} </Typography.Link> {/* TODO: Add link to merchant page */}
                                    </div>
                                    <Divider />
                                    <p>{productState.description}</p>
                                    <Rate disabled allowHalf defaultValue={productState.reviewDto.averageScore} />
                                    <Typography>{productState.reviewDto.averageScore}</Typography>
                                    <Divider />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <List
                                    grid={{ gutter: 16, column: 3 }}
                                    dataSource={Object.entries(productState.reviewDto.fieldAverageScore)}
                                    renderItem={([field, score]) => (
                                        <List.Item>
                                            <Card title={field} size={'small'} extra={score}>
                                                <Rate allowHalf disabled defaultValue={score / 2} />
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Col>
                        </Row>
                        <Space>
                            <Button type="primary" icon={<ShoppingCartOutlined />}>Add to Cart</Button>
                            <Button type="default" icon={<HeartOutlined />}>Add to Wishlist</Button>
                            {isUser && (
                                <Button type="default" icon={<StarOutlined />} onClick={() => setOpenRateModal(true)}>Rate</Button>
                            )}
                        </Space>
                    </Card>
                    <Card title={"Reviews"}>
                        {
                            productState.reviewDto.reviews.map((review, index) => (
                                <Card key={index} style={{ marginBottom: '10px' }}
                                      extra={
                                          <Space>
                                              {isMerchant && productState.topicUserDto.username === localStorage.getItem('username') && (
                                                  <Typography.Link onClick={() => {
                                                      setSelectedReview(review);
                                                      setOpenReplyModal(true);
                                                  }}>Reply</Typography.Link>
                                              )}
                                              {isAdmin && (
                                                  <Typography.Link onClick={() => confirmDelete(review)}>Delete</Typography.Link>
                                              )}
                                          </Space>
                                      }
                                      title={<Space><Avatar>{review.userDto.username[0]}</Avatar><Text strong>{review.userDto.username}</Text></Space>}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Space>
                                            <Rate disabled defaultValue={review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length} />
                                            <span>{review.fieldScoreDtos.reduce((acc, field) => acc + field.score, 0) / review.fieldScoreDtos.length}</span>
                                        </Space>
                                        <Space direction="horizontal">
                                            {review.fieldScoreDtos.map((field, index) => (
                                                <div key={index}>
                                                    <strong>{field.reviewFieldDto.label}:</strong> {field.score}
                                                </div>
                                            ))}
                                        </Space>
                                        <Space>
                                            {review.comment}
                                        </Space>
                                        <Divider />
                                        {review.reviewReplyDto && (
                                            <Space direction={'vertical'} style={{ width: '100%' }}>
                                                <Card>
                                                    <Space>
                                                        <Avatar>{productState.topicUserDto.username[0]}</Avatar>
                                                        <Text strong>{productState.topicUserDto.username}:</Text>
                                                        <Space>
                                                            {review.reviewReplyDto.content}
                                                        </Space>
                                                    </Space>
                                                </Card>
                                            </Space>
                                        )}
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

export default ProductPage;
