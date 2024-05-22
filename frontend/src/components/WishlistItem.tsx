import {Button, Card, Col, Image} from "antd";
import {WishListItemDto} from "@/lib/dto";
import {useProductImage} from "@/lib/useProductImage";

type WishlistItemProps = {
    index: number,
    wishlistItem: WishListItemDto,
    confirmRemove: (productId: number) => void
}

export default function WishlistItem({index, wishlistItem, confirmRemove} :WishlistItemProps){
    const {image, loading, error, noImage} = useProductImage(wishlistItem.productDto.id)
    return (
        <>
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                    cover={<Image alt={wishlistItem.productDto.name} src={image ? image : noImage} />}
                    actions={[
                        <Button key="Remove" type="link" danger onClick={() => confirmRemove(wishlistItem.productDto.id)}>Remove</Button>,
                    ]}
                >
                    <Card.Meta
                        title={wishlistItem.productDto.name}
                        description={`Price: ${wishlistItem.productDto.price}`}
                    />
                </Card>
            </Col>
        </>
    );
}