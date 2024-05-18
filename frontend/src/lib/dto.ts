export type RoleDto = {
    id: number;
    name: string;
    authorityDtos: AuthorityDto[];
};

export type AuthorityDto = {
    id: number;
    name: string;
};

export type ReviewFieldDto = {
    id: number;
    label: string;
    minScore: number;
    maxScore: number;
};

export type FieldScoreDto = {
    reviewFieldDto: ReviewFieldDto;
    score: number;
};

export type ReviewUserDto = {
    id: string;
    username: string;
    roleDto: RoleDto;
};

export type ReviewReplyDto = {
    id: number;
    content: string;
};

export type ProductReviewReviewDto = {
    id: number;
    userDto: ReviewUserDto;
    fieldScoreDtos: FieldScoreDto[];
    reviewReplyDto?: ReviewReplyDto;
    comment: string;
};

export type ProductReviewDto = {
    reviews: ProductReviewReviewDto[];
    averageScore: number;
    fieldAverageScore: Record<string, number>;
};

export type BasicUserDto = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: RoleDto;
};

export type ProductDto = {
    id: number;
    name: string;
    description: string;
    topicUserDto: BasicUserDto;
    productCategoryName: string;
    price: number;
    photo: Uint8Array;  // TODO replace with actual type
    reviewDto: ProductReviewDto;
};

export type ProductCategoryDto = {
    id: number;
    name: string;
    description: string;
}

export type ReviewFormDto = {
    id: number;
    productCategoryDto: ProductCategoryDto;
    reviewFieldDtos: ReviewFieldDto[];
}


export type MerchantRequestUserDto = {
    username: string;
    email: string;
    description: string | null;
    firstName: string;
    lastName: string;
    role: RoleDto;
}

export type MerchantRequestDto = {
    id: number;
    merchantRequestUserDto: MerchantRequestUserDto;
    requestDate: string;
    answeredDate: string;
    adminCommment: string;
    status: string;
}



