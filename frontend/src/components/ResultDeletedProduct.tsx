import {Button, Result} from "antd";
import React from "react";
import {useRouter} from "next/navigation";

type ResultDeletedProductProps = {

}
export default function ResultDeletedProduct({} :ResultDeletedProductProps){
    const router = useRouter();
    return (
        <>
            <Result
                status="warning"
                title="The Product has been deleted."
                extra={
                    <Button onClick={() => router.push('/')}>Back Home</Button>
                }
            />
        </>
    );
}