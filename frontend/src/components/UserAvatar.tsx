import {Avatar, Spin} from "antd";
import {LoadingOutlined, UserOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import {fetchUserImage} from "@/lib/redux/features/user/userSlice";
import {useProfileImage} from "@/lib/useProfileImage";

type UserAvatarProps = {
    size: number;
}
const LoadingSpin = <Spin indicator={<LoadingOutlined style={{fontSize: 12, color: 'black'}} spin/>}/>

export default function UserAvatar({size} :UserAvatarProps){
    //const {image, loading, error} = useProfileImage();
    const dispatch = useDispatch();
    const {image, loading, error} = useSelector((state: RootState) => state.user);

    // useEffect(() => {
    //     dispatch(fetchUserImage())
    // }, [dispatch]);

    return (
        <Avatar size={size} src={image} icon={loading ? LoadingSpin : <UserOutlined/>}/>
    );
}