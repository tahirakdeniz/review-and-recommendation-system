import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ICartItem} from "@/lib/entity/CartItem";

export interface GetCartItemsResponse {
    items: ICartItem[];
}

export interface AddCartItemParams {
   itemId: ICartItem['id']
}
export interface AddCartItemResponse {
    item: ICartItem;
}

export interface RemoveCartItemParams {
    itemId: ICartItem['id']
}
export interface RemoveCartItemResponse {
    itemId: ICartItem['id']
}

export interface ClearCartResponse {
}

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
    endpoints: (builder) => ({
        getCartItems: builder.query<GetCartItemsResponse, void>({
            query: () => 'cart', // TODO fix this
        }),
        addCartItem: builder.mutation<AddCartItemResponse, AddCartItemParams>({
            query: (item) => ({
                url: 'cart/add',
                method: 'POST',
                body: item,
            }),
        }),
        removeCartItem: builder.mutation<RemoveCartItemResponse, RemoveCartItemParams>({
            query: (itemId) => ({
                url: `cart/remove/${itemId}`,
                method: 'DELETE', // TODO fix this
            }),
        }),
        clearCart: builder.mutation<ClearCartResponse, void>({
            query: () => ({
                url: 'cart/clear',
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetCartItemsQuery,
    useAddCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartApi;
