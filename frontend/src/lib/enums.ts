import {ForumCategoryHeader} from "@/lib/dto";

export namespace Roles {
    export const ADMIN = 'ADMIN'
    export const USER = 'USER'
    export const MERCHANT = 'MERCHANT'
    export const COMMUNITY_MODERATOR = "COMMUNITY_MODERATOR"
}

export namespace CategoryHeaders {
    export const GENERAL_FIELD: ForumCategoryHeader = 'GENERAL_FIELD'
    export const Q_A: ForumCategoryHeader = 'Q_A'
    export const DISCUSSION: ForumCategoryHeader = 'DISCUSSION'
    export const OTHERS: ForumCategoryHeader = 'OTHERS'
    export const allOptions: ForumCategoryHeader[] = [GENERAL_FIELD, Q_A, DISCUSSION, OTHERS]
    export const optionsMap: Record<ForumCategoryHeader, string> = {
        [GENERAL_FIELD]: 'General Field',
        [Q_A]: 'Q&A',
        [DISCUSSION]: 'Discussion',
        [OTHERS]: 'Others'
    }
}