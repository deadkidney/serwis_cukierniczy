interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

export interface RecipeShort {
    id: string;
    title: string;
    tags: string[];
}

export interface RecipeData {
    id: string;
    title: string;
    user_id: string;
    content: string;
    portions: number;
    tags: string[];
    accepted: boolean;
}

export interface UserShort {
    username: string;
    password: string;
}

export interface UserData {
    id: string;
    username: string;
    role: string;
    token: string;
}

export interface LikeData {
    user_id: string;
    recipe_id: string;
}

export interface RatingData {
    user_id: string;
    recipe_id: string;
    value: number
}

export interface CommentData {
    recipe_id: string;
    user_id: string;
    content: string;
}