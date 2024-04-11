'use client';
import { useState } from 'react';
import FeaturedCarousel from './FeaturedCarousel';
import ThumbnailCarousel from './ThumbnailCarousel';
import {CarouselDataItem} from "@/lib/types";

const mockData: CarouselDataItem[] = [
    {
        image: 'https://via.placeholder.com/600x400?text=Product+1',
        thumbnail: 'https://via.placeholder.com/100x100?text=Thumb+1'
    },
    {
        image: 'https://via.placeholder.com/600x400?text=Product+2',
        thumbnail: 'https://via.placeholder.com/100x100?text=Thumb+2'
    },
];

const CarouselContainer: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <div>
            <FeaturedCarousel data={mockData} onChange={setSelectedIndex} />
            <ThumbnailCarousel data={mockData} selectedIndex={selectedIndex} onSelect={handleSelect} />
        </div>
    );
};

export default CarouselContainer;