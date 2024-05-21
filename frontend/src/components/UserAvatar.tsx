import {Avatar, Spin} from "antd";
import {useProfileImage} from "@/lib/useProfileImage";
import {LoadingOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";

type UserAvatarProps = {
    size: number;
}
const LoadingSpin = <Spin indicator={<LoadingOutlined style={{fontSize: 12, color: 'black'}} spin/>}/>

export default function UserAvatar({size} :UserAvatarProps){
    const {image, loading, error} = useProfileImage();

    return (
        <Avatar size={size} src={image} icon={loading ? LoadingSpin : <UserOutlined/>}/>
    );
}