import {baseURL} from "@/lib/const";

type FieldScoreDto = {
    reviewFieldDto: ReviewFieldDto;
    score: number;
};

type ReviewFieldDto = {
    id: number;
    label: string;
    minScore: number;
    maxScore: number;
};

type ReviewUserDto = {
    id: number;
    name: string;
};

type ProductReviewReviewDto = {
    id: number;
    userDto: ReviewUserDto;
    fieldScoreDtos: FieldScoreDto[];
};

type ProductReviewDto = {
    reviews: ProductReviewReviewDto[];
    averageScore: number;
    fieldAverageScore: Record<string, number>;
};

type ProductDto = {
    id: number;
    name: string;
    description: string;
    userId: string;
    productCategoryName: string;
    price: number;
    photo: string; // Assuming base64 encoded string for image
    reviewDto: ProductReviewDto;
};

export const productExample: ProductDto = {
    id: 101,
    name: "Super Gadget",
    description: "The latest in gadget technology, offering unmatched performance.",
    userId: "user123",
    productCategoryName: "Electronics",
    price: 299.99,
    photo: "https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_1280.jpg", // Example URL for simplicity
    reviewDto: {
        reviews: [
            {
                id: 1001,
                userDto: {
                    id: 201,
                    name: "John Doe"
                },
                fieldScoreDtos: [
                    {
                        reviewFieldDto: {
                            id: 301,
                            label: "Durability",
                            minScore: 1,
                            maxScore: 10
                        },
                        score: 8
                    },
                    {
                        reviewFieldDto: {
                            id: 302,
                            label: "Performance",
                            minScore: 1,
                            maxScore: 10
                        },
                        score: 9
                    }
                ]
            },
            {
                id: 1002,
                userDto: {
                    id: 202,
                    name: "Jane Smith"
                },
                fieldScoreDtos: [
                    {
                        reviewFieldDto: {
                            id: 303,
                            label: "Design",
                            minScore: 1,
                            maxScore: 10
                        },
                        score: 10
                    },
                    {
                        reviewFieldDto: {
                            id: 304,
                            label: "Value for Money",
                            minScore: 1,
                            maxScore: 10
                        },
                        score: 7
                    }
                ]
            }
        ],
        averageScore: 8.5,
        fieldAverageScore: {
            "Durability": 8,
            "Performance": 9,
            "Design": 10,
            "Value for Money": 7
        }
    }
};


export type { ProductDto, ProductReviewDto, ProductReviewReviewDto, ReviewUserDto, FieldScoreDto, ReviewFieldDto };
