import {useImmer} from "use-immer";
import {FieldScoreDto, ProductReviewReviewDto, ReviewFieldDto} from "@/lib/dto";
import {useState} from "react";
import {Modal, Rate, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";

const { Title } = Typography;

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (review: Partial<ProductReviewReviewDto>) => void;
    reviewFields: ReviewFieldDto[];
    productId: number; // Add productId to the props
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit, reviewFields, productId }) => {
    const [fieldScores, setFieldScores] = useImmer<FieldScoreDto[]>(reviewFields?.map(field => ({
        reviewFieldDto: field,
        score: 0
    })));

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRateChange = (index: number, score: number) => {
        setFieldScores(draft => {
            draft[index].score = score;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const review = {
            fieldScores: fieldScores ? fieldScores.map(fs => ({
                fieldId: fs.reviewFieldDto.id,
                score: fs.score,
            })) : [],
            comment,
        };
        onSubmit(review);
        onClose();
    };

    return (
        <Modal
            open={open}
            title={<Title level={3}>Rate Product</Title>}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            okButtonProps={{ disabled: loading }}
        >
            {reviewFields?.map((field, index) => (
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
