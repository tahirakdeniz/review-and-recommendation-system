// ThumbnailCarousel.tsx
'use client';
import { Carousel } from 'antd';
import {CarouselDataItem} from "@/lib/types";

interface ThumbnailCarouselProps {
    data: CarouselDataItem[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({ data, selectedIndex, onSelect }) => {
    return (
        <div className="thumbnail-carousel">
            <Carousel slidesToShow={5} centerMode focusOnSelect dots={false}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={`thumb ${selectedIndex === index ? 'selected' : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        <img src={item.thumbnail} alt={`Thumb ${index}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ThumbnailCarousel;