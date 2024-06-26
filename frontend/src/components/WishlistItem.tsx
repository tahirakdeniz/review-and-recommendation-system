import {Button, Card, Col, Image, message, Skeleton, Tooltip, Typography} from "antd";
import {WishListItemDto} from "@/lib/dto";
import {useProductImage} from "@/lib/useProductImage";
import {nameFormatter} from "@/lib/utils";
import {useDispatch} from "@/lib/redux/store";
import {addProductToCart} from "@/lib/redux/features/cart/cartSlice";
import {DeleteOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {ImageContainer, StyledCard} from "@/components/StyledCard";

type WishlistItemProps = {
    index: number,
    wishlistItem: WishListItemDto,
    confirmRemove: (productId: number) => void
}

export default function WishlistItem({index, wishlistItem, confirmRemove} :WishlistItemProps){
    const {image, loading, error, noImage} = useProductImage(wishlistItem.productDto.id)
    const dispatch = useDispatch();

    async function handleAddToCart() {
        const res = await dispatch(addProductToCart(wishlistItem.productDto.id))
        if(res.meta.requestStatus === 'fulfilled'){
            message.success('Product added to cart');
        }
        else {
            message.error(`Failed to add product to cart: ${res.payload}`);
        }
    }

    return (
        <>
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                <StyledCard
                    hoverable
                    cover={
                        <ImageContainer>
                            {loading ? <Skeleton.Image style={{ width: '100%', height: '100%' }} /> :
                                <Image alt={wishlistItem.productDto.name} src={image || noImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            }
                        </ImageContainer>
                    }
                    actions={[
                        <Tooltip title={'Remove'} key={'remove'}>
                            <Button key="Remove" type="link" shape={'circle'} danger icon={<DeleteOutlined/>} onClick={() => confirmRemove(wishlistItem.productDto.id)}/>
                        </Tooltip>,
                        <Tooltip title={'Add to Cart'} key={'addToCart'}>
                            <Button key='Add To Cart' type='link' shape={'circle'} icon={<ShoppingCartOutlined/>} onClick={handleAddToCart}/>
                        </Tooltip>
                    ]}
                >
                    <Card.Meta
                        title={<Typography.Link href={`/shop/product/${wishlistItem.productDto.id}`}>{nameFormatter(wishlistItem.productDto.name)}</Typography.Link>}
                        description={`Price: ${wishlistItem.productDto.price}$`}
                    />
                </StyledCard>
            </Col>
        </>
    );
}