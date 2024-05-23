import {Card, Image, message, Skeleton, Tooltip} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "@/lib/redux/store";
import {addProductToCart, removeProduct} from "@/lib/redux/features/cart/cartSlice";
import {useRouter} from 'next/navigation';
import {useProductImage} from "@/lib/useProductImage";
import {ImageContainer, StyledButton, StyledCard} from "@/components/StyledCard";

interface CartItemProps {
    name: string;
    rating: number;
    price: number;
    count: number;
    id: number;
}

export default function CartItem({ name, rating, price, count, id }: CartItemProps) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const { image, loading, error, noImage } = useProductImage(id);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
            <StyledCard
                hoverable
                onClick={() => router.push(`/shop/product/${id}`)}
                cover={
                    <ImageContainer>
                        {loading ? <Skeleton.Image style={{ width: '100%', height: '100%' }} /> :
                            <Image alt={name} src={image || noImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        }
                    </ImageContainer>
                }
                actions={[
                    <Tooltip title="Delete" key={'delete'}>
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
                    <Tooltip title="Add" key={'add'}>
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
                            <span>
                                Count: {count}
                            </span>
                            <div style={{ marginTop: '10px' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${price.toFixed(2)}</span>
                            </div>
                        </div>
                    }
                />
            </StyledCard>
    );
}
