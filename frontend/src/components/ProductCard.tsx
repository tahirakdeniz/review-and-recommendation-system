import {Card} from 'antd';
import {Product} from "@/lib/types";


const ProductCard = ({ product } : {product: Product} ) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="product" src={product.image} />}
        >
            <Card.Meta title={product.name} description={product.description} />
            {/* Display rating as needed */}
        </Card>
    );
};

export default ProductCard;