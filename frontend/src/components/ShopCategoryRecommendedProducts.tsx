import ShopCategory from "@/components/ShopCategory";
import {useEffect, useState} from "react";
import {ProductDto} from "@/lib/dto";

export default function ShopCategoryRecommendedProducts(){
    const [data, setData] = useState<ProductDto[]>([]);
    const fetchRecommendedProducts = async () => {
        // TODO implement this
        // try {
        //     const response = await axios.get(`${baseURL}/products/getRecommended`);
        //     if (response.status !== 200) {
        //         setError("Failed to fetch recommended products");
        //     }
        //     else {
        //         setRecommendedProducts(response.data as ProductDto[]);
        //     }
        // }
        // catch (e) {
        //     setError("Failed to fetch recommended products");
        //     console.error(e)
        // }
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