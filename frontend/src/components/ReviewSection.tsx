import { List, Rate } from 'antd';
import { Comment } from '@ant-design/compatible';

interface Review {
    author: string;
    content: string;
    rating: number;
}

interface ReviewsSectionProps {
    reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => (
    <List
        dataSource={reviews}
        header={`${reviews.length} ${reviews.length > 1 ? 'reviews' : 'review'}`}
        itemLayout="horizontal"
        renderItem={(review: Review) => (
            <Comment
                author={review.author}
                content={review.content}
                avatar={`https://joeschmoe.io/api/v1/${review.author}`}
            />
        )}
    />
);

export default ReviewsSection;
