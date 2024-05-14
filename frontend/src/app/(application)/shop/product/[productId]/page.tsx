import ProductPage from "@/components/ProductPage";

export default function Product({params: {productId}}: {params: {productId: string}}) {
    return (
        <ProductPage productId={productId}/>
    );
}