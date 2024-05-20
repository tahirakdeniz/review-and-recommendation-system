import React from "react";
import ImageSide from "@/components/ImageSide";
import cafeImage from "@/assets/images/cafe.png";

export default function Layout({children} : {children: React.ReactNode}){
    return (
        <div className="flex flex-wrap">
            <ImageSide imageSrc={cafeImage.src} imageAlt="Coffee Shop" isImageOnRight={false}/>
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-screen">
                {children}
            </div>
        </div>
    );
}