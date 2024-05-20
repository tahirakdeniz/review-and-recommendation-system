import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {WishlistDto, WishListItemDto, AddProductToWishlistRequest, RemoveProductFromWishlistRequest} from '@/lib/dto';
import axios from 'axios';
import {errorHandler} from "@/lib/utils";

interface WishlistState {
    wishlist: WishlistDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    wishlist: null,
    loading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk<WishlistDto>('wishlist/fetchWishlist', async (_, {rejectWithValue}) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.get<WishlistDto>('http://localhost:8081/api/v1/wishlist', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        const errorMessages = errorHandler(error, 'fetchWishlist');
        return rejectWithValue(errorMessages);
    }
});

export const addProductToWishlist = createAsyncThunk<WishListItemDto, AddProductToWishlistRequest>('wishlist/addProduct', async (request, {rejectWithValue}) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.put<WishListItemDto>('http://localhost:8081/api/v1/wishlist/add-product', request, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        const errorMessages = errorHandler(error, 'addProductToWishlist');
        return rejectWithValue(errorMessages);
    }
});

export const removeProductFromWishlist = createAsyncThunk<number, RemoveProductFromWishlistRequest>('wishlist/removeProduct', async (request, {rejectWithValue}) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        await axios.delete('http://localhost:8081/api/v1/wishlist/delete-product', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: request
        });

        return request.id;
    } catch (error) {
        const errorMessages = errorHandler(error, 'removeProductFromWishlist');
        return rejectWithValue(errorMessages);
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistDto>) => {
                state.wishlist = action.payload;
                state.loading = false;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;

                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(addProductToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductToWishlist.fulfilled, (state, action: PayloadAction<WishListItemDto>) => {
                state.loading = false;
                state.wishlist?.wishListItemDtoList.push(action.payload);
            })
            .addCase(addProductToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(removeProductFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProductFromWishlist.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                if (state.wishlist) {
                    state.wishlist.wishListItemDtoList = state.wishlist.wishListItemDtoList.filter(item => item.id !== action.payload);
                }
            })
            .addCase(removeProductFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            });
    },
});

export default wishlistSlice.reducer;
