import { Avatar, Button, Card, Col, Form, Input, Modal, Row, Space } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface ForumCategoryPageProps {
    categoryId: string;
}

const AddNewTopicModal = () => {

    const addNewTopic = async () => {}

    const handleCancel = () => {}

    return (
        <Modal title={"Meeting Area"} open={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Topic"
                />
                <TextArea
                    rows={10}
                    placeholder="Description"
                />
            </Space>
        </Modal>
    )
}

const ForumCategoryPage: React.FC<ForumCategoryPageProps> = ({categoryId}) => {

    const categories = [
        { id: '1', user: "user1", content: 'Content of category 1', message: 10, date: '2024-05-12' },
        { id: '2', user: "user2", content: 'Content of category 2', message: 15, date: '2024-05-11' },
        { id: '3', user: "user3", content: 'Content of category 3', message: 20, date: '2024-05-10' }
    ];
    const categoryTitle = "Meeting Area"

 return(
        <div>
        <Card title={categoryTitle}>
            {categories.map(category => (
                <Card key={category.id} style={{ marginBottom: 16 }}>
                    <Button style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'transparent', border: 'none' }} icon={<CloseCircleOutlined style={{ color: 'red' }} />}></Button>
                    <Row>
                        <Col span={8}>
                            <Meta
                                avatar={<Avatar src={`url-of-the-avatar-${category.user}`} />}
                                title={<strong>{category.user}</strong>}
                                description={category.user}
                            />
                        </Col>
                        <Col span={8}>
                                    <p><strong>{category.content}</strong></p>
                                </Col>
                        <Col span={4}>
                            <p>Messages: {category.message}</p>
                        </Col>
                        <Col span={4}>
                            <p>{category.date}</p>
                        </Col>
                    </Row>
                </Card>
            ))}
            <div style={{ position: 'relative', left: 16 }}>
                <Button type="primary">Create New Topic</Button>
            </div>
        </Card>
        <AddNewTopicModal/>
</div>
 )
}
export default ForumCategoryPage

