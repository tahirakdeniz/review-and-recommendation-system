import {ReviewFormDto} from "@/lib/dto";

export const reviewFormDtosExample: ReviewFormDto[] = [
    {
        id: 1,
        productCategoryDto: {
            id: 1,
            name: "Electronics",
            description: "Devices and gadgets"
        },
        reviewFieldDtos: [
            {
                id: 1,
                label: "Design",
                minScore: 1,
                maxScore: 5
            },
            {
                id: 2,
                label: "Performance",
                minScore: 1,
                maxScore: 5
            },
            {
                id: 3,
                label: "Value for Money",
                minScore: 1,
                maxScore: 5
            }
        ]
    },
    {
        id: 2,
        productCategoryDto: {
            id: 2,
            name: "Books",
            description: "Printed and digital books"
        },
        reviewFieldDtos: [
            {
                id: 4,
                label: "Writing Quality",
                minScore: 1,
                maxScore: 5
            },
            {
                id: 5,
                label: "Content",
                minScore: 1,
                maxScore: 5
            },
            {
                id: 6,
                label: "Value for Money",
                minScore: 1,
                maxScore: 5
            }
        ]
    }
];