import {useImmer} from "use-immer";
import {FieldScoreDto, ProductDto, ProductReviewReviewDto, ReviewFieldDto, ReviewFormDto} from "@/lib/dto";
import {useEffect, useState} from "react";
import {Flex, message, Modal, Rate, Space, Spin, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";

const { Title } = Typography;

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    product: ProductDto;
    onSubmit: (review: ProductReviewReviewDto) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, product, onSubmit, }) => {
    const [reviewFieldScores, setReviewFieldScores] = useImmer<{reviewFieldDto: ReviewFieldDto, score: number}[]>([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviewFormLoading, setReviewFormLoading] = useState(false);

    const getReviewForm = async () => {
        setReviewFormLoading(true);
        try {
            const res = await axios.get<ReviewFormDto>(`${baseURL}/reviews/form?productCategoryName=${product.productCategoryName}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if(res.status === 200 || res.status === 201) {
                setReviewFieldScores(draft => {
                    return res.data.reviewFieldDtos.map(reviewFieldDto => ({
                        reviewFieldDto: reviewFieldDto,
                        score: 0,
                    }));
                });
            }
        }
        catch (error) {
            const errorMessage = errorHandler(error, 'Get Review Form');
            message.error(errorMessage);
        }
        setReviewFormLoading(false);
    }

    useEffect(() => {
        getReviewForm();
        setComment('');
    }, [open]);

    const handleRateChange = (index: number, score: number) => {
        console.log('index', index)
        console.log('score', score);
        setReviewFieldScores(draft => {
            draft[index].score = score * 2;
        });
        console.log('reviewFieldScores', reviewFieldScores)
    };

    const handleSubmit = async () => {
        setLoading(true);

        await submitReview(comment, reviewFieldScores.map(fieldScore => ({
            fieldId: fieldScore.reviewFieldDto.id,
            score: fieldScore.score
        })));

        setLoading(false);
    };

    const submitReview = async (comment: string, fieldScores: { fieldId: number, score: number }[]) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            message.error('You need to be logged in to submit a review');
            return;
        }

        type ReviewSubmitRequest = {
            fieldScores: { fieldId: number, score: number }[];
            comment: string;
        }

        const body: ReviewSubmitRequest = {
            fieldScores: fieldScores,
            comment: comment
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }

        try {
            const response = await axios.post(`http://localhost:8081/api/v1/reviews/${product.id}`, body, config);
            if (response.status === 201) {
                message.success("Review submitted successfully");
                onSubmit(response.data as ProductReviewReviewDto);

            } else {
                message.error("Failed to submit review");
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach((err: { message: string }) => {
                    message.error(err.message);
                });
            } else {
                message.error("Failed to submit review");
            }
            console.error("Failed to submit review", error);
        }
    }

    return (
        <Modal
            open={open}
            title={<Title level={3}>Review Product</Title>}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            okButtonProps={{ disabled: loading || reviewFormLoading}}
        >
            <Space direction={'vertical'} style={{width: '100%'}} size={32}>
                <Space direction={'vertical'} size={1}>
                    {reviewFormLoading ? <Spin /> : (
                        reviewFieldScores?.map((reviewFieldScore, index) => (
                            <div key={index}>
                                <Title level={5}>{reviewFieldScore.reviewFieldDto.label}</Title>
                                <Space direction={'horizontal'}>
                                    <Rate allowHalf onChange={(value) => handleRateChange(index, value)} value={reviewFieldScore.score/2}/>
                                    <Typography.Text>{reviewFieldScore.score}</Typography.Text>
                                </Space>
                            </div>
                        ))
                    )}
                </Space>

                <TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comment"
                />
            </Space>
        </Modal>
    );
};
