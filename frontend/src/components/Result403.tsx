import {Button, Result} from "antd";
import React from "react";
import {useRouter} from "next/navigation";

export default function Result403(){
    const router = useRouter();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
        />
    );
}