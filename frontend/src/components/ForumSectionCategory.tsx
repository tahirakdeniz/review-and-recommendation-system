'use client'
import {Card, Col, Row, Space} from "antd";
import ForumCategoryPage from "./ForumCategoryPage";
import Link from "next/link";
import { CommentOutlined } from "@ant-design/icons";

type ForumSectionCategoryProps = {
    title: string;
    subcategories: {
        title: string;
        topicCount: number;
        postCount: number;
    }[];
}
export default function ForumSectionCategory({title, subcategories} :ForumSectionCategoryProps){
    return (
        <>
            <Card title={title}>
                {subcategories.map(subcategory => (
                    <Link href={"/forum/"+subcategory.title}>
                        <Card type="inner" style={{ marginBottom: 5 }}>
                            <Row  align="middle">
                                <Col span={1}><div style={{ fontSize: '24px' }}><CommentOutlined /></div></Col>
                                <Col span={13}><div><strong>{subcategory.title}</strong></div></Col>
                                <Col span={5}><div>Topic: {subcategory.topicCount}</div></Col>
                                <Col span={5}><div>Messages: {subcategory.postCount}</div></Col>
                            </Row>
                        </Card>
                    </Link>

                ))}
                {/*<Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>*/}
                {/*    sub*/}
                {/*</Card>*/}
                {/*<Card*/}
                {/*    style={{ marginTop: 16 }}*/}
                {/*    type="inner"*/}
                {/*    title="Inner Card title"*/}
                {/*    extra={<a href="#">More</a>}*/}
                {/*>*/}
                {/*    Inner Card content*/}
                {/*</Card>*/}
            </Card>
        </>
    );
}