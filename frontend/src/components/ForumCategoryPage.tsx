'use client'

import { Avatar, Button, Card, Col, Form, Input, Modal, Row, Space } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import Link from "next/link";
import ForumTopicPage from "./ForumTopicPage";

interface ForumCategoryPageProps {
    categoryId: string;
}

const AddNewTopicModal = ({isModalOpen, setIsModalOpen}) => {

    const handleOk = () => {
        setIsModalOpen(false);
      };
  
    const addNewTopic = async () => {}

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    return (
        <Modal title={"Meeting Area"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
    

    const categories = [
        { id: '1', user: "user1", topic: 'Content of category 1', message: 10, date: '2024-05-12' },
        { id: '2', user: "user2", topic: 'Content of category 2', message: 15, date: '2024-05-11' },
        { id: '3', user: "user3", topic: 'Content of category 3', message: 20, date: '2024-05-10' }
    ];
    const categoryTitle = "Meeting Area"

 return(
        <div>
        <Card title={categoryTitle} style={{ height:630 }}>
            {categories.map(category => (
                <Link href={"/forum/topic/" + category.topic}>
                    <Card key={category.id} style={{ marginBottom: 16 }}>
                        <Button 
                                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'transparent', border: 'none' }} 
                                icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                        />
                        <Row>
                            <Col span={8}>
                                <Meta
                                    avatar={<Avatar src={`url-of-the-avatar-${category.user}`} size={32}/>}
                                    title={<strong>{category.user}</strong>}
                                    description={category.user}
                                />
                            </Col>
                            <Col span={8}>
                                        <p><strong>{category.topic}</strong></p>
                                    </Col>
                            <Col span={4}>
                                <p>Messages: {category.message}</p>
                            </Col>
                            <Col span={4}>
                                <p>{category.date}</p>
                            </Col>
                        </Row>
                    </Card>
                </Link>
            ))}
            <div style={{ position: 'absolute', left: 32, bottom:16 }}>
                <Button type="primary" onClick={()=>{showModal()}}>Create New Topic</Button>
            </div>
        </Card>
        <AddNewTopicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        {/* <List
                    pagination={{ position:'bottom', align:'end' }}
                    dataSource={categories}
                    renderItem={(category, index) => (
                        <List.Item>
                            //Copy link here
                        </List.Item>
                    )}
                /> */}
</div>
 )
}
export default ForumCategoryPage

