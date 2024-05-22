import { Badge, Button, Card, message, Rate, Skeleton, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from "@/lib/redux/store";
import { addProductToCart, removeProduct } from "@/lib/redux/features/cart/cartSlice";
import { useRouter } from 'next/navigation';
import { useProductImage } from "@/lib/useProductImage";
import styled from 'styled-components';

interface CartItemProps {
    name: string;
    rating: number;
    price: number;
    count: number;
    id: number;
}

const StyledCard = styled(Card)`
    width: 100%;
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
`;

const StyledButton = styled(Button)`
    margin: 0 5px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
`;

export default function CartItem({ name, rating, price, count, id }: CartItemProps) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const { image, loading, error, noImage } = useProductImage(id);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Badge count={count} offset={[-5, 5]}>
            {contextHolder}
            <StyledCard
                hoverable
                onClick={() => router.push(`/shop/product/${id}`)}
                cover={
                    <ImageContainer>
                        {loading ? <Skeleton.Image style={{ width: '100%', height: '100%' }} /> :
                            <img alt={name} src={image || noImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        }
                    </ImageContainer>
                }
                actions={[
                    <Tooltip title="Delete">
                        <StyledButton key='delete' type="primary" danger icon={<DeleteOutlined />} size="small" onClick={async (e) => {
                            stopPropagation(e);
                            if (id) {
                                const res = await dispatch(removeProduct(id))
                                if (res.meta.requestStatus == "fulfilled") {
                                    messageApi.success("Item Deleted Successfully");
                                }
                            }
                        }} />
                    </Tooltip>,
                    <Tooltip title="Add">
                        <StyledButton key='add' type="primary" icon={<PlusOutlined />} size="small" onClick={async (e) => {
                            stopPropagation(e);
                            if (id) {
                                const res = await dispatch(addProductToCart(id))
                                if (res.meta.requestStatus == "fulfilled") {
                                    messageApi.success("Item added Successfully");
                                }
                            }
                        }} />
                    </Tooltip>
                ]}
            >
                <Card.Meta
                    title={<Tooltip title={name}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div></Tooltip>}
                    description={
                        <div>
                            <Rate allowHalf defaultValue={rating} disabled style={{ fontSize: '18px' }} />
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${price.toFixed(2)}</span>
                            </div>
                        </div>
                    }
                />
            </StyledCard>
        </Badge>
    );
}
