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
    photo: Uint8Array; // todo change this to THE RIGHT TYPE
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


export type ForumCategoryTopicDto = {
    id: number;
    title: string;
    userDto: BasicUserDto;
    creationDate: string;
    isAnonymous: boolean;
}

export type ForumCategoryHeader = "GENERAL_FIELD" | "Q_A" | "DISCUSSION" | "OTHERS";

export interface ForumCategoryDto {
    id: number;
    name: string;
    description: string;
    topicDtos: ForumCategoryTopicDto[];
    forumCategoryHeader: ForumCategoryHeader;
    topicCount: number;
    messageCount: number;
}




export type TopicPostDto = {
    id: number;
    content: string;
    creationDate: string; // Use string for ISO date format
}

export type TopicForumCategoryDto = {
    id: number;
    name: string;
    description: string;
}

export type TopicDto = {
    id: number;
    title: string;
    userDto: BasicUserDto;
    creationDate: string; // Use string for ISO date format
    postDtos: TopicPostDto[];
    forumCategoryDto: TopicForumCategoryDto;
    isAnonymous: boolean;
    messageCount: number;
}

export type PostDto = {
    id: number;
    content: string;
    creationDate: string; // Use string for ISO date format
    userDto: BasicUserDto;
}

export type WishListItemDto = {
    id: number;
    productDto: ProductDto;
    addedOn: string;
}

export type WishlistDto = {
    id: number;
    wishListItemDtoList: WishListItemDto[];
}


export type AddProductToWishlistRequest = {
    productId: number;
}

export type RemoveProductFromWishlistRequest = {
    id: number;
}

export interface MerchantRequestAnswer {
    message: string;
    isApproved: boolean;
}

export type ProductCategoryRequest = {
    name: string;
    description: string;
}





