interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

export interface RecipeData {
    id: string;
    title: string;
    content: string;
    user_id: number;
    username: string;
}

export interface UserData {
    id: number;
    username: string;
    passwordHash: string;
    role: string;
}