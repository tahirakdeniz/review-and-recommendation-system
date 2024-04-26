'use client';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {act} from "react-dom/test-utils";

export interface Product {
    id?: string;
    name: string;
    description: string;
    rate: number;
    productCategoryName: string;
    price: number;
    image?: File;
}

interface ProductsState {
    products: Product[];
    editingProduct: Product | null;
    isEditingModalOpen: boolean;
    isNewModalOpen: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    editingProduct: null,
    isEditingModalOpen: false,
    isNewModalOpen: false,
    loading: false,
    error: null
};

export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        const response = await axios.get<Product[]>('http://localhost:8081/api/v1/products/my-products', {
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

export const addProduct = createAsyncThunk<Product, Partial<Product>>('products/addProduct', async (productData, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return rejectWithValue('No access token found');
    }



    if (productData.name && productData.description && productData.productCategoryName && productData.price) {
        try {
            const response = await axios.post<Product>('http://localhost:8081/api/v1/products/info', {
                name: productData.name,
                description: productData.description,
                productCategoryName: productData.productCategoryName,
                price: productData.price,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            // const productID = response.data.id;
            // const formData = new FormData();
            // if (productData.image) {
            //     formData.append('image', productData.image);
            // }
            // const res = await axios.post<Product>( `http://localhost:8081/api/v1/products/${productID}/image`, formData)
            // return res.data;
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to add product');
        }
    } else {
        return rejectWithValue('Missing product data fields');
    }
});

export const updateProduct = createAsyncThunk<Product, Product>('products/updateProduct', async (productData, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return rejectWithValue('No access token found');
    }
    
    const response = axios.put
    // const formData = new FormData();
    // if (productData.name && productData.description && productData.productCategoryName && productData.price) {
    //     formData.append('addProductRequest', new Blob([JSON.stringify({
    //         name: productData.name,
    //         description: productData.description,
    //         productCategoryName: productData.productCategoryName,
    //         price: productData.price
    //     })]));
    //     if (productData.image) formData.append('image', productData.image);
    //     try {
    //         const response = await axios.put<Product>('http://localhost:8081/api/v1/products', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         return rejectWithValue('Failed to add product');
    //     }
    // } else {
    //     return rejectWithValue('Missing product data fields');
    // }

    if (productData.id) {
        try {
            const response = await axios.put<Product>(`http://localhost:8081/api/v1/products/${productData.id}`, {
                'name': productData.name,
                'description': productData.description,
                'productCategoryName': productData.productCategoryName,
                'price': productData.price,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to update product');
        }
    } else {
        return rejectWithValue('Product ID is missing');
    }
});



export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return rejectWithValue('No access token found');
            }

            const response = await axios.delete(`http://localhost:8081/api/v1/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return productId
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'An error occurred while deleting the product');
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);


const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductField(state, action: PayloadAction<{ field: keyof Product; value: any }>) {
            //state.editingProduct[action.payload.field] = action.payload.value;
        },
        clearEditingProduct(state) {
            state.editingProduct = null;
            state.isEditingModalOpen = false;
        },
        setEditingProduct(state, action: PayloadAction<Product>) {
            state.editingProduct = action.payload;
            state.isEditingModalOpen = true;
        },
        setNewModalOpen(state, action: PayloadAction<boolean>) {
            state.isNewModalOpen = action.payload;
        },
        setEditModalOpen(state, action: PayloadAction<boolean>) {
            state.isEditingModalOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.products = action.payload;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.products.push(action.payload);
                state.editingProduct = null;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) || null;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.stringify(action.payload) as string;
            })
        ;

    }
});

export const { setProductField, clearEditingProduct, setEditingProduct, setNewModalOpen, setEditModalOpen} = productsSlice.actions;
export default productsSlice.reducer;


