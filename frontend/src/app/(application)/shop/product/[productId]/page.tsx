'use client';
import ProductPage from "@/components/ProductPage";
import {baseURL} from "@/lib/const";
import {ProductDto} from "@/lib/dto";
import {useEffect, useState} from "react";
import axios from "axios";
import {Spin} from "antd";

interface ProductProps {
    params: { productId: string };
}

export default function Product({ params: { productId } }: ProductProps) {
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/products/get/${productId}`);
            if (response.status === 200) {
                setProduct(response.data);
            } else {
                setError("Product not found");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Error fetching product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchProduct();
    }, [productId]);

    if (loading) {
        return <Spin fullscreen={true} />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (product) {
        return <ProductPage product={product} fetchProduct={fetchProduct}/>;
    }

    return null;
}