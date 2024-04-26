import {Card, Rate, Button, Badge, message} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "@/lib/redux/store";
import {addProductToCart, removeProduct} from "@/lib/redux/features/cart/cartSlice";


interface CartItemProps {
    name: string;
    image: string;
    rating: number;
    price: number;
    count: number;
    id?: string
}

export default function CartItem({name, image, rating, price, count, id}: CartItemProps) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <Badge count={count}>
            {contextHolder}
            <Card
                type="inner"
                hoverable
                style={{ width: '100%', textAlign: 'center' }}
                cover={
                    <img alt={name} src={image} style={{ padding: '10px' }} />
                }
                actions={[
                    <Button key='delete' type="primary" danger icon={<DeleteOutlined />} size="small" onClick={async () => {
                        if(id) {
                            const res = await dispatch(removeProduct(Number(id)))
                            if(res.meta.requestStatus == "fulfilled"){
                                messageApi.success("Item Deleted Successfully");
                            }
                        }
                    }}>Delete</Button>,
                    <Button key='add' type="primary" icon={<PlusOutlined />} size="small" onClick={async () => {
                        if(id) {
                            const res = await dispatch(addProductToCart(id))
                            if(res.meta.requestStatus == "fulfilled"){
                                messageApi.success("Item added Successfully");
                            }
                        }
                    }}>Add</Button>
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
