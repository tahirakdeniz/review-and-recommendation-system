import React from 'react';
import ImageSide from "@/components/ImageSide";
import LoginForm from "@/components/LoginForm";
import cafeImage from "@/assets/images/cafe.png";

export default function Login(){
    return (
        <div className="flex flex-wrap">
            <ImageSide imageSrc={cafeImage.src} imageAlt="Coffee Shop" isImageOnRight={true}/>
            <LoginForm/>
        </div>
    );
}
