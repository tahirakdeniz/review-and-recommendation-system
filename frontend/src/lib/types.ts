export interface UserInfo {
    name: string;
    email: string;
    bio: string;
    avatar: string;
}

// dto.ts
export interface CarouselDataItem {
    image: string;
    thumbnail: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

export interface IUserRegistrationData {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    role: string;
    otp: string;
}

export interface SignupState {
    userRegistrationData: IUserRegistrationData;
    loading: boolean;
    error: string | null;
    success: boolean;
    step: 0 | 1 | 2;
}

export interface ErrorResponse {
    errors: {message: string}[]
}

export interface Signup1FormData {
}

export interface Signup2FormData {
}

export interface Signup3FormData {
}


