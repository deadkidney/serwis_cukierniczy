interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

export interface RecipeData {
    id: number;
    title: string;
    ingredients: Ingredient[]
}
