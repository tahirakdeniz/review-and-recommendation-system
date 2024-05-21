import React, { useEffect, useState } from "react";
import { MerchantRequestDto } from "@/lib/dto";
import axios from "axios";
import { baseURL } from "@/lib/const";
import { Card, Typography, message, Spin } from "antd";
import { AdministrationMerchantRequestTable } from "@/components/AdministrationMerchantRequestTable";
import { errorHandler } from "@/lib/utils";

export function AdministrationMerchantRequestSection() {
    const [pending, setPending] = useState<MerchantRequestDto[]>([]);
    const [approved, setApproved] = useState<MerchantRequestDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const getData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                axios.get(`${baseURL}/merchant-requests/pending`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }),
                axios.get(`${baseURL}/merchant-requests/approved`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                })
            ]);
            if (pendingRes.status === 200) {
                setPending(pendingRes.data);
            } else {
                throw new Error("Failed to fetch pending requests");
            }
            if (approvedRes.status === 200) {
                setApproved(approvedRes.data);
            } else {
                throw new Error("Failed to fetch approved requests");
            }
        } catch (error) {
            const errorMessage = errorHandler(error, 'Get Merchant Requests');
            setError(errorMessage);
            messageApi.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Card title={<Typography.Title level={3}>Merchant Requests</Typography.Title>}>
            {contextHolder}
            <Spin spinning={loading}>
                {error ? (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</div>
                ) : (
                    <div className={"flex justify-between flex-col gap-8"}>
                        <div>
                            <h3 className="text-xl font-semibold">Pending</h3>
                            <AdministrationMerchantRequestTable merchantRequests={pending} fetchData={getData} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Approved</h3>
                            <AdministrationMerchantRequestTable merchantRequests={approved} fetchData={getData} />
                        </div>
                    </div>
                )}
            </Spin>
        </Card>
    );
}
