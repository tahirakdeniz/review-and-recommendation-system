import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '@/lib/const';
import { ProductCategoryDto, ProductCategoryRequest } from '@/lib/dto';

interface CategoryState {
    categories: ProductCategoryDto[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk<ProductCategoryDto[]>('categories/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<ProductCategoryDto[]>(`${baseURL}/product-categories/get`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to fetch categories');
    }
});

export const addCategory = createAsyncThunk<ProductCategoryDto, ProductCategoryRequest>('categories/addCategory', async (categoryRequest, { rejectWithValue }) => {
    try {
        const response = await axios.post<ProductCategoryDto>(`${baseURL}/product-categories`, categoryRequest, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to add category');
    }
});

export const updateCategory = createAsyncThunk<ProductCategoryDto, { id: number, categoryRequest: ProductCategoryRequest }>('categories/updateCategory', async ({ id, categoryRequest }, { rejectWithValue }) => {
    try {
        const response = await axios.put<ProductCategoryDto>(`${baseURL}/product-categories/${id}`, categoryRequest, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to update category');
    }
});

export const deleteCategory = createAsyncThunk<number, number>('categories/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${baseURL}/product-categories/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'Failed to delete category');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ProductCategoryDto[]>) => {
                state.categories = action.payload;
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<ProductCategoryDto>) => {
                state.categories.push(action.payload);
                state.loading = false;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<ProductCategoryDto>) => {
                const index = state.categories.findIndex(category => category.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.categories = state.categories.filter(category => category.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default categorySlice.reducer;
