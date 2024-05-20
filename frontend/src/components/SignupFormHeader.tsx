'use client';
import Image from "next/image";
import Coffee from "@/assets/images/coffee1.svg";
import {Typography} from "antd";

const { Title , Text} = Typography;
export default function SignupFormHeader(){
    return (
        <div className="text-center mb-8">
            <Image src={Coffee.src} alt="Login" width={100} height={100}/>
            <Title>Signup</Title>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et nisl eleifend, dignissim quam vitae,
                iaculis ex. Aenean nec nunc odio. Curabitur quis porttitor mauris, ut faucibus ante. Nulla tempor nec tellus
            </Text>
        </div>
    );
}