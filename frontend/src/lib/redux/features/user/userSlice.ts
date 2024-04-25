'use client';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {ErrorResponse} from "@/lib/types";


export interface User {
    UserName: string;
    description: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    balance : number;
    socialCredit : number;
    email : string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null
};

const baseURL = 'http://localhost:8081/api/v1/users';

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(baseURL);
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
    async (user: User, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${baseURL}/${user.UserName}`, user);
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
        try {
            await axios.delete(`${baseURL}/${UserName}`);
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
            };
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null; // Clears user data on deletion
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default userSlice.reducer;
