import {message, Select} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {baseURL} from "@/lib/const";

interface MerchantProductCategoryProps {
    onChange: (value: string) => void;
    value?: string;
}

interface Category {
    id: string;
    name: string;
}

export function MerchantProductCategorySelect({ onChange, value}: MerchantProductCategoryProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken'); // Get the access token from local storage
        const headers = {
            Authorization: `Bearer ${accessToken}` // Prepare the authorization header
        };

        try {
            const response = await axios.get(`${baseURL}/product-categories/get`, { headers });
            setCategories(response.data); // Assuming the response has the data directly
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            messageApi.error(err.message || 'Failed to fetch categories'); // Using Ant Design's message component to show errors
        }
    };


    return (
        <>
            {contextHolder}
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search Category to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                }
                onChange={(value:any, option:any) => onChange(option.label)}
                loading={loading}
                options={categories.map(category => ({
                    value: category.id,
                    label: category.name,
                }))}
                value={value}
            />
        </>
    );
}
