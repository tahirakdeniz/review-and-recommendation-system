import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { cartApi } from './cartApi';
import {CartItem} from "@/lib/entity/CartItem";

interface CartState {
    items: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                cartApi.endpoints.getCartItems.matchFulfilled,
                (state, action) => {
                    state.items = action.payload.items;
                }
            )
            .addMatcher(
                cartApi.endpoints.addCartItem.matchFulfilled,
                (state, action) => {
                    state.items.push(action.payload.item);
                }
            )
            .addMatcher(
                cartApi.endpoints.removeCartItem.matchFulfilled,
                (state, action) => {
                    const index = state.items.findIndex(item => item.id === action.payload.itemId);
                    if (index !== -1) {
                        state.items.splice(index, 1);
                    }
                }
            )
            .addMatcher(
                cartApi.endpoints.clearCart.matchFulfilled,
                (state, action) => {
                    state.items = [];
                }
            );
    },
});

export default cartSlice.reducer;