import {Avatar, Card, Col, List, Row, Space, Typography} from "antd";
import {useProductImage} from "@/lib/useProductImage";
import {Product} from "@/lib/redux/features/productManagment/productManagmentSlice";

const { Text, Title } = Typography;

type PurchasedProductListItemProps = {
    item: {
        id: number,
        productDto: Product,
        priceAtPurchase: number,
        quantity: number
    }
}
export default function PurchasedProductItem({item} :PurchasedProductListItemProps){
    const {image, loading, error, noImage} = useProductImage(Number(item.productDto.id))
    return (
        <List.Item key={item.id} style={{ padding: '10px 0' }}>
            <Row align="middle" gutter={16}>
                <Col>
                    <Avatar
                        shape="square"
                        size={64}
                        src={image ? image : noImage}
                        alt={item.productDto.name}
                    />
                </Col>
                <Col flex="auto">
                    <Space direction="vertical">
                        <Text strong><a href={`/shop/product/${item.productDto.id}`}>{item.productDto.name}</a></Text>
                        <Text type="secondary">Price: ${item.priceAtPurchase.toFixed(2)}</Text>
                        <Text type="secondary">Quantity: {item.quantity}</Text>
                    </Space>
                </Col>
            </Row>
        </List.Item>
    );
}