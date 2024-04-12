import { AxiosError, AxiosResponse } from "axios";

export type BaseRequest<T, V> = (params?: T) => Promise<AxiosResponse<V>>;

export type SuccessResponse<V> = {
    code: "success";
    data: V;
};

export type ErrorResponse<E = AxiosError> = {
    code: "error";
    error: E;
};

export type BaseResponse<V, E> = Promise<SuccessResponse<V> | ErrorResponse<E>>;

export const requestHandler =
    <T, V, E = AxiosError>(request: BaseRequest<T, V>) =>
        async (params?: T): Promise<SuccessResponse<V> | ErrorResponse<E>> => {
            try {
                const response = await request(params);
                return { code: "success", data: response.data };
            } catch (e) {
                return { code: "error", error: e as E };
            }
        };