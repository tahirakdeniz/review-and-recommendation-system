import ProductPage from "@/components/ProductPage";
import {baseURL} from "@/lib/const";
import {ProductDto, productExample} from "@/lib/entity/product";

export default async function Product({params: {productId}}: {params: {productId: string}}) {
    // // TODO handle errors and loading state
    // const response = await fetch(`${baseURL}/products/${productId}`);
    // if (response.ok) {
    //     const data: ProductDto = await response.json();
    //     return (
    //         <ProductPage product={data}/>
    //     )
    // } else {
    //     return <h1>Product not found</h1>
    // }
    return <ProductPage product={productExample}/>
}