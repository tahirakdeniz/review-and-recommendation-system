import {Badge, Button, Card, message, Rate} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "@/lib/redux/store";
import {addProductToCart, removeProduct} from "@/lib/redux/features/cart/cartSlice";
import { useRouter } from 'next/navigation';
import { useProductImage } from "@/lib/useProductImage";


interface CartItemProps {
    name: string;
    rating: number;
    price: number;
    count: number;
    id: number;
}

export default function CartItem({name, rating, price, count, id}: CartItemProps) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const {image, loading, error, noImage} = useProductImage(id);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Badge count={count}>
            {contextHolder}
            <Card
                type="inner"
                hoverable
                onClick={() => router.push(`/shop/product/${id}`)}
                style={{ width: '100%', textAlign: 'center' }}
                cover={
                    loading ? <div>Loading...</div> :
                        <img alt={name} src={image || noImage} style={{ padding: '10px' }} />
                }
                actions={[
                    <Button key='delete' type="primary" danger icon={<DeleteOutlined />} size="small" onClick={async (e) => {
                        stopPropagation(e);
                        if(id) {
                            const res = await dispatch(removeProduct(id))
                            if(res.meta.requestStatus == "fulfilled"){
                                messageApi.success("Item Deleted Successfully");
                            }
                        }
                    }}>Delete</Button>,
                    <Button key='add' type="primary" icon={<PlusOutlined />} size="small" onClick={async (e) => {
                        stopPropagation(e);
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
