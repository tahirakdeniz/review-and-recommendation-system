export default function Product({params: {productId}}: {params: {productId: string}}) {
    return (
        <div>
            <h1>Product</h1>
            <p>Product details {productId}</p>
        </div>
    );
}