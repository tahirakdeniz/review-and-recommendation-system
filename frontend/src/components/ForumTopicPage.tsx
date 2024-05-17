'use client'

import { Avatar, Button, Card, Col, Form, Input, Modal, Pagination, Row, Space, message } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

interface ForumTopicPageProps {
    topicId: string
}

const AddNewMessageModal = ({isModalOpen, setIsModalOpen}) => {

    const handleOk = () => {
        setIsModalOpen(false);
      };
  
    const addNewTopic = async () => {}

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    return (
        <Modal title={"Today is my birthday!!"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea
                    rows={12}
                    placeholder="Message"
                />
            </Space>
        </Modal>
    )
}

const ForumTopicPage: React.FC<ForumTopicPageProps> = ({topicId}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const messages = [
        { id: '1', user: "user1", content: 'Content of message 1 ',  date: '2024-05-12' },
        { id: '2', user: "user2", content: 'Content of message 2',  date: '2024-05-11' },
        { id: '3', user: "user3", content: 'Content of message 3 ',  date: '2024-05-12' },
        { id: '4', user: "user4", content: 'Content of message 4',  date: '2024-05-11' }
    ];
    const topicTitle = "Today is my birthday!!"

    const pageSize = 2;

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMessages = messages.slice(startIndex, endIndex);

 return(
        <div>
        <Card title={topicTitle}>
            {paginatedMessages.map(message => (
                    <Card key={message.id} style={{ marginBottom: 12, minHeight: 60 }} >
                        <Button 
                            style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'transparent', border: 'none' }} 
                            icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                        />
                        <Row gutter={16}>
                            <Col span={5}>
                                <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightyellow' }}>
                                    <Row>
                                        <div style={{ padding: 4, textAlign: 'center' }}>
                                        <Avatar size={86}/>
                                        <p>{<strong>{message.user}</strong>}</p>
                                        <p>{message.user}</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <p>{message.date}</p>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={14}>
                                <p>{message.content}</p>
                            </Col>
                            
                        </Row>
                    </Card>
            ))}
            <div style={{ position: 'relative', left: 16 }}>
                <Button type="primary" onClick={()=>{showModal()}}>Write a Message</Button>
            </div>
            <div style={{ position: 'absolute', right: 16, bottom: 16}}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={messages.length}
                    onChange={handlePageChange}
                />
            </div>
        </Card>
        <AddNewMessageModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
</div>
 )
}
export default ForumTopicPage
