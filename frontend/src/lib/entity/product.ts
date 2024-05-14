// RoleDto.ts
export type RoleDto = {
    id: number;
    name: string;
    authorityDtos: AuthorityDto[];
};

// AuthorityDto.ts
export type AuthorityDto = {
    id: number;
    name: string;
};

// ReviewFieldDto.ts
export type ReviewFieldDto = {
    id: number;
    label: string;
    minScore: number;
    maxScore: number;
};

// FieldScoreDto.ts
export type FieldScoreDto = {
    reviewFieldDto: ReviewFieldDto;
    score: number;
};

// ReviewUserDto.ts
export type ReviewUserDto = {
    id: string;
    username: string;
    roleDto: RoleDto;
};

// ReviewReplyDto.ts
export type ReviewReplyDto = {
    id: number;
    content: string;
};

// ProductReviewReviewDto.ts
export type ProductReviewReviewDto = {
    id: number;
    userDto: ReviewUserDto;
    fieldScoreDtos: FieldScoreDto[];
    reviewReplyDto?: ReviewReplyDto;
    comment: string;
};

// ProductReviewDto.ts
export type ProductReviewDto = {
    reviews: ProductReviewReviewDto[];
    averageScore: number;
    fieldAverageScore: Record<string, number>;
};

// BasicUserDto.ts
export type BasicUserDto = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: RoleDto;
};

// ProductDto.ts
export type ProductDto = {
    id: number;
    name: string;
    description: string;
    topicUserDto: BasicUserDto;
    productCategoryName: string;
    price: number;
    photo: Uint8Array;  // Using Uint8Array for binary data
    reviewDto: ProductReviewDto;
};

// Example instantiation
export const productExample: ProductDto = {
    id: 101,
    name: "Super Gadget",
    description: "The latest in gadget technology, offering unmatched performance.",
    topicUserDto: {
        id: "user123",
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        role: {
            id: 1,
            name: "Admin",
            authorityDtos: [
                { id: 1, name: "Manage Products" },
                { id: 2, name: "View Orders" }
            ]
        }
    },
    productCategoryName: "Electronics",
    price: 399.99,
    photo: new Uint8Array([]), // Assuming empty for the example
    reviewDto: {
        reviews: [
            {
                id: 1,
                userDto: {
                    id: "user201",
                    username: "alice_jones",
                    roleDto: {
                        id: 2,
                        name: "Customer",
                        authorityDtos: []
                    }
                },
                fieldScoreDtos: [
                    {
                        reviewFieldDto: { id: 1, label: "Design", minScore: 1, maxScore: 10 },
                        score: 9
                    },
                    {
                        reviewFieldDto: { id: 2, label: "Performance", minScore: 1, maxScore: 10 },
                        score: 8
                    },
                    {
                        reviewFieldDto: { id: 3, label: "Value for Money", minScore: 1, maxScore: 10 },
                        score: 7
                    }
                ],
                comment: "Great product with sleek design and decent performance.",
                reviewReplyDto: {
                    id: 1,
                    content: "Thank you for your feedback, Alice! We're thrilled you loved the design."
                }
            },
            {
                id: 2,
                userDto: {
                    id: "user202",
                    username: "bob_smith",
                    roleDto: {
                        id: 2,
                        name: "Customer",
                        authorityDtos: []
                    }
                },
                fieldScoreDtos: [
                    {
                        reviewFieldDto: { id: 1, label: "Design", minScore: 1, maxScore: 10 },
                        score: 8
                    },
                    {
                        reviewFieldDto: { id: 2, label: "Performance", minScore: 1, maxScore: 10 },
                        score: 9
                    },
                    {
                        reviewFieldDto: { id: 3, label: "Value for Money", minScore: 1, maxScore: 10 },
                        score: 8
                    }
                ],
                comment: "Performs well for the price, but could use some design improvements.",
                reviewReplyDto: {
                    id: 2,
                    content: "Thanks for your suggestions, Bob! We're always looking to improve."
                }
            }
        ],
        averageScore: 8.17,
        fieldAverageScore: {
            "Design": 8.5,
            "Performance": 8.5,
            "Value for Money": 7.5
        }
    }
};



