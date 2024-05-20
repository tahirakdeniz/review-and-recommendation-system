'use client'
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUserRegistrationData, SignupState} from '@/lib/types';
import {confirmUser, registerUser} from "@/lib/redux/features/signup/signupThunks";

const initialState: SignupState = {
    userRegistrationData: {
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        role: 'user',
        otp: ''
    },
    loading: false,
    error: null,
    success: false,
    step: 0
};

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setField(state, action: PayloadAction<{ field: keyof IUserRegistrationData; value: string }>) {
            state.userRegistrationData[action.payload.field] = action.payload.value;
        },
        setFields(state, action: PayloadAction<{ field: keyof IUserRegistrationData; value: string }[]>) {
            action.payload.forEach(({ field, value }) => {
                state.userRegistrationData[field] = value;
                console.log(state.userRegistrationData[field])
            });
        },
        setStep(state, action: PayloadAction<SignupState['step']>) {
            state.step = action.payload;
        },
        registerStart(state) {
            state.loading = true;
            state.error = null;
        },
        registerSuccess(state) {
            state.loading = false;
            state.error = null;
        },
        registerFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        resetSignup(state) {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                //Object.assign(state, initialState); // reset the state
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = JSON.stringify(action.payload) || "Failed to register user";
            })
            .addCase(confirmUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(confirmUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.step = 2;
            })
            .addCase(confirmUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = JSON.stringify(action.payload) || "Failed to confirm user";
            });
    }
});


export const { setField, setFields, setStep, registerStart, registerSuccess, registerFailure , resetSignup} = signupSlice.actions;
export default signupSlice.reducer;
export type SignupReducer = typeof signupSlice.reducer;
