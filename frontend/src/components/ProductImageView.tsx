import {Product} from "@/lib/types";
import {useEffect, useState} from "react";
import axios from "axios";
import {errorHandler} from "@/lib/utils";
import {Image, message, Spin} from "antd";
import NoPhoto from "@/assets/images/no-photos.png";
import {LoadingOutlined} from "@ant-design/icons";

type MerchantProductTableImageViewProps = {
    product: Product;
    width?: number;
    height?: number;
}

export default function ProductImageView({product, width, height} :MerchantProductTableImageViewProps){
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const getImage = async () => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log(product.id)
            const response = await axios.get(`http://localhost:8081/api/v1/products/${product.id}/picture`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            });

            const imageBlob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
        } catch (error) {
            const errorMessage = errorHandler(error, 'Error fetching images');
            messageApi.error(errorMessage);
        }
        setLoading(false);
    };

    useEffect(() => {
        getImage();
    }, [product]);

    if(loading){
        return (
            <div className={`flex items-center justify-center w-full h-[${height}px]`}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>);
    }

    return (
        <div className={`flex items-center justify-center w-full h-[${height}px]`}>
            <Image
                key={product.id}
                src={image ? image : NoPhoto.src}
                alt={product.name}
                width={width}
                height={height}
                preview={!!image}
            />
        </div>
    );

}