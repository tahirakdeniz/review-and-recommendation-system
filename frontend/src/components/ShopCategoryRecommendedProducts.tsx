import ShopCategory from "@/components/ShopCategory";
import {useEffect, useState} from "react";
import {ProductDto} from "@/lib/dto";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";

export default function ShopCategoryRecommendedProducts(){
    const [data, setData] = useState<ProductDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fetchRecommendedProducts = async () => {
        try {
            const response = await axios.get(`${baseURL}/recommendations/get`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.status !== 200) {
                setError("Failed to fetch recommended products");
            }
            else {
                setData(response.data as ProductDto[]);
            }
        }
        catch (e) {
            setError(errorHandler(e, "Recommended products"));
            console.error(e)
        }
    }

    useEffect(() => {
        fetchRecommendedProducts();
    }, []);

    return (
        <>
            <ShopCategory title={"Recommended Products"} data={data} full={true}/>
        </>
    );
}