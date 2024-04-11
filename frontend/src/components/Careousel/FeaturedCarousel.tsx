'use client';
import { Carousel } from 'antd';

const FeaturedCarousel = () => (
    <Carousel autoplay>
        <div>
            <h3 style={{ height: '160px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79' }}>
                Product 1
            </h3>
        </div>
        <div>
            <h3 style={{ height: '160px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79' }}>
                Product 2
            </h3>
        </div>
    </Carousel>
);

export default FeaturedCarousel;