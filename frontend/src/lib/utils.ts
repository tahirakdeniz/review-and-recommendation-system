import axios, {AxiosError} from "axios";
import {ErrorResponse} from "@/lib/types";

export const nameFormatter = (name: string): string => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const messageFormatter = (message: string): string => {
    return message.charAt(0).toUpperCase() + message.slice(1);
}

export const errorHandler = (error: any, key:string) => {
    let errorMessage;
    if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ErrorResponse>;
        if (serverError && serverError.response) {
            const value = serverError.response.data
            const errorMessages = value.errors.map((error) => messageFormatter(error.message)).join(", ")
            errorMessage =  errorMessages || "Undefined Server Error";
        } else {
            errorMessage = "An unknown error occurred";
        }
    } else {
        errorMessage = "An error occurred";
    }
    console.error(`An Error Occured In ${key}. Error: ${error}. Message: ${errorMessage}`)
    return errorMessage;
}