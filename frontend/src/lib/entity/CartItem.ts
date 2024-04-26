import {Product} from "@/lib/redux/features/productManagment/productManagmentSlice";

export interface ICartItem {
    id: number;
    productDto: Product;
    quantity: number;
}
