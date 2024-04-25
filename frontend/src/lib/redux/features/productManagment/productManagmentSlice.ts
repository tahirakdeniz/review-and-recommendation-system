'use client';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
    product: Partial<Product>;
    isModalVisible: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    product: {},
    isModalVisible: false,
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

const addProduct = createAsyncThunk<Product, Partial<Product>>('products/addProduct', async (productData, { rejectWithValue }) => {
    const formData = new FormData();
    if (productData.name && productData.description && productData.productCategoryName && productData.price) {
        formData.append('addProductRequest', JSON.stringify({
            name: productData.name,
            description: productData.description,
            productCategoryName: productData.productCategoryName,
            price: productData.price
        }));
        if (productData.image) formData.append('image', productData.image);
        try {
            const response = await axios.post<Product>('http://localhost:8081/api/v1/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to add product');
        }
    } else {
        return rejectWithValue('Missing product data fields');
    }
});

const updateProduct = createAsyncThunk<Product, Product>('products/updateProduct', async (productData, { rejectWithValue }) => {
    if (productData.id) {
        try {
            const response = await axios.put<Product>(`http://localhost:8081/api/v1/products/${productData.id}`, productData);
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

            if (response.status === 204) { // Assuming 204 No Content on successful deletion
                return productId; // Return the ID of the deleted product
            } else {
                return rejectWithValue('Failed to delete the product');
            }
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
            state.product[action.payload.field] = action.payload.value;
        },
        clearProduct(state) {
            state.product = {};
            state.isModalVisible = false;
        },
        setProduct(state, action: PayloadAction<Product>) {
            state.product = action.payload;
            state.isModalVisible = true;
        }
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
                state.error = action.error.message || null;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.products.push(action.payload);
                state.product = {};
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
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
                state.error = action.error.message || null;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the product from the state
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        ;

    }
});

export const { setProductField, clearProduct, setProduct} = productsSlice.actions;
export default productsSlice.reducer;


