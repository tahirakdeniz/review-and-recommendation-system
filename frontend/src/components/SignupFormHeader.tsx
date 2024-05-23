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
            Sign up now to embark on your journey with us. Gain access to exclusive features, personalized recommendations,
            and a community of like-minded individuals. It only takes a moment to join, and it's completely free!
            </Text>
        </div>
    );
}