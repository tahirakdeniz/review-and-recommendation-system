'use client';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {ErrorResponse} from "@/lib/types";
import {Product} from "@/lib/redux/features/productManagment/productManagmentSlice";


export interface User {
    id: string;
    username: string;
    email : string;
    description: string;
    firstName: string;
    lastName: string;
    role:string;
    dateOfBirth: string;
    accountBalance : number;
    purchaseDtos: {
        id: number;
        purchaseItemDtoList: {
            id: number;
            productDto: Product
            priceAtPurchase: number;
            quantity: number;
        }[];
        totalCost: number;
        purchaseDate: string;
    }[]
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    image: string | undefined;
    imageLoading: boolean;
    imageError: string | null;
    hasLoggedIn: boolean;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    image: undefined,
    imageLoading: false,
    imageError: null,
    hasLoggedIn: false
};

const baseURL = 'http://localhost:8081/api/v1/users';

export const fetchUserImage = createAsyncThunk(
    'user/fetchUserImage',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        try {
            const response = await axios.get(`${baseURL}/picture`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'arraybuffer'
            });
            const imageBlob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            return imageUrl;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ErrorResponse>;
                if (serverError && serverError.response) {
                    return rejectWithValue(serverError.response.data.errors[0]?.message);
                } else {
                    return rejectWithValue("An unknown error occurred");
                }
            } else {
                return rejectWithValue("An error occurred that wasn't an Axios error");
            }
        }
    }
);


export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }

        try {
            const response = await axios.get(baseURL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }});
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ErrorResponse>;
                if (serverError && serverError.response) {
                    return rejectWithValue(serverError.response.data.errors[0]?.message);
                } else {
                    return rejectWithValue("An unknown error occurred");
                }
            } else {
                return rejectWithValue("An error occurred that wasn't an Axios error");
            }
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (user: {
        username: string,
        lastName: string,
        firstName: string
        description: string,
        dateOfBirth: string,
    }, { rejectWithValue }) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }
        try {
            const response = await axios.put(`${baseURL}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }});
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ErrorResponse>;
                if (serverError && serverError.response) {
                    return rejectWithValue(serverError.response.data.errors[0]?.message);
                } else {
                    return rejectWithValue("An unknown error occurred");
                }
            } else {
                return rejectWithValue("An error occurred that wasn't an Axios error");
            }
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (UserName: string, { rejectWithValue }) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return rejectWithValue('No access token found');
        }
        try {
            await axios.delete(baseURL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }});
            return UserName;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ErrorResponse>;
                if (serverError && serverError.response) {
                    return rejectWithValue(serverError.response.data.errors[0]?.message);
                } else {
                    return rejectWithValue("An unknown error occurred");
                }
            } else {
                return rejectWithValue("An error occurred that wasn't an Axios error");
            }
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setImage: (state, action) => {
            state.image = action.payload;
            console.log(state.image)
        },
        setHasLoggedIn: (state, action) => {
            state.hasLoggedIn = action.payload;
        },
        logOutUser: (state) => {
            state.user = null;
            state.hasLoggedIn = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            location.reload()
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                if(state.user){
                    state.user.username = action.payload.username
                    state.user.lastName = action.payload.lastName
                    state.user.firstName = action.payload.firstName
                    state.user.description = action.payload.description
                    state.user.dateOfBirth = action.payload.dateOfBirth
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.error = null;
                location.reload()
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUserImage.pending, (state, action) => {
                state.imageLoading = true;
                state.imageError = null;
            })
            .addCase(fetchUserImage.fulfilled, (state, action) => {
                state.imageLoading = false;
                state.image = action.payload;
                state.imageError = null;
            })
            .addCase(fetchUserImage.rejected, (state, action) => {
                state.imageLoading = false;
                state.imageError = action.payload as string;
            });
    }
});
export const { setImage, logOutUser, setHasLoggedIn } = userSlice.actions;
export default userSlice.reducer;
