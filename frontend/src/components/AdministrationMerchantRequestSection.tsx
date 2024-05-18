import React, {useEffect} from "react";
import {MerchantRequestDto} from "@/lib/dto";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {Card, Typography} from "antd";
import {AdministrationMerchantRequestTable} from "@/components/AdministrationMerchantRequestTable";

export function AdministrationMerchantRequestSection() {
    const [pending, setPending] = React.useState<MerchantRequestDto[]>([]);
    const [approved, setApproved] = React.useState<MerchantRequestDto[]>([]);
    const [rejected, setRejected] = React.useState<MerchantRequestDto[]>([]);

    const getPendings = async () => {
        const res = await axios.get(`${baseURL}/merchant-requests/pending`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        if (res.status == 200) {
            console.log(res.data)
            setPending(res.data)
        }
    }

    const getApproveds = async () => {
        const res = await axios.get(`${baseURL}/merchant-requests/approved`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        if (res.status == 200) {
            console.log(res.data)
            setApproved(res.data)
        }
    }

    const getRejecteds = async () => {
        const res = await axios.get(`${baseURL}/merchant-requests/rejected`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        if (res.status == 200) {
            console.log(res.data)
            setRejected(res.data)
        }
    }

    useEffect(() => {
        getPendings();
        getApproveds();
        getRejecteds();
    }, [])

    return (
        <Card title={<Typography.Title level={3}>Merchant Requests</Typography.Title>}>
            <div className={"flex justify-between flex-col gap-8"}>
                <div>
                    <h3 className="text-xl font-semibold">Pending</h3>
                    <AdministrationMerchantRequestTable merchantRequest={pending}/>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Approved</h3>
                    <AdministrationMerchantRequestTable merchantRequest={approved}/>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Rejected</h3>
                    <AdministrationMerchantRequestTable merchantRequest={rejected}/>
                </div>
            </div>
        </Card>
    );
}