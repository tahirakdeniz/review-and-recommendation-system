import { Card } from 'antd';

interface ProductInfoProps {
    title: string;
    description: string;
    price: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, description, price }) => (
    <Card title={title} bordered={false}>
        <p>{description}</p>
        <p><b>Price:</b> ${price}</p>
    </Card>
);

export default ProductInfo;
