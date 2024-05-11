import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { cartApi } from './cartApi';
import {ICartItem} from "@/lib/entity/CartItem";
import axios from "axios";
import {
    Product,
} from "@/lib/redux/features/productManagment/productManagmentSlice";

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

interface Cart {
    id: number,
    cartItemDtos: ICartItem[],
    totalPrice: number
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk<Cart>('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.get<Cart>('http://localhost:8081/api/v1/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || 'An error occurred while fetching products');
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
});

export const removeProduct = createAsyncThunk<any, number>('cart/removeProduct', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.put('http://localhost:8081/api/v1/cart/remove-product', {productId: id}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return id;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || 'An error occurred while fetching products');
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
});

export const addProductToCart = createAsyncThunk<ICartItem, string | any>('cart/addProduct', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.put<ICartItem>('http://localhost:8081/api/v1/cart/add-product', {productId: id, quantity:1}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || 'An error occurred while fetching products');
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
});

export const buyProduct = createAsyncThunk<any, any>('cart/buyProduct', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.post('http://localhost:8081/api/v1/cart', {}, config);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || 'Not Enough Balance');
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                console.log(action.payload)
                state.cart = action.payload;
                console.log(state.cart)
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(addProductToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductToCart.fulfilled, (state, action: PayloadAction<ICartItem>) => {
                state.loading = false;
                if(state.cart){
                    const index = state.cart.cartItemDtos.findIndex(cartItem => cartItem.id == action.payload.id)
                    if(index == -1){
                        state.cart.cartItemDtos.push(action.payload);
                    }
                    else {
                        state.cart.cartItemDtos[index].quantity = state.cart.cartItemDtos[index].quantity + 1
                    }
                    state.cart.totalPrice += action.payload.productDto.price;
                }

            })
            .addCase(addProductToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(removeProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.loading = false;
                if(state.cart){
                    const index = state.cart.cartItemDtos.findIndex(cartItem => cartItem.productDto.id = action.payload )
                    console.log(state.cart.cartItemDtos[index])
                }
                // const index = state.cart?.cartItemDTOs.filter(cartItem => cartItem.product.id !== action.payload)//state.findIndex(p => p.id === action.payload.id);
                // if (index !== -1) {
                //     state.products[index] = action.payload;
                // }
                location.reload()
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(buyProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(buyProduct.fulfilled, (state, action) => {
                state.loading = false;
                //state.products = state.products.filter(product => product.id !== action.payload);
                location.reload()
            })
            .addCase(buyProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) as string;
            })
        ;
    },
});

export default cartSlice.reducer;