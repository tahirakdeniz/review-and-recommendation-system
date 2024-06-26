'use client';
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Flex,
    Image,
    List,
    message,
    Modal,
    Rate,
    Row,
    Space,
    Spin,
    Typography
} from "antd";
import {HeartOutlined, LoadingOutlined, ShoppingCartOutlined, StarOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {ProductDto, ProductReviewReviewDto, ReviewReplyDto} from "@/lib/dto";
import {useRole} from "@/lib/useRole";
import {useImmer} from "use-immer";
import {baseURL} from "@/lib/const";
import {ReviewModal} from "@/components/ReviewModal";
import {ReplyModal} from "@/components/ReplyModal";
import {RootState, useDispatch} from "@/lib/redux/store";
import {addProductToCart} from "@/lib/redux/features/cart/cartSlice";
import {useSelector} from "react-redux";
import axios from "axios";
import {addProductToWishlist} from "@/lib/redux/features/wishlist/wishlistSlice";
import ProductImageView from "@/components/ProductImageView";
import {useProductImage} from "@/lib/useProductImage";
import {ProductReview} from "@/components/ProductReview";
import {UpdateReviewModal} from "@/components/UpdateReviewModal";
import {fetchProducts} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {errorHandler} from "@/lib/utils";

const {Text, Title} = Typography;

interface ProductPageProps {
    product: ProductDto;
    fetchProduct: () => void;
}


const ProductPage: React.FC<ProductPageProps> = ({product, fetchProduct}) => {
    const [productState, updateProduct] = useImmer<ProductDto>(product);
    const [openRateModal, setOpenRateModal] = useState(false);
    const [openReplyModal, setOpenReplyModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState<ProductReviewReviewDto | null>(null);
    const dispatch = useDispatch();
    const {loading: addToCartLoading, error: addToCartError} = useSelector((state: RootState) => state.cart);
    const [messageApi, contextHolder] = message.useMessage();
    const {image, loading, error, noImage} = useProductImage(product.id);

    const {isAuthorized: isMerchant} = useRole({role: 'MERCHANT'});
    const {isAuthorized: isAdmin} = useRole({role: 'ADMIN'});
    const {isAuthorized: isUser} = useRole({role: 'USER'});

    useEffect(() => {
        if (addToCartError) {
            message.error('Failed to add product to cart');
        }
    }, [addToCartError]);

    const handleDelete = async (reviewId: number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`${baseURL}/reviews/${reviewId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) {
                message.success('Review deleted successfully');
                updateProduct(draft => {
                    draft.reviewDto.reviews = draft.reviewDto.reviews.filter(review => review.id !== reviewId);
                });
            } else {
                message.error(`Failed to delete the review ${response.data}`);
            }
        } catch (error) {
            const errorMessage = errorHandler(error, "Error deleting review");
            message.error(errorMessage);
        }
    };

    const confirmDelete = (review: ProductReviewReviewDto) => {
        Modal.confirm({
            title: 'Are you sure you want to delete the review?',
            onOk: () => handleDelete(review.id),
            onCancel: () => { /* No action needed */
            },
        });
    };

    const handleReplySubmit = async (reply: string) => {
        if (selectedReview) {
            const accessToken = localStorage.getItem('accessToken');
            try {
                const response = await axios.post<ReviewReplyDto>(
                    `${baseURL}/review-reply/${selectedReview.id}`,
                    { content: reply },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    }
                );

                if (response.status === 201) {
                    message.success('Reply submitted successfully');
                    updateProduct(draft => {
                        const review = draft.reviewDto.reviews.find(r => r.id === selectedReview.id);
                        if (review) {
                            review.reviewReplyDto = response.data;
                        }
                    });
                } else {
                    message.error('Failed to submit reply');
                }
            } catch (error) {
                const errorMessage = errorHandler(error, 'Error submitting reply');
                message.error(errorMessage);
            }
        }
    };

    async function handleAddToCart() {
        const res = await dispatch(addProductToCart(product.id));
        if (res.meta.requestStatus === 'fulfilled') {
            message.success('Product added to cart successfully');
        }
    }

    const addToWishlist = async (e: React.MouseEvent, productId: number) => {
        try {
            const res = await dispatch(addProductToWishlist({productId}));
            if (res.meta.requestStatus === 'fulfilled') {
                messageApi.success("Added to Wishlist Successfully");
            } else {
                messageApi.error(`Failed to add to Wishlist: ${res.payload}`);
            }
        } catch (error) {
            messageApi.error("Failed to add to Wishlist");
        }
    }

    function handleAddToWishlist(e : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        addToWishlist(e, product.id);
    }

    async function updateReviewReply(reviewReplyId: number, content: string) {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.put<ReviewReplyDto>(
                `${baseURL}/review-reply/${reviewReplyId}`,
                { content },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                message.success('Reply updated successfully');
                // Update the UI or state here with the new reply content
                updateProduct(draft => {
                    const review = draft.reviewDto.reviews.find(r => r.reviewReplyDto?.id === reviewReplyId);
                    if (review) {
                        review.reviewReplyDto = response.data;
                    }
                });
            } else {
                message.error('Failed to update reply');
            }
        } catch (error) {
            console.error("Error updating reply:", error);
            message.error('An error occurred while updating the reply');
        }
    }

    async function deleteReviewReply(reviewReplyId: number) {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.delete<string>(
                `${baseURL}/review-reply/${reviewReplyId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 204) {
                message.success('Reply deleted successfully');
                // Update the UI or state here to remove the deleted reply
                updateProduct(draft => {
                    draft.reviewDto.reviews.forEach(review => {
                        if (review.reviewReplyDto?.id === reviewReplyId) {
                            review.reviewReplyDto = undefined;
                        }
                    });
                });
            } else {
                message.error('Failed to delete reply');
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
            message.error('An error occurred while deleting the reply');
        }
    }

    return (
        <>
            {contextHolder}
            <ReviewModal
                open={openRateModal}
                onClose={() => setOpenRateModal(false)}
                product={productState}
                onSubmit={(review) => {
                    updateProduct(draft => {
                        draft.reviewDto.reviews.push(review);
                    });
                    setOpenRateModal(false);
                    fetchProduct();
                }}
            />
            {selectedReview && (
                <ReplyModal
                    open={openReplyModal}
                    onClose={() => setOpenReplyModal(false)}
                    onSubmit={handleReplySubmit}
                    review={selectedReview}
                />
            )}
            <Flex style={{padding: '20px'}}>
                <Space direction={'vertical'} size={20} style={{width: '100%'}}>
                    <Card
                        title={<Title level={1}>{productState.name}</Title>}
                        extra={<Typography.Link
                            href={`/shop?category=${productState.productCategoryName}`}>#{productState.productCategoryName}</Typography.Link>}
                        style={{width: '100%'}}
                    >
                        <Row gutter={[16, 16]} justify="center" align="top">
                            <Col xs={24} lg={12}>
                                <Flex align={'center'} justify={'center'} style={{overflow: "hidden"}}>
                                    {loading ? (
                                        <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                                    ) : (
                                        <Image
                                            src={image || noImage}
                                            alt={productState.name}
                                            height={300}
                                        />
                                    )}
                                </Flex>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div>
                                    <Space direction={'vertical'}>
                                        <Title level={1}>{productState.price} $</Title>
                                        <div>
                                            <Text strong>Merchant : </Text>
                                            <Typography.Link> {productState.topicUserDto.username} </Typography.Link> {/* TODO: Add link to merchant page */}
                                        </div>
                                        <Flex align={'center'} justify={'flex-start'} gap={4}>
                                            <Rate disabled allowHalf
                                                  defaultValue={productState.reviewDto.averageScore/2}/>
                                            <Typography.Text>{productState.reviewDto.reviews.length == 0 ? "No Review Found" : productState.reviewDto.averageScore.toFixed(2)}</Typography.Text>
                                        </Flex>
                                    </Space>
                                    <Divider/>
                                    <p>{productState.description}</p>
                                </div>
                            </Col>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col span={24}>
                                <List
                                    grid={{gutter: 16, column: 3}}
                                    dataSource={Object.entries(productState.reviewDto.fieldAverageScore)}
                                    renderItem={([field, score]) => (
                                        <List.Item>
                                            <Card title={field} size={'small'} extra={score.toFixed(2)}>
                                                <Rate allowHalf disabled defaultValue={score / 2} />
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Col>
                        </Row>
                        <Divider/>
                        <Space>
                            <Button type="primary" icon={<ShoppingCartOutlined/>} onClick={handleAddToCart}
                                    loading={addToCartLoading} disabled={addToCartLoading}>Add to Cart</Button>
                            <Button type="default" icon={<HeartOutlined/>} onClick={handleAddToWishlist}>Add to Wishlist</Button>
                            <Button type="default" icon={<StarOutlined/>}
                                    onClick={() => setOpenRateModal(true)}>Review</Button>
                        </Space>
                    </Card>
                    <Card title={"Reviews"}>
                        {productState.reviewDto.reviews.length === 0 &&
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No reviews found."}/>}
                        {
                            productState.reviewDto.reviews.map((review, index) => (
                                <ProductReview key={index} review={review} productState={productState}
                                               confirmDelete={confirmDelete} setSelectedReview={setSelectedReview}
                                               setOpenReplyModal={setOpenReplyModal} isMerchant={isMerchant} isAdmin={isAdmin} fetchProducts={fetchProduct}
                                               updateReviewReply={updateReviewReply} deleteReviewReply={deleteReviewReply}
                                />
                            ))
                        }
                    </Card>
                </Space>
            </Flex>
        </>
    );
};

export default ProductPage;
