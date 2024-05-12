import {Card, Space} from "antd";

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
                    <Card type="inner">
                        <Space direction="horizontal" >
                            <div>{subcategory.title}</div>
                            <div>{subcategory.topicCount} topics</div>
                            <div>{subcategory.postCount} posts</div>
                        </Space>
                    </Card>

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