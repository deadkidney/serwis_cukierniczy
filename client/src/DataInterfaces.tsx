interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

export interface RecipeShort {
    id: string;
    title: string;
}

export interface RecipeData {
    id: string;
    title: string;
    content: string;
    user_id: string;
}

export interface UserData {
    id: number;
    username: string;
    passwordHash: string;
    role: string;
}

export interface CommentData {
    recipe_id: string;
    user_id: string;
    content: string;
}

export interface LikeData {
    user_id: string;
    recipe_id: string;
}