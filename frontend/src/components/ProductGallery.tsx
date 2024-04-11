import { Carousel } from 'antd';

interface ProductGalleryProps {
    images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => (
    <Carousel>
        {images.map((image: string, index: number) => (
            <div key={index}>
                <img src={image} alt={`Product Image ${index + 1}`} style={{ width: '100%' }} />
            </div>
        ))}
    </Carousel>
);

export default ProductGallery;
