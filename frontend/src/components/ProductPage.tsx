import { Avatar, Button, Card, Col, Divider, Row, Space, Tooltip } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

interface ProductPageProps {
    productId: string;
}

const ProductPage: React.FC<ProductPageProps> = ({productId}) => {
    // Dummy product data, replace with your actual product data
    const product = {
        name: "Product Name",
        image: "https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg",
        price: 100,
        description: "Description",
        seller: "Seller",
        comments: [
            { id: 1, author: "Kullanıcı 1", content: "Yorum 1", datetime: "2024-04-23T12:00:00Z" },
            { id: 2, author: "Kullanıcı 2", content: "Yorum 2", datetime: "2024-04-23T12:00:00Z" }
        ]
    };

    const handleAddToCart = () => {
        // Sepete ekleme işlemleri
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]} justify="center" align="top">
                <Col xs={24} md={8}>
                    <Card
                        cover={<img alt={product.name} src={product.image} style={{ height: '200px', objectFit: 'cover' }} />}
                        style={{ height: '300px' }}
                    >
                        <div className="flex justify-center">
                            <h2>{product.name}</h2>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <h2>Merchant: {product.seller}</h2>
                        <h2>Price: {product.price} TL</h2>
                        <Divider />
                        <p>{product.description}</p>
                        <Divider />
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<ShoppingCartOutlined />} >Add to Cart</Button>{' '}
                            <Button type="default" icon={<HeartOutlined />} >Add to Wishlist</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Divider />
            <div style={{ padding: '20px' }}>
                <h2>Reviews</h2>
                {/* Yorumlar buraya gelecek */}
            </div>
        </div>
    );
};

export default ProductPage