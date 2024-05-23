import {BasicUserDto, ReviewReplyDto} from "@/lib/dto";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";
import {Avatar, Card, Modal, Space, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {ReplyModal} from "@/components/ReplyModal";

const {Text} = Typography;

export function ProductReviewReply(props: {
    topicUserDto: BasicUserDto,
    reviewReplyDto: ReviewReplyDto,
    updateReviewReply: (reviewReplyId: number, content: string) => Promise<void>,
    deleteReviewReply: (reviewReplyId: number) => Promise<void>
}) {
    const [image, setImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useSelector((state: RootState) => state.user)
    const username = user?.username;
    const [open, setOpen] = useState(false);

    const getImage = async () => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${baseURL}/users/picture/${props.topicUserDto.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            });

            const imageBlob = new Blob([response.data], {type: 'image/png'});
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Error fetching images');
            console.log(errorMessage);
        }
        setLoading(false);
    };

    useEffect(() => {
        getImage();
    }, []);

    function confirmDelete() {
        Modal.confirm({
            title: 'Delete reply',
            content: 'Are you sure you want to delete this reply?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                await props.deleteReviewReply(props.reviewReplyDto.id);
            }
        })
    }

    async function updateReviewReply(content: string) {
        await props.updateReviewReply(props.reviewReplyDto.id, content);
    }

    return <Space direction={"vertical"} style={{width: "100%"}}>
        <Card
            extra={
                <Space>
                    {username === props.topicUserDto.username && (
                        <Typography.Link
                            onClick={() => confirmDelete()}>Delete</Typography.Link>
                    )}
                    {username === props.topicUserDto.username && (
                        <Typography.Link
                            onClick={() => setOpen(true)}>Update</Typography.Link>
                    )}
                </Space>
            }
        >
            <Space>
                <Avatar src={image} icon={<UserOutlined/>}>{props.topicUserDto.username[0]}</Avatar>
                <Text strong>{props.topicUserDto.username}:</Text>
                <Space>
                    {props.reviewReplyDto.content}
                </Space>
            </Space>
        </Card>
        <ReplyModal open={open} onClose={() => setOpen(false)} onSubmit={updateReviewReply}/>
    </Space>;
}