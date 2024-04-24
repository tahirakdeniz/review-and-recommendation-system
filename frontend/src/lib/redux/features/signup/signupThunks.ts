import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { registerSuccess, registerFailure } from './signupSlice';
import { baseURL } from "@/lib/const";
import {RootState} from "@/lib/redux/store";

export const registerUser = createAsyncThunk(
    'signup/registerUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const user = state.signup.userRegistrationData;  // Accessing user data from the Redux state

        try {
            const response = await axios.post(`${baseURL}/users/register`, user);
            dispatch(registerSuccess());
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<{ message: string }>;
                if (serverError && serverError.response) {
                    dispatch(registerFailure(serverError.response.data.message));
                    return rejectWithValue(serverError.response.data.message);
                } else {
                    dispatch(registerFailure("An unknown error occurred"));
                    return rejectWithValue("An unknown error occurred");
                }
            } else {
                dispatch(registerFailure("An error occurred that wasn't an Axios error"));
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
            // handle success or navigate to the next part of the application
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<{ message: string }>;
                if (serverError.response) {
                    dispatch(registerFailure(serverError.response.data.message || "An unknown server error occurred"));
                    return rejectWithValue(serverError.response.data.message || "An unknown server error occurred");
                } else {
                    dispatch(registerFailure("Request failed with no response from server"));
                    return rejectWithValue("Request failed with no response from server");
                }
            } else {
                dispatch(registerFailure("An error occurred that wasn't an Axios error"));
                return rejectWithValue("An error occurred that wasn't an Axios error");
            }
        }
    }
);
