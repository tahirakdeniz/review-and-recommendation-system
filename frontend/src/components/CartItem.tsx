import {Card, Rate, Button, Badge} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';

interface CartItemProps {
    name: string;
    image: string;
    rating: number;
    price: number;
}

export default function CartItem({name, image, rating, price}: CartItemProps) {
    // Dummy data for the product card


    return (
        <Badge count={1}>
            <Card
                type="inner"
                hoverable
                style={{ width: '100%', textAlign: 'center' }}
                cover={
                    <img alt={name} src={image} style={{ padding: '10px' }} />
                }
                actions={[
                    <Button key='delete' type="primary" danger icon={<DeleteOutlined />} size="small">Delete</Button>,
                    <Button key='add' type="primary" icon={<PlusOutlined />} size="small">Add</Button>
                ]}
            >
                <Card.Meta title={name} style={{ marginBottom: '10px' }} />
                <Rate allowHalf defaultValue={rating} disabled style={{ fontSize: '16px' }} />
                <div style={{ marginTop: '10px' }}>
                    <span style={{ marginLeft: '10px'}}>${price}</span>
                </div>
            </Card>
        </Badge>
    );
}
