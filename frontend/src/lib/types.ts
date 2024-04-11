export interface UserInfo {
    name: string;
    email: string;
    bio: string;
    avatar: string;
}

// types.ts
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