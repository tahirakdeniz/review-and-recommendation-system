import {useState} from "react";
import {Modal, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";
import {ProductReviewReviewDto} from "@/lib/dto";

const {Title} = Typography;
interface ReplyModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (reply: string) => void;
    review?: ProductReviewReviewDto;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({open, onClose, onSubmit}) => {
    const [reply, setReply] = useState( "");

    const handleSubmit = () => {
        onSubmit(reply);
        onClose();
        setReply("");
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