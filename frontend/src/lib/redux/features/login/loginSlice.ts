'use client';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '@/lib/redux/store';
import { baseURL } from "@/lib/const";

interface LoginState {
    role: string;
    accessToken: string;
    refreshToken: string;
    loading: boolean;
    error: string | null;
}

const initialState: LoginState = {
    role: '',
    accessToken: '',
    refreshToken: '',
    loading: false,
    error: null
};

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/auth/login`, credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setRole(state, action: PayloadAction<string>) {
            state.role = action.payload;
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        setRefreshToken(state, action: PayloadAction<string>) {
            state.refreshToken = action.payload;
        },
        logout(state) {
            state.role = '';
            state.accessToken = '';
            state.refreshToken = '';
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setRole, setAccessToken, setRefreshToken, logout, clearError } = loginSlice.actions;
export default loginSlice.reducer;
