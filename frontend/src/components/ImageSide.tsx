import Image from 'next/image';
import React from 'react';

interface ImageSideProps {
    imageSrc: string;
    imageAlt: string;
    isImageOnRight: boolean;
}

const ImageSide: React.FC<ImageSideProps> = ({ imageSrc, imageAlt, isImageOnRight }) => {
    const imageContainerClasses = `hidden md:block md:w-1/2 h-screen relative`;
    const orderClass = isImageOnRight ? 'md:order-last' : 'md:order-first';

    return (
        <div className={`${imageContainerClasses} ${orderClass}`}>
            <Image
                src={imageSrc}
                alt={imageAlt}
                layout="fill"
                objectFit="cover"
                className="select-none pointer-events-none"
            />
        </div>
    );
};

export default ImageSide;
