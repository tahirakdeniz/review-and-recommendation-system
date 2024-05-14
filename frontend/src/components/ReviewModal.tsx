import {useImmer} from "use-immer";
import {FieldScoreDto, ProductReviewReviewDto, ReviewFieldDto} from "@/lib/entity/product";
import {useState} from "react";
import {Modal, Rate, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";

const {Title} = Typography;

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (review: Partial<ProductReviewReviewDto>) => void;
    reviewFields: ReviewFieldDto[];
}

export const ReviewModal: React.FC<ReviewModalProps> = ({open, onClose, onSubmit, reviewFields}) => {

    const [fieldScores, setFieldScores] = useImmer<FieldScoreDto[]>(reviewFields?.map(field => ({
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
            {reviewFields?.map((field, index) => (
                <div key={index}>
                    <Title level={5}>{field.label}</Title>
                    <Rate onChange={(value) => handleRateChange(index, value)}/>
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