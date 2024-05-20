import {createAsyncThunk} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {baseURL} from "@/lib/const";
import {RootState} from "@/lib/redux/store";
import {ErrorResponse} from "@/lib/types";

export const registerUser = createAsyncThunk(
    'signup/registerUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const user = state.signup.userRegistrationData;  // Accessing user data from the Redux state

        try {
            const response = await axios.post(`${baseURL}/users/register`, user);
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

export interface ConfirmUserPayload {
    email: string;
}
export interface ConfirmUserResponse {
    message: string;
}

export const confirmUser = createAsyncThunk<ConfirmUserResponse, void>(
    'signup/confirmUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const email = state.signup.userRegistrationData.email; // Accessing email from the Redux state

        try {
            const response = await axios.post(`${baseURL}/confirmation`, { email });
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
