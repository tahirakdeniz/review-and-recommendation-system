import {PostDto} from "@/lib/dto";
import {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";
import {Avatar, Button, Card, Col, Row, Typography} from "antd";
import {CloseCircleOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import {Roles} from "@/lib/enums";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {ForumTopicAddNewMessageModal} from "@/components/ForumTopicAddNewMessageModal";
import {ForumTopicUpdateMessageModal} from "@/components/ForumTopicUpdateMessageModal";

export function ForumPost(props: {
    onClick: () => Promise<void>,
    disabled: boolean,
    post: PostDto,
    refreshPosts: () => void,
}) {
    const [image, setImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user.user)
    const role = localStorage.getItem('role');
    const username = user?.username;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userId = user?.id;

    const getImage = async () => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${baseURL}/users/picture/${props.post.userDto.id}`, {
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

    return <Card style={{marginBottom: 12, minHeight: 60}}>
        {((role === Roles.ADMIN || role === Roles.COMMUNITY_MODERATOR) || props.post.userDto.username === username || props.post.userDto.id === userId) && <Button
            style={{position: "absolute", top: 8, right: 8, backgroundColor: "transparent", border: "none"}}
            icon={<CloseCircleOutlined style={{color: "red"}}/>}
            onClick={props.onClick}
            disabled={props.disabled}
        />}
        {(props.post.userDto.username === username || props.post.userDto.id === userId) && <Button
            style={{position: "absolute", top: 8, right: 36, backgroundColor: "transparent", border: "none"}}
            icon={<EditOutlined style={{color: "blue"}}/>}
            onClick={() => setIsModalOpen(true)}
            disabled={props.disabled}
        />}
        <Row gutter={16}>
            <Col span={5}>
                <Card style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightyellow"
                }}>
                    <Row>
                        <div style={{padding: 4, textAlign: "center"}}>
                            <Avatar size={64} src={props.post.userDto.username === "Anonymous" ? undefined : image} icon={<UserOutlined/>}/>
                            <p>{props.post.userDto.username}</p>
                            <p>{new Date(props.post.creationDate).toLocaleDateString()}</p>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span={14}>
                <Typography.Text>{props.post.content}</Typography.Text>
            </Col>
        </Row>
        <ForumTopicUpdateMessageModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refreshPosts={props.refreshPosts} post={props.post}/>
    </Card>;
}