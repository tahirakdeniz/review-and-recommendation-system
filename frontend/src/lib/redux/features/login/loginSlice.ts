'use client';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {baseURL} from "@/lib/const";
import {errorHandler} from "@/lib/utils";

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
            const response = await axios.post(`${baseURL}/users/login`, credentials);
            const data = await response.data
            localStorage.setItem("accessToken", data.access_token)
            localStorage.setItem("role", data.role)
            return response.data;
        } catch (error) {
            const errorMessage = errorHandler(error, "Login User")
            return rejectWithValue(errorMessage)
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
            //localStorage.setItem('accessToken', state.accessToken);

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
                //localStorage.setItem('accessToken', state.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.error(action.payload)
            });
    }
});

export const { setRole, setAccessToken, setRefreshToken, logout, clearError } = loginSlice.actions;
export default loginSlice.reducer;
