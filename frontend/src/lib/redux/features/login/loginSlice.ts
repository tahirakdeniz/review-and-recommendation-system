'use client';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {baseURL} from "@/lib/const";
import {errorHandler, messageFormatter} from "@/lib/utils";
import {ErrorResponse} from "@/lib/types";

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
            let errorMessage;
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ErrorResponse>;
                if (serverError && serverError.response) {
                    const value = serverError.response.data
                    const errorMessages = value.errors?.map((error) => messageFormatter(error.message)).join(", ")
                    errorMessage =  errorMessages || `Invalid username or password`;
                } else {
                    errorMessage = `An unknown error occurred: ${error}`;
                }
            } else {
                errorMessage = `An error occurred: ${error}`;
            }
            console.error(`An Error Occurred In Login. Error: ${error}. Message: ${errorMessage}`)
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
