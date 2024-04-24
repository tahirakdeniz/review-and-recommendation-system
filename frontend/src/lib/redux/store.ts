'use client';
import { configureStore } from '@reduxjs/toolkit';
import {cartApi} from "@/lib/redux/features/cart/cartApi";
import cartReducer from "@/lib/redux/features/cart/cartSlice";
import signupReducer from "@/lib/redux/features/signup/signupSlice";
import loginReducer from "@/lib/redux/features/login/loginSlice";
import productReducer from "@/lib/redux/features/productManagment/productManagmentSlice";
import {useDispatch as reduxUseDispatch} from "react-redux";


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        [cartApi.reducerPath]: cartApi.reducer,
        signup: signupReducer,
        login: loginReducer,
        products: productReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => reduxUseDispatch<AppDispatch>();
