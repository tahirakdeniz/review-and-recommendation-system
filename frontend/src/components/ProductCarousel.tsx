import {Product} from "@/lib/types";
import {Carousel} from "antd";

export const ProductCarousel = () => {
    const products: Product[] = [
        {id: 1, name: 'Product 1', price: 100, image: 'https://via.placeholder.com/150', description: 'Product 1 description'},
        {id: 2, name: 'Product 2', price: 200, image: 'https://via.placeholder.com/150', description: 'Product 2 description'},
        {id: 3, name: 'Product 3', price: 300, image: 'https://via.placeholder.com/150', description: 'Product 3 description'},
        {id: 4, name: 'Product 4', price: 400, image: 'https://via.placeholder.com/150', description: 'Product 4 description'},
        {id: 5, name: 'Product 5', price: 500, image: 'https://via.placeholder.com/150', description: 'Product 5 description'},
        {id: 6, name: 'Product 6', price: 600, image: 'https://via.placeholder.com/150', description: 'Product 6 description'},
        {id: 7, name: 'Product 7', price: 700, image: 'https://via.placeholder.com/150', description: 'Product 7 description'},
        {id: 8, name: 'Product 8', price: 800, image: 'https://via.placeholder.com/150', description: 'Product 8 description'},
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };

    return (
        <div className='bg-red-700'>
            <Carousel {...settings}>
                {products.map((product, i) => (
                    <div key={i} className={'bg-red-700 h-60'}>
                        {product.name}
                    </div>
                    // <ProductCard key={product.id} product={product} />
                ))}
            </Carousel>
        </div>
    )
};