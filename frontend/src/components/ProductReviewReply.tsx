import {BasicUserDto, ReviewReplyDto} from "@/lib/dto";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";
import {Avatar, Card, Space, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";

const {Text} = Typography;

export function ProductReviewReply(props: { topicUserDto: BasicUserDto, reviewReplyDto: ReviewReplyDto }) {
    const [image, setImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return <Space direction={"vertical"} style={{width: "100%"}}>
        <Card>
            <Space>
                <Avatar src={image} icon={<UserOutlined/>}>{props.topicUserDto.username[0]}</Avatar>
                <Text strong>{props.topicUserDto.username}:</Text>
                <Space>
                    {props.reviewReplyDto.content}
                </Space>
            </Space>
        </Card>
    </Space>;
}